import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const mockReservations = [
  {
    id: 1,
    date: "2025-06-10",
    time: "lunch",
    tableId: 3,
    location: "룸",
    capacity: 4,
  },
  {
    id: 2,
    date: "2025-05-22",
    time: "dinner",
    tableId: 1,
    location: "창가",
    capacity: 2,
  },
  {
    id: 3,
    date: "2025-05-23",
    time: "lunch",
    tableId: 2,
    location: "내부",
    capacity: 6,
  },
];

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState(mockReservations);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedSelectedDate = selectedDate.toISOString().split("T")[0];
  const filteredReservations = reservations.filter((r) => r.date === formattedSelectedDate);

  const canCancel = (reservationDate) => {
    const resDate = new Date(reservationDate);
    const now = new Date();
    const diff = (resDate - now) / (1000 * 60 * 60 * 24);
    return diff >= 1;
  };

  const handleCancel = (id) => {
    if (window.confirm("정말 예약을 취소하시겠습니까?")) {
      setReservations((prev) => prev.filter((r) => r.id !== id));
      alert("예약이 취소되었습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">📋 나의 예약 목록</h2>

      {/* 날짜 선택 */}
      <div className="mb-6 flex justify-center">
        <label className="mr-4 text-sm font-medium text-gray-700">조회할 날짜 선택:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="border p-2 rounded"
        />
      </div>

      {filteredReservations.length === 0 ? (
        <p className="text-center text-gray-500">해당 날짜에 예약 내역이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReservations.map((res) => (
            <div key={res.id} className="p-5 bg-white rounded-lg shadow border">
              <h3 className="text-lg font-bold text-gray-800 mb-2">🪑 테이블 {res.tableId}</h3>
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p>📍 위치: <span className="font-medium">{res.location}</span></p>
                <p>👥 수용 인원: <span className="font-medium">{res.capacity}명</span></p>
                <p>📅 날짜: <span className="font-medium">{res.date}</span></p>
                <p>⏰ 시간대: <span className="font-medium">{res.time === "lunch" ? "점심" : "저녁"}</span></p>
              </div>
              <button
                disabled={!canCancel(res.date)}
                onClick={() => handleCancel(res.id)}
                className={`w-full py-2 rounded font-semibold transition-colors
                  ${canCancel(res.date)
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                예약 취소
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservationsPage;
