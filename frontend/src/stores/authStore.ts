import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User, UserProfile } from '../types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      setUser: (user) => 
        set((state) => ({
          ...state,
          user,
          isAuthenticated: !!user,
        }), false, 'setUser'),
        
      setProfile: (profile) => 
        set((state) => ({
          ...state,
          profile,
        }), false, 'setProfile'),
        
      setLoading: (isLoading) => 
        set((state) => ({
          ...state,
          isLoading,
        }), false, 'setLoading'),
        
      setError: (error) => 
        set((state) => ({
          ...state,
          error,
        }), false, 'setError'),
        
      logout: () => 
        set(() => ({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }), false, 'logout'),
    }),
    { name: 'auth-store' }
  )
);