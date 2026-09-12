import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

const SESSION_KEY = 'goalwear_cloud_auth_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save session to localStorage for immediate cross-reload access
  const persistSession = (u, p) => {
    try {
      if (u && p) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ user: u, profile: p, ts: Date.now() }));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {
      console.warn('Session storage warning:', e);
    }
  };

  // Determine admin status
  const checkIsAdmin = (userEmail = '') => {
    const normalized = (userEmail || '').trim().toLowerCase();
    return (
      normalized === 'siyamisaba@gmail.com' ||
      normalized === 'ryantasinff@gmail.com' ||
      normalized === 'admin@goalwear.com' ||
      normalized.includes('admin')
    );
  };

  // Fetch or sync user profile from Supabase
  const fetchProfile = useCallback(async (userObj) => {
    if (!userObj) return null;
    const userId = userObj.id;
    const userEmail = userObj.email || '';
    const meta = userObj.user_metadata || {};
    
    try {
      const { data: prof, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (prof && !error) {
        const fullProf = {
          ...prof,
          role: checkIsAdmin(userEmail || prof.email) ? 'admin' : (prof.role || 'customer'),
          fullName: prof.full_name || prof.fullName || meta.full_name || meta.name || userEmail.split('@')[0] || 'Customer'
        };
        setProfile(fullProf);
        return fullProf;
      }

      // If missing due to race condition with the Postgres trigger, use an in-memory fallback
      const newName = meta.full_name || meta.name || userEmail.split('@')[0] || 'Customer';
      const defaultProf = {
        id: userId,
        uid: userId,
        email: userEmail,
        role: checkIsAdmin(userEmail) ? 'admin' : 'customer',
        full_name: newName,
        fullName: newName,
        phone: meta.phone || '',
        avatarUrl: meta.avatar_url || meta.picture || '',
        authProvider: userObj.app_metadata?.provider || 'email'
      };

      setProfile(defaultProf);
      return defaultProf;
    } catch (err) {
      console.warn('Profile fetch note:', err);
      const newName = meta.full_name || meta.name || userEmail.split('@')[0] || 'Customer';
      const fallback = {
        id: userId,
        uid: userId,
        email: userEmail,
        role: checkIsAdmin(userEmail) ? 'admin' : 'customer',
        full_name: newName,
        fullName: newName,
        phone: meta.phone || ''
      };
      setProfile(fallback);
      return fallback;
    }
  }, []);

  // Initialize and restore session on mount
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      // 1. Try Supabase active session
      try {
        const { data: { session: sbSession } } = await supabase.auth.getSession();
        if (sbSession?.user && mounted) {
          setUser(sbSession.user);
          setSession(sbSession);
          const p = await fetchProfile(sbSession.user);
          setProfile(p);
          persistSession(sbSession.user, p);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase session load note:', err);
      }

      // 2. Fallback to cached local session
      try {
        const cached = localStorage.getItem(SESSION_KEY);
        if (cached && mounted) {
          const parsed = JSON.parse(cached);
          if (parsed?.user) {
            setUser(parsed.user);
            setProfile(parsed.profile || null);
            setSession({ user: parsed.user, access_token: 'gw_' + (parsed.ts || Date.now()) });
          }
        }
      } catch {
        // ignore
      }

      if (mounted) setLoading(false);
    };

    initAuth();

    // 3. Supabase auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      if (currentSession?.user) {
        setUser(currentSession.user);
        setSession(currentSession);
        const p = await fetchProfile(currentSession.user);
        setProfile(p);
        persistSession(currentSession.user, p);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setSession(null);
        persistSession(null, null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign in using Google Identity Services credential (ID token)
  const signInWithGoogleCredential = async (idToken) => {
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        throw error;
      }

      // We do not manually set user or profile here, as the global onAuthStateChange 
      // listener in the useEffect will handle it securely.
      return data;
    } catch (err) {
      console.error('signInWithGoogleCredential error:', err);
      throw err;
    }
  };

  // Google Sign-In with OAuth
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Supabase Google Sign-In error:', err);
      throw err;
    }
  };

  // Customer Sign Up
  const signUp = async ({ email, password, fullName, phone }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (fullName || '').trim();
    const cleanPhone = (phone || '').trim();

    if (!cleanName) {
      const err = new Error('Please enter your full name.');
      err.code = 'auth/missing-name';
      throw err;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      const err = new Error('Please enter a valid email address (e.g. name@example.com).');
      err.code = 'auth/invalid-email';
      throw err;
    }
    if (!password || password.length < 6) {
      const err = new Error('Password must be at least 6 characters long.');
      err.code = 'auth/weak-password';
      throw err;
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          phone: cleanPhone
        }
      }
    });

    if (error) {
      const err = new Error(error.message);
      if (error.message?.toLowerCase().includes('already exists') || error.message?.toLowerCase().includes('already registered')) {
        err.code = 'auth/email-already-in-use';
      } else {
        err.code = 'auth/signup-failed';
      }
      throw err;
    }

    // Wait slightly for the database trigger to create the profile, then fetch it
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Only automatically log in if a session is returned.
    // If Supabase has email confirmation enabled, data.session will be null.
    if (data?.session && data?.user) {
      const userProfile = await fetchProfile(data.user);
      setUser(data.user);
      setProfile(userProfile);
      setSession(data.session);
    }
    
    return { user: data.user, session: data.session };
  };

  // Customer / Staff Sign In
  const signIn = async ({ email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err = new Error('Please provide a valid email address.');
      err.code = 'auth/invalid-email';
      throw err;
    }
    if (!password) {
      const err = new Error('Please enter your account password.');
      err.code = 'auth/wrong-password';
      throw err;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      const err = new Error(error.message);
      if (error.message?.toLowerCase().includes('invalid') || error.message?.toLowerCase().includes('credentials')) {
        err.code = 'auth/wrong-password';
      } else {
        err.code = 'auth/user-not-found';
      }
      throw err;
    }

    const activeUser = data.user;
    const userProfile = await fetchProfile(activeUser);

    setUser(activeUser);
    setProfile(userProfile);
    setSession(data.session);
    persistSession(activeUser, userProfile);

    return { user: activeUser, profile: userProfile };
  };

  // Sign Out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    persistSession(null, null);
  };

  // Update profile details in Supabase & Local State
  const updateProfile = async (updates) => {
    if (!user) throw new Error('Not authenticated');

    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    try {
      await supabase.from('profiles').update(updatedData).eq('id', user.id);
    } catch (e) {
      console.warn('Profile update warning:', e);
    }

    setProfile(prev => {
      const next = { ...prev, ...updatedData };
      persistSession(user, next);
      return next;
    });

    return updatedData;
  };

  const isStaff = profile?.role && ['staff', 'manager', 'admin', 'owner'].includes(profile.role);
  const isOwner = profile?.role === 'owner' || profile?.role === 'admin' || checkIsAdmin(user?.email);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isStaff,
        isOwner,
        isAdmin: isOwner,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithGoogleCredential,
        signOut,
        updateProfile,
        refreshProfile: () => user && fetchProfile(user)
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
