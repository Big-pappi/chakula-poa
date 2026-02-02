"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { auth, tokenManager } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: {
    phone_number: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    first_name: string;
    last_name?: string;
    phone_number: string;
    email?: string;
    registration_number?: string;
    university?: string;
    password: string;
  }) => Promise<{ success: boolean; cps_number?: string; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const response = await auth.me();
      if (response.data) {
        setUser(response.data);
        return true;
      } else {
        tokenManager.clearTokens();
        setUser(null);
        return false;
      }
    } catch {
      tokenManager.clearTokens();
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = tokenManager.getAccessToken();
      if (token) {
        await fetchUser();
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [fetchUser]);

  const login = async (data: { phone_number: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await auth.login(data);
      console.log("[v0] Login response:", response);

      if (response.data) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, error: response.error || "Login failed" };
    } catch (error) {
      console.error("[v0] Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    first_name: string;
    last_name?: string;
    phone_number: string;
    email?: string;
    registration_number?: string;
    university?: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await auth.register(data);
      console.log("[v0] Register response:", response);

      if (response.data) {
        setUser(response.data.user);
        return { success: true, cps_number: response.data.cps_number };
      }
      return { success: false, error: response.error || "Registration failed" };
    } catch (error) {
      console.error("[v0] Register error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    tokenManager.clearTokens();
    setUser(null);
    auth.logout();
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
