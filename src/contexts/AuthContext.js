import React, { createContext, useContext, useState } from "react";

// 컨텍스트 생성
const AuthContext = createContext();

// 컨텍스트 프로바이더
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // 필요 시 이름 등 저장

  const login = (userInfo) => {
    setIsLoggedIn(true);
    setUser(userInfo);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅으로 사용
export const useAuth = () => useContext(AuthContext);
