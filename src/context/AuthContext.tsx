import { authService } from "@/lib/api/services/authService";
import { getCookie } from "@/utils/cookies";
import { createContext, useState, useEffect, useContext } from "react";
import { User } from "@/types/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const token = getCookie('access_token');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      try {
        // We only need to validate the token here since axios will handle refresh if needed
        const isValid = await authService.validateToken(token);
        if (!isValid) {
          throw new Error('Invalid token');
        }

        // If token is valid, set the auth state
        const response = await authService.getUserInfo();
        const userData = response.data as User;
        if (!userData?.id) {
          throw new Error('Invalid user data');
        }
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        // If there's any error, clear the auth state
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;