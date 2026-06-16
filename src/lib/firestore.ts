// ============================================================
// Firestore Database Helpers
// ============================================================

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { UserProfile, UserProgress, InterviewSession } from "@/types";

// ----- User Operations -----

/**
 * Create or update a user document in Firestore.
 * Uses merge to avoid overwriting existing data on repeat logins.
 */
export async function createOrUpdateUser(
  user: Omit<UserProfile, "createdAt" | "lastLoginAt">
): Promise<void> {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
  } else {
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
  }
}

/**
 * Get user profile from Firestore.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
}

// ----- Progress Operations -----

/**
 * Get user's lesson progress.
 */
export async function getUserProgress(uid: string): Promise<UserProgress | null> {
  const progressRef = doc(db, "progress", uid);
  const progressSnap = await getDoc(progressRef);
  if (progressSnap.exists()) {
    const data = progressSnap.data() as UserProgress;
    const referralCode = data.referralCode || `SPEAK-${uid.slice(0, 6).toUpperCase()}`;

    // Background operations: process referral rewards and sync leaderboard
    checkAndProcessReferralRewards(uid).catch((err) =>
      console.warn("Background referral check failed:", err)
    );
    syncLeaderboardEntry(uid).catch((err) =>
      console.warn("Background leaderboard sync failed:", err)
    );

    // Self-healing: Ensure public lookup mapping exists
    const codeRef = doc(db, "referralCodes", referralCode);
    getDoc(codeRef).then((snap) => {
      if (!snap.exists()) {
        setDoc(codeRef, { uid }).catch((err) =>
          console.warn("Self-healing referral code failed:", err)
        );
      }
    }).catch(() => {});

    return {
      ...data,
      level: data.level || "beginner",
      cefrLevel: data.cefrLevel || "A1",
      placementTestCompleted: data.placementTestCompleted || false,
      xp: data.xp || 0,
      badges: data.badges || [],
      certificates: data.certificates || [],
      referralCode,
      totalSpeakingMinutes: data.totalSpeakingMinutes || 0,
      wordsLearned: data.wordsLearned || (data.completedDays || []).length * 10,
    };
  }
  return null;
}

/**
 * Save AI Placement Test results to Firestore and set initial level.
 */
export async function savePlacementTestResult(
  uid: string,
  cefrLevel: string,
  assignedTrack: "beginner" | "intermediate" | "advanced",
  placementScore: number
): Promise<void> {
  const progressRef = doc(db, "progress", uid);
  const progressSnap = await getDoc(progressRef);

  const initialXP = 100; // 100 XP for taking the placement test
  const badges = ["placement_hero"];
  const referralCode = `SPEAK-${uid.slice(0, 6).toUpperCase()}`;

  if (progressSnap.exists()) {
    await updateDoc(progressRef, {
      cefrLevel,
      level: assignedTrack,
      placementScore,
      placementTestCompleted: true,
      placementCompletedAt: serverTimestamp(),
      xp: (progressSnap.data().xp || 0) + initialXP,
      badges: arrayUnion(...badges),
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(progressRef, {
      uid,
      completedDays: [],
      lastCompletedDay: 0,
      streak: 0,
      cefrLevel,
      level: assignedTrack,
      placementScore,
      placementTestCompleted: true,
      placementCompletedAt: serverTimestamp(),
      xp: initialXP,
      badges,
      certificates: [],
      referralCode,
      updatedAt: serverTimestamp(),
    });
    // Write public lookup mapping
    await setDoc(doc(db, "referralCodes", referralCode), { uid });
  }

  // Sync leaderboard
  await syncLeaderboardEntry(uid);
}

/**
 * Manually change the user's active level track.
 */
export async function changeUserLevel(
  uid: string,
  newLevel: "beginner" | "intermediate" | "advanced"
): Promise<void> {
  const progressRef = doc(db, "progress", uid);
  await updateDoc(progressRef, {
    level: newLevel,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Mark a day as completed. Also initializes progress doc if it doesn't exist.
 * Awards XP, checks for milestones and updates certificates.
 */
export async function markDayCompleted(uid: string, day: number): Promise<void> {
  const progressRef = doc(db, "progress", uid);
  const progressSnap = await getDoc(progressRef);

  let newStreak = 1;
  let currentXP = 0;
  let currentCompleted: number[] = [];
  let currentBadges: string[] = [];
  let currentCertificates: string[] = [];
  let currentLevel: "beginner" | "intermediate" | "advanced" = "beginner";

  if (progressSnap.exists()) {
    const data = progressSnap.data();
    currentCompleted = data.completedDays || [];
    currentBadges = data.badges || [];
    currentCertificates = data.certificates || [];
    currentXP = data.xp || 0;
    currentLevel = data.level || "beginner";

    // If already completed, just return to prevent double reward
    if (currentCompleted.includes(day)) {
      return;
    }

    let lastUpdated: Date | null = null;
    if (data.updatedAt) {
      lastUpdated = data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
    }

    if (lastUpdated) {
      const today = new Date();
      const date1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const date2 = new Date(lastUpdated.getFullYear(), lastUpdated.getMonth(), lastUpdated.getDate());
      const diffTime = Math.abs(date1.getTime() - date2.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      const currentStreak = data.streak || 0;
      if (diffDays === 0) {
        newStreak = currentStreak || 1;
      } else if (diffDays === 1) {
        newStreak = currentStreak + 1;
      } else {
        newStreak = 1;
      }
    }
  }

  // Calculate rewards
  let xpReward = 50; // Base completion XP
  const newCompleted = [...currentCompleted, day];
  const newBadges = [...currentBadges];
  const newCertificates = [...currentCertificates];

  // 1. Streak milestones
  if (newStreak === 3 && !newBadges.includes("streak_3")) {
    newBadges.push("streak_3");
    xpReward += 30; // Streak bonus
  } else if (newStreak === 7 && !newBadges.includes("streak_7")) {
    newBadges.push("streak_7");
    xpReward += 100;
  } else if (newStreak === 15 && !newBadges.includes("streak_15")) {
    newBadges.push("streak_15");
    xpReward += 250;
  } else if (newStreak === 30 && !newBadges.includes("streak_30")) {
    newBadges.push("streak_30");
    xpReward += 500;
  }

  // 2. Total lessons milestones
  const completedCount = newCompleted.length;
  if (completedCount >= 5 && !newBadges.includes("lessons_5")) {
    newBadges.push("lessons_5");
    xpReward += 50;
  }
  if (completedCount >= 15 && !newBadges.includes("lessons_15")) {
    newBadges.push("lessons_15");
    xpReward += 150;
  }

  // 3. Level completion milestones and certificates
  // Level 1: Day 30
  if (newCompleted.includes(30) && !newBadges.includes("grad_beginner")) {
    newBadges.push("grad_beginner");
    newCertificates.push("beginner_cert");
    xpReward += 200;
  }
  // Level 2: Day 60
  if (newCompleted.includes(60) && !newBadges.includes("grad_intermediate")) {
    newBadges.push("grad_intermediate");
    newCertificates.push("intermediate_cert");
    xpReward += 350;
  }
  // Level 3: Day 90
  if (newCompleted.includes(90) && !newBadges.includes("grad_advanced")) {
    newBadges.push("grad_advanced");
    newCertificates.push("advanced_cert");
    xpReward += 500;
  }
  // Master: All 90 days completed
  if (completedCount === 90 && !newBadges.includes("grad_master")) {
    newBadges.push("grad_master");
    newCertificates.push("master_cert");
    xpReward += 1000;
  }

  const finalXP = currentXP + xpReward;
  const referralCode = `SPEAK-${uid.slice(0, 6).toUpperCase()}`;

  if (progressSnap.exists()) {
    await updateDoc(progressRef, {
      completedDays: arrayUnion(day),
      lastCompletedDay: day,
      streak: newStreak,
      xp: finalXP,
      badges: newBadges,
      certificates: newCertificates,
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(progressRef, {
      uid,
      completedDays: [day],
      lastCompletedDay: day,
      streak: 1,
      level: currentLevel,
      placementTestCompleted: false,
      cefrLevel: "A1",
      xp: finalXP,
      badges: newBadges,
      certificates: newCertificates,
      referralCode,
      updatedAt: serverTimestamp(),
    });
    // Write public lookup mapping
    await setDoc(doc(db, "referralCodes", referralCode), { uid });
  }

  // Sync leaderboard
  await syncLeaderboardEntry(uid);
}

// ----- Interview Operations -----

/**
 * Save a completed interview session.
 */
export async function saveInterviewSession(
  session: Omit<InterviewSession, "id" | "createdAt">
): Promise<string> {
  const interviewRef = doc(collection(db, "interviews"));
  await setDoc(interviewRef, {
    ...session,
    id: interviewRef.id,
    createdAt: serverTimestamp(),
  });
  try {
    await checkAndAwardAchievements(session.uid);
  } catch (err) {
    console.warn("Achievement award failed:", err);
  }
  return interviewRef.id;
}

/**
 * Get all interview sessions for a user, ordered by most recent.
 */
export async function getInterviewHistory(
  uid: string
): Promise<InterviewSession[]> {
  const q = query(
    collection(db, "interviews"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as InterviewSession);
}

/**
 * Get the user's best interview score.
 */
export async function getBestScore(uid: string): Promise<number> {
  const history = await getInterviewHistory(uid);
  if (history.length === 0) return 0;
  return Math.max(...history.map((s) => s.overallScore));
}

/**
 * Increment user's total speaking minutes in Firestore.
 */
export async function incrementSpeakingMinutes(
  uid: string,
  minutesToAdd: number
): Promise<void> {
  const progressRef = doc(db, "progress", uid);
  const progressSnap = await getDoc(progressRef);
  if (progressSnap.exists()) {
    const currentMins = progressSnap.data().totalSpeakingMinutes || 0;
    await updateDoc(progressRef, {
      totalSpeakingMinutes: currentMins + minutesToAdd,
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Save user study plan to Firestore.
 */
export async function saveStudyPlan(
  uid: string,
  plan: string,
  weaknesses: string[]
): Promise<void> {
  const progressRef = doc(db, "progress", uid);
  const progressSnap = await getDoc(progressRef);
  const studyPlanData = {
    plan,
    weaknesses,
    generatedAt: new Date().toISOString(),
  };

  if (progressSnap.exists()) {
    await updateDoc(progressRef, {
      studyPlan: studyPlanData,
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(progressRef, {
      uid,
      completedDays: [],
      lastCompletedDay: 0,
      streak: 0,
      xp: 0,
      level: "beginner",
      cefrLevel: "A1",
      badges: [],
      certificates: [],
      studyPlan: studyPlanData,
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Check total XP and interview performance to unlock badges.
 */
export async function checkAndAwardAchievements(uid: string): Promise<string[]> {
  const progressRef = doc(db, "progress", uid);
  const progressSnap = await getDoc(progressRef);
  if (!progressSnap.exists()) return [];

  const progress = progressSnap.data() as UserProgress;
  const currentBadges = progress.badges || [];
  const newBadges = [...currentBadges];
  let changed = false;
  const newlyEarned: string[] = [];

  // 1. 1000 XP check
  if ((progress.xp || 0) >= 1000 && !newBadges.includes("xp_1000")) {
    newBadges.push("xp_1000");
    newlyEarned.push("xp_1000");
    changed = true;
  }

  // 2. Interview Master check (3+ mock interviews with score >= 8)
  if (!newBadges.includes("interview_master")) {
    const history = await getInterviewHistory(uid);
    const highScoresCount = history.filter((s) => s.overallScore >= 8).length;
    if (highScoresCount >= 3) {
      newBadges.push("interview_master");
      newlyEarned.push("interview_master");
      changed = true;
    }
  }

  if (changed) {
    await updateDoc(progressRef, {
      badges: newBadges,
      updatedAt: serverTimestamp(),
    });
  }

  return newlyEarned;
}

/**
 * Save chat message to the user's friend subcollection for session context
 */
export async function saveFriendMessage(
  uid: string,
  role: "user" | "assistant",
  content: string
): Promise<void> {
  // We can write to a subcollection friendHistory
  const friendMsgRef = doc(collection(db, "users", uid, "friendHistory"));
  await setDoc(friendMsgRef, {
    role,
    content,
    createdAt: serverTimestamp(),
  });
}

/**
 * Fetch friend messages for context
 */
export async function getFriendHistory(
  uid: string,
  limitCount = 20
): Promise<{ role: "user" | "assistant"; content: string }[]> {
  const q = query(
    collection(db, "users", uid, "friendHistory"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((doc) => doc.data() as { role: "user" | "assistant"; content: string; createdAt: any });
  // Reverse to get chronological order
  return docs.slice(0, limitCount).reverse().map(d => ({ role: d.role, content: d.content }));
}

/**
 * Record daily speaking challenge completion, add XP reward, check achievements
 */
export async function completeDailyChallenge(
  uid: string,
  rewardXP = 30
): Promise<void> {
  const progressRef = doc(db, "progress", uid);
  const progressSnap = await getDoc(progressRef);
  if (progressSnap.exists()) {
    const data = progressSnap.data();
    const currentXP = data.xp || 0;
    const currentMins = data.totalSpeakingMinutes || 0;
    
    await updateDoc(progressRef, {
      xp: currentXP + rewardXP,
      totalSpeakingMinutes: currentMins + 2, // Estimate 2 minutes for daily challenge
      updatedAt: serverTimestamp(),
    });
    
    // Check achievements
    await checkAndAwardAchievements(uid);
    // Sync leaderboard
    await syncLeaderboardEntry(uid);
  }
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL: string;
  xp: number;
  streak: number;
}

/**
 * Fetch top learners ranked by XP and Streak directly from the public-safe leaderboard collection
 */
export async function getLeaderboard(): Promise<{ xpLeaderboard: LeaderboardEntry[]; streakLeaderboard: LeaderboardEntry[] }> {
  // 1. Fetch top 15 by XP
  const xpQuery = query(collection(db, "leaderboard"), orderBy("xp", "desc"), limit(15));
  const xpSnapshot = await getDocs(xpQuery);
  
  // 2. Fetch top 15 by Streak
  const streakQuery = query(collection(db, "leaderboard"), orderBy("streak", "desc"), limit(15));
  const streakSnapshot = await getDocs(streakQuery);

  const xpLeaderboard = xpSnapshot.docs.map(doc => doc.data() as LeaderboardEntry);
  const streakLeaderboard = streakSnapshot.docs.map(doc => doc.data() as LeaderboardEntry);

  return { xpLeaderboard, streakLeaderboard };
}

/**
 * Synchronize public-safe fields (uid, displayName, photoURL, xp, streak) to /leaderboard/{uid}
 */
export async function syncLeaderboardEntry(uid: string): Promise<void> {
  try {
    const progressRef = doc(db, "progress", uid);
    const progressSnap = await getDoc(progressRef);
    if (!progressSnap.exists()) return;

    const progressData = progressSnap.data();
    const xp = progressData.xp || 0;
    const streak = progressData.streak || 0;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    const displayName = userSnap.exists()
      ? (userSnap.data().displayName || userSnap.data().name || "Learner")
      : "Learner";
    const photoURL = userSnap.exists() ? (userSnap.data().photoURL || "") : "";

    const leaderboardRef = doc(db, "leaderboard", uid);
    await setDoc(leaderboardRef, {
      uid,
      displayName,
      photoURL,
      xp,
      streak,
    });
  } catch (err) {
    console.error("Failed to sync leaderboard entry:", err);
  }
}

/**
 * Scan the referrals collection for pending claims, credit XP to the referrer, and update.
 */
export async function checkAndProcessReferralRewards(uid: string): Promise<number> {
  try {
    const q = query(
      collection(db, "referrals"),
      where("referrerUid", "==", uid),
      where("processed", "==", false)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return 0;

    let rewardXP = 0;
    for (const d of snapshot.docs) {
      const claimId = d.id;
      // Mark claim as processed
      await updateDoc(doc(db, "referrals", claimId), {
        processed: true,
      });
      rewardXP += 250;
    }

    if (rewardXP > 0) {
      const progressRef = doc(db, "progress", uid);
      const progressSnap = await getDoc(progressRef);
      if (progressSnap.exists()) {
        const currentXP = progressSnap.data().xp || 0;
        await updateDoc(progressRef, {
          xp: currentXP + rewardXP,
          updatedAt: serverTimestamp(),
        });
        await checkAndAwardAchievements(uid);
        await syncLeaderboardEntry(uid);
      }
    }
    return rewardXP;
  } catch (err) {
    console.error("Error processing referral rewards:", err);
    return 0;
  }
}

/**
 * Claim referral XP reward for referee and create a claim record for referrer.
 */
export async function claimReferral(
  uid: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const progressRef = doc(db, "progress", uid);
  const progressSnap = await getDoc(progressRef);
  if (!progressSnap.exists()) {
    return { success: false, error: "Progress not initialized. Complete a lesson first!" };
  }

  const progress = progressSnap.data() as UserProgress;
  if (progress.referredBy) {
    return { success: false, error: "You have already claimed a referral code!" };
  }

  const uppercaseCode = code.trim().toUpperCase();
  if (progress.referralCode === uppercaseCode) {
    return { success: false, error: "You cannot claim your own referral code!" };
  }

  // Lookup the referrer in the public codes collection
  const codeRef = doc(db, "referralCodes", uppercaseCode);
  const codeSnap = await getDoc(codeRef);
  if (!codeSnap.exists()) {
    return { success: false, error: "Referral code not found!" };
  }

  const referrerUid = codeSnap.data().uid;
  if (referrerUid === uid) {
    return { success: false, error: "You cannot claim your own referral code!" };
  }

  // Use referee's UID as document ID in referrals collection to guarantee uniqueness per user
  const claimRef = doc(db, "referrals", uid);
  const claimSnap = await getDoc(claimRef);
  if (claimSnap.exists()) {
    return { success: false, error: "You have already claimed a referral code!" };
  }

  // Save claim in referrals collection (pending status)
  await setDoc(claimRef, {
    refereeUid: uid,
    referrerUid,
    code: uppercaseCode,
    processed: false,
    claimedAt: serverTimestamp(),
  });

  // Credit XP to referee immediately
  await updateDoc(progressRef, {
    referredBy: referrerUid,
    xp: (progress.xp || 0) + 250,
    updatedAt: serverTimestamp(),
  });

  // Sync referee's leaderboard and award achievements
  await syncLeaderboardEntry(uid);
  await checkAndAwardAchievements(uid);

  return { success: true };
}

/**
 * Fetch aggregate platform stats for admin dashboards
 */
export async function getAdminStats(): Promise<{
  totalUsers: number;
  activeUsers: number;
  totalLessonsCompleted: number;
  totalInterviews: number;
}> {
  const usersSnap = await getDocs(collection(db, "users"));
  const progressSnap = await getDocs(collection(db, "progress"));
  const interviewsSnap = await getDocs(collection(db, "interviews"));

  const totalUsers = usersSnap.size;
  const totalInterviews = interviewsSnap.size;

  let activeUsers = 0;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  usersSnap.docs.forEach(doc => {
    const data = doc.data();
    let lastLogin: Date | null = null;
    if (data.lastLoginAt) {
      lastLogin = data.lastLoginAt.toDate ? data.lastLoginAt.toDate() : new Date(data.lastLoginAt);
    }
    if (lastLogin && lastLogin >= sevenDaysAgo) {
      activeUsers++;
    }
  });

  let totalLessonsCompleted = 0;
  progressSnap.docs.forEach(doc => {
    const data = doc.data();
    totalLessonsCompleted += (data.completedDays || []).length;
  });

  return {
    totalUsers,
    activeUsers,
    totalLessonsCompleted,
    totalInterviews,
  };
}
