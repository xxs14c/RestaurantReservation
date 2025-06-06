import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userInfo) => {
    setIsLoggedIn(true);
    setUser(userInfo);
  };

  const logout = async () => {
    try {
      await fetch("http://127.0.0.1:5000/auth/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      console.error("로그아웃 중 오류:", err);
    }
    setIsLoggedIn(false);
    setUser(null);
  };

  const checkLoginStatus = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/auth/me", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        login(data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (err) {
      console.error("로그인 상태 확인 실패:", err);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

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
