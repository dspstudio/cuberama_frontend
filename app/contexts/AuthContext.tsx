import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isPro: boolean; // New state for pro status
  loading: boolean;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false); // Initialize pro status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      const currentUser = session?.user;
      setUser(currentUser ?? null);

      if (currentUser) {
        // Check for pro status in profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('pro_status')
          .eq('id', currentUser.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        }

        setIsPro(profile?.pro_status || false);
      }
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
