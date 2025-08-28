import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  userRoles: string[];
  trustScore: number | null;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [trustScore, setTrustScore] = useState<number | null>(null);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      const roleList = roles?.map(r => r.role) || [];
      setUserRoles(roleList);
      setIsAdmin(roleList.includes('admin'));

      // Assign default user role if no roles exist
      if (roleList.length === 0) {
        await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'user' });
        setUserRoles(['user']);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setUserRoles(['user']);
      setIsAdmin(false);
    }
  };

  const fetchTrustScore = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('calculate_trust_score', {
        user_id_param: userId
      });
      
      if (!error && data !== null) {
        setTrustScore(data);
      }
    } catch (error) {
      console.error('Error fetching trust score:', error);
    }
  };

  const refreshUserData = async () => {
    if (session?.user?.id) {
      await Promise.all([
        fetchUserRoles(session.user.id),
        fetchTrustScore(session.user.id)
      ]);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Clear user data when logging out
        if (!session?.user) {
          setIsAdmin(false);
          setUserRoles([]);
          setTrustScore(null);
        } else {
          // Fetch user roles and trust score when logging in
          setTimeout(() => {
            fetchUserRoles(session.user.id);
            fetchTrustScore(session.user.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        fetchUserRoles(session.user.id);
        fetchTrustScore(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUserRoles([]);
    setTrustScore(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isAdmin, 
      userRoles, 
      trustScore, 
      signOut, 
      refreshUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}