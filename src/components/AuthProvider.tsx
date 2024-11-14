import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  profile: any;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  profile: null,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          const userProfile = await getUserProfile();
          if (userProfile) {
            setProfile(userProfile);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};