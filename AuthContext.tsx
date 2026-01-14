import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/utils/api";
import {
  getUserData,
  saveUserData,
  clearUserData,
  saveToken,
  getToken,
} from "@/utils/storage";

/* ================= TYPES ================= */

export type UserType = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  addresses?: any[];
  isAdmin?: boolean;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserType | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  signup: (fullName: string, email: string, password: string, phone?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
};

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ✅ MUST MATCH server.js EXACTLY */
const API_BASE_PATH = "/users";

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------- Load saved session ---------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await getUserData();
        if (data?.token && data?.fullUser) {
          setToken(data.token);
          setUser(data.fullUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Session restore failed", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  /* ---------- SIGNUP ---------- */
  const signup = async (fullName: string, email: string, password: string, phone?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.post(`${API_BASE_PATH}/signup`, {
        fullName,
        email,
        password,
        phone,
      });

      if (!data.success) throw new Error(data.message || "Signup failed");

      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);

      await saveToken(data.token);
      await saveUserData(
        data.user._id,
        data.user.fullName,
        data.user.email,
        data.token,
        data.user
      );
    } catch (err: any) {
      setError(err.message || "Signup failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- LOGIN ---------- */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.post(`${API_BASE_PATH}/login`, { email, password });

      if (!data.success) throw new Error(data.message || "Login failed");

      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);

      await saveToken(data.token);
      await saveUserData(
        data.user._id,
        data.user.fullName,
        data.user.email,
        data.token,
        data.user
      );
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- PROFILE ---------- */
  const loadUserProfile = async () => {
    const currentToken = token || (await getToken());
    if (!currentToken) return;

    try {
      const data = await api.get(`${API_BASE_PATH}/profile`);
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Profile load failed:", error);
    }
  };

  /* ---------- LOGOUT ---------- */
  const logout = async () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    await clearUserData();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        isLoading,
        error,
        signup,
        login,
        logout,
        loadUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
