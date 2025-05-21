import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-gray-800">🍽️ Restaurant</Link>

      <div className="space-x-4">
        {isLoggedIn ? (
          <>
            <span className="text-gray-600 font-medium">
              {user?.name || "고객"}님 환영합니다
            </span>
            <Link to="/home" className="text-blue-600 hover:underline">홈</Link>
            <Link to="/my-reservations" className="text-blue-600 hover:underline">나의 예약</Link>
            <button onClick={handleLogout} className="text-red-500 hover:underline">로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/" className="text-blue-600 hover:underline">로그인</Link>
            <Link to="/signup" className="text-blue-600 hover:underline">회원가입</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
