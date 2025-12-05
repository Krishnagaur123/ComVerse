import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  age?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, age: number, avatar: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('comverse_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Replace with actual API call
    // For now, simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock user data - replace with actual API response
    const mockUser: User = {
      id: '1',
      username: email.split('@')[0],
      email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
    };
    
    setUser(mockUser);
    localStorage.setItem('comverse_user', JSON.stringify(mockUser));
  };

  const signup = async (username: string, email: string, password: string, age: number, avatar: string) => {
    // TODO: Replace with actual API call
    // For now, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Date.now().toString(),
      username,
      email,
      avatar,
      age,
    };
    
    setUser(mockUser);
    localStorage.setItem('comverse_user', JSON.stringify(mockUser));
  };

  const loginWithGoogle = async () => {
    // TODO: Replace with actual Google OAuth implementation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser: User = {
      id: 'google_' + Date.now(),
      username: 'Google User',
      email: 'user@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
    };
    
    setUser(mockUser);
    localStorage.setItem('comverse_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('comverse_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      loginWithGoogle,
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

