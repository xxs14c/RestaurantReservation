import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    // 실제 회원가입 처리 로직은 생략
    alert("회원가입이 완료되었습니다!");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">회원가입</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">이름</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="이름 입력"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">이메일</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="이메일 입력"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">비밀번호</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="비밀번호 입력"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors font-semibold"
          >
            회원가입
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link to="/" className="text-green-500 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
