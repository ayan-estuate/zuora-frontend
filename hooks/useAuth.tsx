// app/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subscribeUnauthorized } from '../app/authSession';

type User = { id: string; name?: string; email?: string } | null;
type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (user: User, token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load token and user from storage on app start
    (async () => {
      try {
        const t = await AsyncStorage.getItem('APP_TOKEN');
        const u = await AsyncStorage.getItem('APP_USER');
        if (t && u) {
          setUser(JSON.parse(u));
        }
      } catch (e) {
        console.warn('Error restoring auth', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeUnauthorized(() => {
      setUser(null);
    });
    return unsubscribe;
  }, []);

  async function signIn(userData: User, token: string) {
    await AsyncStorage.setItem('APP_TOKEN', token);
    await AsyncStorage.setItem('APP_USER', JSON.stringify(userData));
    setUser(userData);
  }

  async function signOut() {
    await AsyncStorage.removeItem('APP_TOKEN');
    await AsyncStorage.removeItem('APP_USER');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
