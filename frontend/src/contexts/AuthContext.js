import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ 로그인
  const login = (userInfo) => {
    setIsLoggedIn(true);
    setUser(userInfo);
  };

  // ✅ 로그아웃
  const logout = async () => {
    await fetch("http://127.0.0.1:5000/auth/logout", {
      credentials: "include",
    });
    setIsLoggedIn(false);
    setUser(null);
  };

  // ✅ 로그인 상태 확인
  const checkLoginStatus = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/auth/me", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        login(data.user); // 로그인 상태로 전환
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (err) {
      console.error("로그인 상태 확인 실패:", err);
    }
  };

  // ✅ 앱이 처음 실행될 때 자동 로그인 확인
  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
