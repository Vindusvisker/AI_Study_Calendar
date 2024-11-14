import axios from 'axios';

const CLIENT_ID = '1076008832015-g1r08gcabf7ud6maed8ljd2eile3hu3r.apps.googleusercontent.com';
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/userinfo.profile'
].join(' ');

export const getAuthUrl = () => {
  const redirectUri = window.location.origin;
  const state = Math.random().toString(36).substring(7);
  localStorage.setItem('oauth_state', state);
  
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${SCOPES}&prompt=consent&access_type=offline&state=${state}`;
};

export const handleAuthCallback = () => {
  const hash = window.location.hash;
  if (!hash) return false;

  try {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const state = params.get('state');
    const error = params.get('error');
    const storedState = localStorage.getItem('oauth_state');

    if (error) {
      console.error('OAuth error:', error);
      return false;
    }

    if (!accessToken || !state || state !== storedState) {
      return false;
    }

    localStorage.removeItem('oauth_state');
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('auth_time', Date.now().toString());
    
    // Clear the hash to clean up the URL
    window.history.replaceState(null, '', window.location.pathname);
    return true;
  } catch (error) {
    console.error('Error handling auth callback:', error);
    return false;
  }
};

export const getUserProfile = async () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token available');
  }

  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    // Store user info in localStorage
    localStorage.setItem('user_profile', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_profile');
      throw new Error('Authentication expired. Please sign in again.');
    }
    throw error;
  }
};

export const checkAuth = async () => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const authTime = localStorage.getItem('auth_time');
    
    if (!accessToken || !authTime) {
      return false;
    }

    // Check if token is older than 1 hour (3600000 milliseconds)
    if (Date.now() - parseInt(authTime) > 3600000) {
      logout();
      return false;
    }

    await getUserProfile();
    return true;
  } catch (error) {
    logout();
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_profile');
  localStorage.removeItem('auth_time');
  window.location.href = '/select-mode';
};