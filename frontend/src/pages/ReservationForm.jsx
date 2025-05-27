import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReservationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { table } = location.state || {};

  if (!table) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        잘못된 접근입니다. 홈 페이지에서 예약을 시도해주세요.
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("🎉 예약이 완료되었습니다!");
    navigate("/home");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">예약 정보 입력</h2>
      <p className="mb-2">🪑 테이블 번호: {table.id}</p>
      <p className="mb-4">위치: {table.location} | 수용 인원: {table.capacity}명</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="이름"
          required
        />
        <input
          type="tel"
          className="w-full border p-2 rounded"
          placeholder="전화번호"
          required
        />
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="신용카드 번호"
          required
        />
        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="인원 수"
          min="1"
          max={table.capacity}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          예약 완료
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;