// ============================================================
// Authentication Helpers
// ============================================================

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { createOrUpdateUser } from "./firestore";

const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google popup.
 * Creates/updates user document in Firestore on success.
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Create or update user document in Firestore
    await createOrUpdateUser({
      uid: user.uid,
      displayName: user.displayName || "User",
      name: user.displayName || "User",
      email: user.email || "",
      photoURL: user.photoURL || "",
    });

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

/**
 * Sign out the current user.
 */
export async function signOutUser() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}
