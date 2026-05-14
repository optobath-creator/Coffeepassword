"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  User,
  signInAnonymously,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface AppUser extends User {
  reputation?: number;
  badges?: string[];
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: (useRedirect?: boolean) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Auth: Initializing...");
    
    // Check for redirect result on load
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Auth: Redirect sign-in successful", result.user.email);
        }
      })
      .catch((error) => {
        console.error("Auth: Redirect error", error);
        setAuthError(error.message);
      });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth: State changed", firebaseUser ? `User: ${firebaseUser.email}` : "No user");
      
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            console.log("Auth: Creating new user document...");
            const newUser = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || "Anonymous Explorer",
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              reputation: 0,
              badges: [],
              createdAt: serverTimestamp(),
              isAnonymous: firebaseUser.isAnonymous,
            };
            await setDoc(userDocRef, newUser);
            setUser({ ...firebaseUser, ...newUser } as AppUser);
          } else {
            setUser({ ...firebaseUser, ...userDoc.data() } as AppUser);
          }
        } catch (err: unknown) {
          console.error("Auth: Firestore sync error", err);
          setAuthError("Failed to sync user profile.");
          setUser(firebaseUser as AppUser); // Fallback to basic auth user
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (useRedirect = false) => {
    const provider = new GoogleAuthProvider();
    setAuthError(null);
    console.log(`Auth: Attempting Google sign-in (mode: ${useRedirect ? "redirect" : "popup"})...`);
    
    try {
      if (useRedirect) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        console.log("Auth: Popup sign-in successful", result.user.email);
      }
    } catch (error: unknown) {
      console.error("Auth: Sign-in error", error);
      const firebaseError = error as { code?: string; message?: string };
      
      if (firebaseError.code === "auth/unauthorized-domain") {
        setAuthError("This domain is not authorized in Firebase. Please add it to Authorized Domains in the Firebase Console.");
      } else if (firebaseError.code === "auth/configuration-not-found" || firebaseError.message?.includes("CONFIGURATION_NOT_FOUND")) {
        setAuthError("Google Login is not enabled in your Firebase Console. Please go to Authentication > Sign-in method and enable Google.");
      } else {
        setAuthError(firebaseError.message || "An unknown authentication error occurred.");
      }
      throw error;
    }
  };

  const loginAnonymously = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Error signing in anonymously", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        signInWithGoogle,
        signInAnonymously: loginAnonymously,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
