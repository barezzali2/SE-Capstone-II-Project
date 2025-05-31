import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AuthContext = createContext();
const API_URL = import.meta.env.PROD
  ? "https://retailxplorebackend.onrender.com/auth"
  : "http://localhost:3003/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenVerified, setTokenVerified] = useState(false);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
          const response = await axios.get(`${API_URL}/verify`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.data.success || response.data.valid) {
            const userData = response.data.user || user;
            setUser(userData);
            setTokenVerified(true);
          }
        } catch (requestError) {
          clearTimeout(timeoutId);
          if (requestError.name === "AbortError") {
            setTokenVerified(true);
            return;
          }
          throw requestError;
        }
      } catch (error) {
        // log verification error but keep user logged in
        console.error("Token verification error:", error);
        if (localStorage.getItem("token")) {
          setTokenVerified(true);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  useEffect(() => {
    if (!user) return;

    const refreshTokenInterval = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.post(
          `${API_URL}/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
      } catch (error) {
        console.error("Token refresh error:", error);
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(refreshTokenInterval);
  }, [user]);

  const updateUser = (newUser) => {
    setUser(newUser);
    fetchUser();
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data && response.data.token) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        setUser(user);
        setTokenVerified(true);
        await fetchUser();
        return { success: true };
      }

      return {
        success: false,
        error: response.data?.message || "Invalid credentials",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setTokenVerified(false);
    localStorage.removeItem("token");
  };

  const isAdmin = user?.role === "admin";

  const isAuthenticated = () => {
    const hasToken = !!localStorage.getItem("token");
    return hasToken || (!!user && tokenVerified);
  };

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await fetchUser();
      }
    };

    initializeUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        tokenVerified,
        isAuthenticated,
        fetchUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
