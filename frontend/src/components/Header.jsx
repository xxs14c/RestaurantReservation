import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const goToMyReservations = () => {
    navigate("/my_reservations");
  };

  return (
    <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/">레스토랑 예약 시스템</Link>
      </h1>
      {isLoggedIn && user ? (
        <div className="flex items-center space-x-4">
          <span>{user.username}님 환영합니다!</span>
          <button
            onClick={goToMyReservations}
            className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            나의 예약 보기
          </button>
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition-colors"
          >
            회원가입
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
