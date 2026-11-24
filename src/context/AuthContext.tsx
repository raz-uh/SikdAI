import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { UserProfile, UserRole, GradeNumber } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUpWithEmail: (
    email: string,
    pass: string,
    displayName: string,
    role: UserRole,
    grade?: GradeNumber,
    specialization?: string
  ) => Promise<void>;
  logInWithEmail: (email: string, pass: string) => Promise<void>;
  logInWithGoogle: (defaultRole?: UserRole, defaultGrade?: GradeNumber) => Promise<void>;
  logOut: () => Promise<void>;
  updateUserRoleAndGrade: (role: UserRole, grade?: GradeNumber, specialization?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch or create user profile from Firestore
  const fetchUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        setUserProfile(data);
        return data;
      } else {
        // Fallback default profile if created via Google Sign In
        const defaultProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'SikdAI User',
          role: 'student',
          grade: 8,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, defaultProfile);
        setUserProfile(defaultProfile);
        return defaultProfile;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    role: UserRole,
    grade?: GradeNumber,
    specialization?: string
  ) => {
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCred.user;

      await updateProfile(user, { displayName });

      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        displayName: displayName || 'User',
        role,
        grade: role === 'student' ? (grade || 8) : undefined,
        subjectSpecialization: role === 'teacher' ? specialization : undefined,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), newProfile);
      setUserProfile(newProfile);
    } finally {
      setLoading(false);
    }
  };

  const logInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } finally {
      setLoading(false);
    }
  };

  const logInWithGoogle = async (defaultRole: UserRole = 'student', defaultGrade: GradeNumber = 8) => {
    setLoading(true);
    try {
      const userCred = await signInWithPopup(auth, googleProvider);
      const user = userCred.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'SikdAI Learner',
          role: defaultRole,
          grade: defaultRole === 'student' ? defaultGrade : undefined,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      } else {
        setUserProfile(userDoc.data() as UserProfile);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUserRoleAndGrade = async (role: UserRole, grade?: GradeNumber, specialization?: string) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const updated: Partial<UserProfile> = {
      role,
      grade: role === 'student' ? grade : undefined,
      subjectSpecialization: role === 'teacher' ? specialization : undefined,
    };
    await setDoc(userDocRef, updated, { merge: true });
    setUserProfile((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const logOut = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signUpWithEmail,
        logInWithEmail,
        logInWithGoogle,
        logOut,
        updateUserRoleAndGrade,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
