import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeFetch } from '@/lib/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  roleGlobal: 'SUPER_ADMIN' | 'USER';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    safeFetch('/api/auth/me')
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch((err) => {
        console.error('Auth check failed:', err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData: User) => setUser(userData);
  const logout = () => {
    safeFetch('/api/auth/logout', { method: 'POST' }).finally(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
