import React, { createContext, useState, useContext, useEffect } from "react";

interface User {
  id: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState<boolean>(true);

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "로그인에 실패했습니다.");
      }

      // 토큰과 사용자 정보 저장
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error("로그인 오류:", error);
      throw error;
    }
  };

  // 회원가입
  const signup = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "회원가입에 실패했습니다.");
      }

      // 토큰과 사용자 정보 저장
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error("회원가입 오류:", error);
      throw error;
    }
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // 인증 확인 (토큰으로 사용자 정보 가져오기)
  const checkAuth = async () => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/auth/me", {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("인증 실패");
      }

      const data = await response.json();
      setUser(data.user);
      setToken(savedToken);
    } catch (error) {
      console.error("인증 확인 오류:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 인증 확인
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
