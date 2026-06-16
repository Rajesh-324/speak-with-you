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
    return {
      ...data,
      level: data.level || "beginner",
      cefrLevel: data.cefrLevel || "A1",
      placementTestCompleted: data.placementTestCompleted || false,
      xp: data.xp || 0,
      badges: data.badges || [],
      certificates: data.certificates || [],
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
      updatedAt: serverTimestamp(),
    });
  }
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
      updatedAt: serverTimestamp(),
    });
  }
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
