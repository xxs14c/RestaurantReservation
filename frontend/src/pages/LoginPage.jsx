import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // ✅ 이메일 → username
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login({ name: username });
        navigate("/home");
      } else {
        alert("❌ " + (data.error || "로그인 실패"));
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("❌ 서버 오류 발생");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">로그인</h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="아이디를 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          계정이 없으신가요?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
