"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AppUser {
  uid: string;
  displayName: string;
  photoURL?: string;
  reputation: number;
  badges: string[];
  isAnonymous: boolean;
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
  // Hardcode an anonymous user to keep downstream components happy
  const [user] = useState<AppUser>({
    uid: "anonymous-explorer",
    displayName: "Anonymous Explorer",
    reputation: 0,
    badges: [],
    isAnonymous: true,
  });
  
  const [loading] = useState(false);
  const [authError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Auth: Running in pure anonymous mode.");
  }, []);

  const signInWithGoogle = async () => {
    console.warn("Auth: Google Sign-In is disabled in anonymous mode.");
  };

  const signInAnonymously = async () => {
    console.log("Auth: Already in anonymous mode.");
  };

  const logout = async () => {
    console.warn("Auth: Logout is not applicable in anonymous mode.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        signInWithGoogle,
        signInAnonymously,
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
