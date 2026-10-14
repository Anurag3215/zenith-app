import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile, AppRole, DEMO_PROFILES } from '@zenith/shared';

export type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated' | 'error';

interface AuthContextType {
  status: AuthStatus;
  user: Profile | null;
  error: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  loginAsRole: (role: AppRole) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  triggerAuthError: (msg: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('initializing');
  const [user, setUser] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate secure session recovery check on cold start
    const timer = setTimeout(() => {
      // By default in Phase 2 shell, start in unauthenticated state to enforce login-first requirement
      setStatus('unauthenticated');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setStatus('initializing');
    setError(null);

    // Simulate network authentication against the 8 provisioned accounts
    await new Promise((resolve) => setTimeout(resolve, 800));

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
  };

  const loginAsRole = async (role: AppRole): Promise<void> => {
    setStatus('initializing');
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const target = DEMO_PROFILES.find((p) => p.role === role) || DEMO_PROFILES[0];
    setUser(target);
    setStatus('authenticated');
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    setStatus('unauthenticated');
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
        login,
        loginAsRole,
        logout,
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
