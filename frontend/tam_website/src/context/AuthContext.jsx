import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const AuthContext = createContext(
  {
    login: () => {},
    logout: () => {},
    register: () => {},
    refreshToken: () => {},
    isAuthenticated: () => {},
    isAdmin: () => {},
    user: () => {},
  }
);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const storedTokens = localStorage.getItem('tokens');
    if (storedTokens) {
      try {
        const accessToken = (JSON.parse(storedTokens).access).split('.')[1];
        const decodedToken = accessToken ? atob(accessToken) : null;

        setIsAuthenticated(JSON.parse(decodedToken)?.user_id);
      } catch (error) {
        console.error('Error parsing tokens:', error);
        localStorage.removeItem('tokens');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  
  useEffect(() => {
    let isMounted = true;

    const checkAdminAccess = async () => {
      try {
        const storedTokens = localStorage.getItem('tokens');
        if (!storedTokens || !isAuthenticated) {
          if (isMounted) setIsAdmin(false);
          return;
        }

        const accessToken = JSON.parse(storedTokens).access;
        const response = await fetch('http://localhost:8000/api/auth/admin-access/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            ...authHeader(),
          }
        });

        if (!isMounted) return;

        if (response.status === 403) {
          setIsAdmin(false);
        } else if (response.ok) {
          setIsAdmin(true);
        } else {
          console.error('Failed to check admin access');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        if (isMounted) setIsAdmin(false);
      }
    };

    checkAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);


  const login = async (phone_number, password) => {
    try {

      const response = await fetch('http://localhost:8000/api/auth/get-access-token/', {
        method: 'POST',
        headers: {
          ...authHeader()
        },
        body: JSON.stringify({phone_number, password})
      });
      const data = await response.json();

      

      if (!response.ok) {
        return { success: false, error: data.error }
      }
      
      // Save tokens to localStorage
      localStorage.setItem('tokens', JSON.stringify({access: data.access, refresh: data.refresh}));
      
      setIsAuthenticated(true);
      navigate('/');
      
      return { success: true };
    } catch (error) {
      console.log(error.message);
      
      return { success: false, error: 'An error occurred. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          ...authHeader(),
        },
        body: JSON.stringify(userData)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { success: false, error: data }
      }
            
      navigate('/');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('tokens');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };

  const refreshToken = async () => {
    try {
      const storedTokens = localStorage.getItem('tokens');
      if (!storedTokens) {
        throw new Error('No tokens found');
      }

      const accessToken = JSON.parse(storedTokens).access;
      const res = await fetch('http://localhost:8000/api/auth/get-refresh-token/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          ...authHeader(),
        },
      });
      
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  const authHeader = () => {
    return {
      'Accept-Language': localStorage.getItem("language", 'fa'),
      'Content-Type': "application/json"
    }
  }

  return (
    <AuthContext.Provider value={{
      login,
      logout,
      register,
      refreshToken,
      isAuthenticated,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 