"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (newUser: User) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      Promise.resolve().then(() => {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      });
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Redirección si no está autenticado (excepto en login/register/public)
    if (!isLoading) {
      const publicPaths = [
        "/", "/login", "/register", "/precios", "/quienes-somos", 
        "/terminos", "/privacidad", "/centro-ayuda",
        "/barberia", "/fisioterapia", "/peluqueria", "/salon-de-spa", 
        "/estudio-de-pilates", "/estudio-de-yoga", "/taller-de-reparacion-movil"
      ];
      const isPublicPath = publicPaths.includes(pathname);
      const isAuthPath = pathname === "/login" || pathname === "/register";

      if (!token && !isPublicPath) {
        router.push("/login");
      } else if (token && isAuthPath) {
        if (user?.role === 'guest') {
          router.push("/explore");
        } else {
          router.push("/dashboard");
        }
      } else if (token && !isPublicPath && user) {
        // Bloqueo de rutas en base a roles
        if (user.role === 'guest' && pathname.startsWith('/dashboard')) {
          router.push("/explore");
        }
        if (user.role === 'host' && pathname.startsWith('/explore')) {
          router.push("/dashboard");
        }
      }
    }
  }, [token, pathname, isLoading, router]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("access_token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    if (newUser.role === 'guest') {
      router.push("/explore");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
