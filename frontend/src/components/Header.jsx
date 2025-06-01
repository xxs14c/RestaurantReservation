import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">나의 레스토랑</h1>
      {isLoggedIn ? (
        <div>
          <span className="mr-4">{user.username}님 환영합니다!</span>
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <span>로그인 필요</span>
      )}
    </header>
  );
};

export default Header;
