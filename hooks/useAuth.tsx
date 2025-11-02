// // app/hooks/useAuth.tsx
// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { subscribeUnauthorized } from '../app/authSession';

// type User = { id: string; name?: string; email?: string } | null;
// type AuthContextType = {
//   user: User;
//   loading: boolean;
//   signIn: (user: User, token: string) => Promise<void>;
//   signOut: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // load token and user from storage on app start
//     (async () => {
//       try {
//         const t = await AsyncStorage.getItem('APP_TOKEN');
//         const u = await AsyncStorage.getItem('APP_USER');
//         if (t && u) {
//           setUser(JSON.parse(u));
//         }
//       } catch (e) {
//         console.warn('Error restoring auth', e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     const unsubscribe = subscribeUnauthorized(() => {
//       setUser(null);
//     });
//     return unsubscribe;
//   }, []);

//   async function signIn(userData: User, token: string) {
//     await AsyncStorage.setItem('APP_TOKEN', token);
//     await AsyncStorage.setItem('APP_USER', JSON.stringify(userData));
//     setUser(userData);
//   }

//   async function signOut() {
//     await AsyncStorage.removeItem('APP_TOKEN');
//     await AsyncStorage.removeItem('APP_USER');
//     setUser(null);
//   }

//   return (
//     <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
//   return ctx;
// }
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

  // 🔹 Load token & user from AsyncStorage when app starts
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [token, storedUser] = await Promise.all([
          AsyncStorage.getItem('APP_TOKEN'),
          AsyncStorage.getItem('APP_USER'),
        ]);
        if (mounted && token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn('⚠️ Error restoring auth state', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 🔹 Automatically clear session when backend sends 401
  useEffect(() => {
    const unsubscribe = subscribeUnauthorized(async () => {
      await signOut();
    });
    return unsubscribe;
  }, []);

  // 🔹 Sign in: store JWT + user in AsyncStorage
  async function signIn(userData: User, token: string) {
    try {
      await AsyncStorage.setItem('APP_TOKEN', token);
      await AsyncStorage.setItem('APP_USER', JSON.stringify(userData));
      setUser(userData);
    } catch (e) {
      console.error('❌ Failed to save auth data', e);
      throw e;
    }
  }

  // 🔹 Sign out: remove everything
  async function signOut() {
    try {
      await AsyncStorage.multiRemove(['APP_TOKEN', 'APP_USER']);
    } catch (e) {
      console.warn('⚠️ Error clearing storage', e);
    } finally {
      setUser(null);
    }
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
