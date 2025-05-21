import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const { login } = useAuth(); // ✅ 로그인 상태 변경 함수
  const navigate = useNavigate(); // ✅ 페이지 이동 함수

  const handleLogin = (e) => {
    e.preventDefault();

    // 실제 인증 로직을 넣을 수 있음. 지금은 목데이터로 처리
    const mockUser = {
      name: "홍길동", // 이후 백엔드 로그인 결과로 대체 가능
    };

    login(mockUser); // ✅ 로그인 상태 설정
    navigate("/home"); // ✅ 홈으로 이동
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">로그인</h2>

        {/* ✅ onSubmit 연결 */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">이메일</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">비밀번호</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            로그인
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          계정이 없으신가요? <Link to="/signup" className="text-blue-500 hover:underline">회원가입</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
