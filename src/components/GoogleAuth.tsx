import React, { useEffect, useState } from 'react';
import { getAuthUrl, handleAuthCallback, getUserProfile, logout } from '../services/authService';
import { AlertCircle } from 'lucide-react';

interface UserProfile {
  name: string;
  picture: string;
  email: string;
}

const GoogleAuth: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check for auth callback
        if (window.location.hash) {
          if (handleAuthCallback()) {
            const userProfile = await getUserProfile();
            setProfile(userProfile);
          }
        } else {
          // Check existing auth
          const accessToken = localStorage.getItem('access_token');
          if (accessToken) {
            const userProfile = await getUserProfile();
            setProfile(userProfile);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setError(null);
    window.location.href = getAuthUrl();
  };

  const handleLogout = () => {
    setError(null);
    logout();
    setProfile(null);
  };

  if (isLoading) {
    return (
      <button disabled className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg shadow-md flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
        Loading...
      </button>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-white text-gray-800 rounded-lg shadow-md hover:bg-gray-50 flex items-center gap-2"
        >
          <img
            src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
      </div>
    );
  }

  if (profile) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={profile.picture}
          alt={profile.name}
          className="w-8 h-8 rounded-full"
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{profile.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-white text-gray-800 rounded-lg shadow-md hover:bg-gray-50 flex items-center gap-2"
    >
      <img
        src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
        alt="Google"
        className="w-5 h-5"
      />
      Sign in with Google
    </button>
  );
};

export default GoogleAuth;