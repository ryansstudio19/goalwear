import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  fbSignOut, 
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  getDoc
} from '../lib/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch or sync user profile
  const fetchProfile = async (userId, userEmail = '') => {
    try {
      // First check Firestore
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setProfile(data);
        return;
      }

      // Check Supabase / fallback
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data);
      } else {
        const defaultProf = {
          id: userId,
          role: userEmail === 'ryantasinff@gmail.com' || userEmail === 'admin@goalwear.com' ? 'admin' : 'customer',
          full_name: userEmail.split('@')[0] || 'Customer',
          phone: ''
        };
        setProfile(defaultProf);
      }
    } catch {
      setProfile({
        id: userId,
        role: userEmail === 'ryantasinff@gmail.com' || userEmail === 'admin@goalwear.com' ? 'admin' : 'customer',
        full_name: 'Customer',
        phone: ''
      });
    }
  };

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribeFirebase = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userObj = {
          id: fbUser.uid,
          email: fbUser.email,
          user_metadata: {
            full_name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Customer',
            phone: fbUser.phoneNumber || ''
          }
        };
        setUser(userObj);
        setSession({ user: userObj, access_token: await fbUser.getIdToken() });
        await fetchProfile(fbUser.uid, fbUser.email);
        setLoading(false);
      } else {
        // Fallback to existing session
        supabase.auth.getSession().then(({ data: { session: localSession } }) => {
          if (localSession?.user) {
            setSession(localSession);
            setUser(localSession.user);
            fetchProfile(localSession.user.id, localSession.user.email);
          } else {
            setUser(null);
            setProfile(null);
            setSession(null);
          }
          setLoading(false);
        });
      }
    });

    return () => {
      unsubscribeFirebase();
    };
  }, []);

  // Google Sign-In with Firebase
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const isAdmin = fbUser.email === 'ryantasinff@gmail.com' || fbUser.email === 'admin@goalwear.com';
      const profileData = {
        uid: fbUser.uid,
        id: fbUser.uid,
        email: fbUser.email,
        fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Customer',
        full_name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Customer',
        phone: fbUser.phoneNumber || '',
        role: isAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', fbUser.uid), profileData, { merge: true });
      } catch (e) {
        console.warn('Firestore profile write error:', e);
      }

      return result;
    } catch (err) {
      console.error('Firebase Google Sign-In error:', err);
      throw err;
    }
  };

  // Customer Sign Up
  const signUp = async ({ email, password, fullName, phone }) => {
    try {
      // Create account with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      const isAdmin = email === 'ryantasinff@gmail.com' || email === 'admin@goalwear.com';
      const profileData = {
        uid: fbUser.uid,
        id: fbUser.uid,
        email: fbUser.email,
        fullName: fullName || email.split('@')[0],
        full_name: fullName || email.split('@')[0],
        phone: phone || '',
        role: isAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', fbUser.uid), profileData);
      } catch (err) {
        console.warn('Firestore user profile sync:', err);
      }

      return { user: fbUser };
    } catch {
      // Seamless local/supabase fallback if network issues
      return await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || ''
          }
        }
      });
    }
  };

  // Customer / Staff Sign In
  const signIn = async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch {
      return await supabase.auth.signInWithPassword({
        email,
        password
      });
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  // Update profile details
  const updateProfile = async (updates) => {
    if (!user) throw new Error('Not authenticated');

    try {
      await setDoc(doc(db, 'users', user.id), updates, { merge: true });
    } catch (e) {
      console.warn('Firestore profile update warning:', e);
    }

    const { data } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    setProfile(prev => ({ ...prev, ...updates, ...data }));
    return data;
  };

  const isStaff = profile?.role && ['staff', 'manager', 'admin', 'owner'].includes(profile.role);
  const isOwner = profile?.role === 'owner' || profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isStaff,
        isOwner,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateProfile,
        refreshProfile: () => user && fetchProfile(user.id, user.email)
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

