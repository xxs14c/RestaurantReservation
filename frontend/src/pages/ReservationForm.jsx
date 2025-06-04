// src/pages/ReservationForm.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReservationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // HomePage에서 navigate할 때 보낸 state를 구조분해 할당
  const { table, date, time } = location.state || {};

  // 만약 table 정보가 없으면 잘못된 접근 문구를 보여줌
  if (!table || !date || !time) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        잘못된 접근입니다. 홈 페이지에서 예약을 시도해주세요.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 폼 필드에서 입력된 값만 가져오면, date/time은 이미 URL state로 확보됨
    const formData = new FormData(e.target);
    const reservation = {
      // 이름, 전화번호, 카드번호, 인원 수
      name: formData.get("name"),
      phone: formData.get("phone"),
      credit_card: formData.get("credit_card"),
      guest_count: Number(formData.get("guest_count")),

      // HomePage에서 넘겨준 table, date, time 사용
      table_id: table.id,
      date: date,       // "YYYY-MM-DD"
      time_slot: time,  // "lunch" or "dinner"
    };

    try {
      const res = await fetch("http://localhost:5000/reservation/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 세션 인증 쿠키 포함
        body: JSON.stringify(reservation),
      });

      const contentType = res.headers.get("Content-Type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error("응답이 JSON이 아닙니다: " + text);
      }

      if (res.ok) {
        alert("🎉 예약 완료: " + data.message);
        navigate("/home");
      } else {
        alert("❌ " + (data.error || "예약 실패"));
      }
    } catch (err) {
      console.error("예약 실패:", err);
      alert("❌ 서버 오류: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">예약 정보 입력</h2>

      {/* HomePage에서 전달된 date/time과 table 정보를 화면에 보여줌 */}
      <p className="mb-2"><strong>예약 날짜:</strong> {date}</p>
      <p className="mb-2">
        <strong>시간대:</strong> {time === "lunch" ? "점심" : "저녁"}
      </p>
      <p className="mb-4">
        <strong>테이블 번호:</strong> {table.id} (위치: {table.location}, 용량: {table.capacity}명)
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          className="w-full border p-2 rounded"
          placeholder="이름"
          required
        />

        <input
          name="phone"
          type="tel"
          className="w-full border p-2 rounded"
          placeholder="전화번호"
          required
        />

        <input
          name="credit_card"
          type="text"
          className="w-full border p-2 rounded"
          placeholder="신용카드 번호"
          required
        />

        <input
          name="guest_count"
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
          최종 예약하기
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
