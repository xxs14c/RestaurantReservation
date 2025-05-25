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
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 좌측: 로고 */}
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          🍽️ Restaurant
        </Link>

        {/* 우측: 메뉴 */}
        <nav className="space-x-4 text-sm md:text-base">
          {isLoggedIn ? (
            <>
              <span className="text-gray-700 font-medium">
                {user?.name || "고객"}님 환영합니다
              </span>
              <Link to="/home" className="text-blue-600 hover:underline">홈</Link>
              <Link to="/my-reservations" className="text-blue-600 hover:underline">나의 예약</Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="text-blue-600 hover:underline">로그인</Link>
              <Link to="/signup" className="text-blue-600 hover:underline">회원가입</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
