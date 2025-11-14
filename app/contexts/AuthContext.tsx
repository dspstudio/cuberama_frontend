import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isPro: boolean; // New state for pro status
  loading: boolean;
  signOut: () => Promise<{ error: AuthError | null }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isPro: false,
  loading: true,
  signOut: async () => ({ error: null }),
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false); // Initialize pro status
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      const currentUser = session?.user;
      setUser(currentUser ?? null);

      if (currentUser) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('pro_status')
            .eq('id', currentUser.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
          }

          setIsPro(profile?.pro_status || false);
        } catch (error) {
          console.error('Error fetching profile in refreshUser:', error);
          setIsPro(false);
        }
      } else {
        setIsPro(false);
      }
    } catch (error) {
      console.error('Error getting session:', error);
      setSession(null);
      setUser(null);
      setIsPro(false);
    }
  };

  useEffect(() => {
    // Only run on client side to avoid build-time errors
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const getSessionAndProfile = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Error refreshing user:', error);
      } finally {
        setLoading(false);
      }
    };

    getSessionAndProfile();

    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const authStateChangeResult = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (_event === 'USER_UPDATED') {
          return;
        }
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('pro_status')
              .eq('id', session.user.id)
              .single();
            
            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching profile on auth change:', error);
            }
            setIsPro(profile?.pro_status || false);
          } catch (error) {
            console.error('Error fetching profile:', error);
            setIsPro(false);
          }
        } else {
          setIsPro(false);
        }
      });
      
      // Extract subscription from the result
      if (authStateChangeResult?.data?.subscription) {
        subscription = authStateChangeResult.data.subscription;
      }
    } catch (error) {
      console.error('Error setting up auth state change listener:', error);
    }

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return { error: null };
    }

    try {
      const result = await supabase.auth.signOut();
      setIsPro(false); // Reset pro status on sign out
      return result;
    } catch (error) {
      console.error('Error signing out:', error);
      setIsPro(false);
      return { error: error as AuthError };
    }
  };

  const value = {
    session,
    user,
    isPro, // Expose pro status
    loading,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
