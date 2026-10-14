import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, AppRole, DEMO_PROFILES } from '@zenith/shared';
import { supabase, isSupabaseConfigured } from '../services/supabase';

export type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated' | 'error';

interface AuthContextType {
  status: AuthStatus;
  user: Profile | null;
  error: string | null;
  isLiveBackend: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  loginAsRole: (role: AppRole) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  clearError: () => void;
  triggerAuthError: (msg: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('initializing');
  const [user, setUser] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isLiveBackend = isSupabaseConfigured;

  // Restore session from hardware SecureStore on cold start
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      if (isLiveBackend) {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !session) {
            if (isMounted) setStatus('unauthenticated');
            return;
          }

          // Fetch verified member profile from PostgreSQL
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError || !profile || !profile.is_active) {
            await supabase.auth.signOut();
            if (isMounted) {
              setStatus('unauthenticated');
              setError('Account deactivated or not found in the 8 authorized Team 5 accounts.');
            }
            return;
          }

          if (isMounted) {
            setUser(profile as Profile);
            setStatus('authenticated');
          }
        } catch {
          if (isMounted) setStatus('unauthenticated');
        }
      } else {
        // Simulated local cold-start check
        const timer = setTimeout(() => {
          if (isMounted) setStatus('unauthenticated');
        }, 800);
        return () => clearTimeout(timer);
      }
    }

    initSession();

    // Listen to real-time auth state changes if Supabase configured
    if (isLiveBackend) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setStatus('unauthenticated');
        } else if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser(profile as Profile);
            setStatus('authenticated');
          }
        }
      });

      return () => {
        isMounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [isLiveBackend]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setStatus('initializing');
    setError(null);

    if (isLiveBackend) {
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: pass,
        });

        if (authError || !data.session) {
          setStatus('error');
          setError(
            authError?.message ||
              'Authentication failed. Only pre-provisioned Team 5 accounts are permitted.'
          );
          return false;
        }

        // Fetch verified role & profile from database
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (profileError || !profile) {
          await supabase.auth.signOut();
          setStatus('error');
          setError('User profile not authorized in Team 5 roster.');
          return false;
        }

        setUser(profile as Profile);
        setStatus('authenticated');
        return true;
      } catch (err: any) {
        setStatus('error');
        setError(err?.message || 'Network error connecting to Supabase Auth.');
        return false;
      }
    } else {
      // Demonstration simulated verification against the 8 pre-authorized accounts
      await new Promise((resolve) => setTimeout(resolve, 600));

      const matchedProfile = DEMO_PROFILES.find(
        (p) => p.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (matchedProfile) {
        if (pass.length < 4) {
          setStatus('error');
          setError('Invalid credentials provided. Password must be at least 4 characters.');
          return false;
        }
        setUser(matchedProfile);
        setStatus('authenticated');
        return true;
      } else {
        setStatus('error');
        setError(
          'Account not found in the 8 authorized Team No. 5 member accounts. Public registration is disabled.'
        );
        return false;
      }
    }
  };

  const loginAsRole = async (role: AppRole): Promise<void> => {
    setStatus('initializing');
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const target = DEMO_PROFILES.find((p) => p.role === role) || DEMO_PROFILES[0];
    setUser(target);
    setStatus('authenticated');
  };

  const logout = async (): Promise<void> => {
    if (isLiveBackend) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Safe sign out
      }
    }
    setUser(null);
    setStatus('unauthenticated');
  };

  const sendPasswordReset = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    if (isLiveBackend) {
      try {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email.trim().toLowerCase(),
          { redirectTo: 'zenith://reset-password' }
        );
        if (resetError) {
          return { success: false, message: resetError.message };
        }
        return {
          success: true,
          message: 'Password reset instructions dispatched to your authorized institutional email.',
        };
      } catch (err: any) {
        return { success: false, message: err?.message || 'Error requesting reset.' };
      }
    } else {
      return {
        success: true,
        message:
          'Simulated Recovery: Password reset dispatch simulated for authorized institutional email.',
      };
    }
  };

  const clearError = () => {
    setError(null);
    if (status === 'error') {
      setStatus(user ? 'authenticated' : 'unauthenticated');
    }
  };

  const triggerAuthError = (msg: string) => {
    setError(msg);
    setStatus('error');
  };

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        error,
        isLiveBackend,
        login,
        loginAsRole,
        logout,
        sendPasswordReset,
        clearError,
        triggerAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
