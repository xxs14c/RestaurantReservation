import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReservationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { table, date, time } = location.state || {};

  if (!table) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        잘못된 접근입니다. 홈에서 예약을 시도해주세요.
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("🎉 예약이 완료되었습니다!");
    navigate("/home");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">예약 정보 입력</h2>

      {/* 예약 대상 정보 */}
      <div className="text-sm text-gray-700 mb-6 space-y-1">
        <p>🪑 테이블 번호: <span className="font-semibold">{table.id}</span></p>
        <p>📍 위치: <span className="font-semibold">{table.location}</span></p>
        <p>👥 수용 인원: <span className="font-semibold">{table.capacity}명</span></p>
        <p>📅 날짜: <span className="font-semibold">{date}</span></p>
        <p>⏰ 시간대: <span className="font-semibold">{time === "lunch" ? "점심" : "저녁"}</span></p>
      </div>

      {/* 예약 입력 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">예약자 이름</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="이름 입력"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">전화번호</label>
          <input
            type="tel"
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="010-1234-5678"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">신용카드 번호</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="0000-0000-0000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">예약 인원 수</label>
          <input
            type="number"
            min="1"
            max={table.capacity}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={`최대 ${table.capacity}명`}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
        >
          예약 완료
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
