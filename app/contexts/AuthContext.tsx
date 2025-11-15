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
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    const currentUser = session?.user;
    setUser(currentUser ?? null);

    if (currentUser) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('pro_status')
        .eq('id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      setIsPro(profile?.pro_status || false);
    } else {
      setIsPro(false);
    }
  };

  useEffect(() => {
    const getSessionAndProfile = async () => {
      await refreshUser();
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (_event === 'USER_UPDATED') {
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('pro_status')
          .eq('id', session.user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile on auth change:', error);
        }
        setIsPro(profile?.pro_status || false);
      } else {
        setIsPro(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const result = await supabase.auth.signOut();
    setIsPro(false); // Reset pro status on sign out
    return result;
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
