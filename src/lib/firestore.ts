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
    return progressSnap.data() as UserProgress;
  }
  return null;
}

/**
 * Mark a day as completed. Also initializes progress doc if it doesn't exist.
 */
export async function markDayCompleted(uid: string, day: number): Promise<void> {
  const progressRef = doc(db, "progress", uid);
  const progressSnap = await getDoc(progressRef);

  let newStreak = 1;

  if (progressSnap.exists()) {
    const data = progressSnap.data();
    
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

    await updateDoc(progressRef, {
      completedDays: arrayUnion(day),
      lastCompletedDay: day,
      streak: newStreak,
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(progressRef, {
      uid,
      completedDays: [day],
      lastCompletedDay: day,
      streak: 1,
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
