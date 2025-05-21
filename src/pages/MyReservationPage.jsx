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

  // 날짜 필터링
  const formattedSelectedDate = selectedDate.toISOString().split("T")[0];
  const filteredReservations = reservations.filter((r) => r.date === formattedSelectedDate);

  // 취소 가능 여부
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
      <h2 className="text-2xl font-bold mb-6">📅 나의 예약 목록</h2>

      {/* 날짜 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">조회할 날짜 선택</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="border p-2 rounded"
        />
      </div>

      {filteredReservations.length === 0 ? (
        <p className="text-gray-600">해당 날짜에 예약 내역이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((res) => (
            <div key={res.id} className="p-4 border rounded bg-white shadow-sm">
              <p>🪑 테이블: {res.tableId} ({res.location}, {res.capacity}명)</p>
              <p>📅 날짜: {res.date} | {res.time === "lunch" ? "점심" : "저녁"}</p>
              <button
                disabled={!canCancel(res.date)}
                onClick={() => handleCancel(res.id)}
                className={`mt-2 px-4 py-1 rounded ${
                  canCancel(res.date)
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
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
