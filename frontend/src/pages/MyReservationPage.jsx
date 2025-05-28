import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ✅ 예약 데이터 불러오기
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/reservation/my_reservations", {
          method: "GET",
          credentials: "include", // 🔐 세션 로그인 상태 유지
        });

        const data = await res.json();
        setReservations(data);
      } catch (error) {
        console.error("예약 목록 불러오기 실패:", error);
        alert("예약 데이터를 불러오지 못했습니다.");
      }
    };

    fetchReservations();
  }, []);

  const formattedSelectedDate = selectedDate.toISOString().split("T")[0];
  const filteredReservations = reservations.filter((r) => r.date === formattedSelectedDate);

  const canCancel = (reservationDate) => {
    const resDate = new Date(reservationDate);
    const now = new Date();
    return (resDate - now) / (1000 * 60 * 60 * 24) >= 1;
  };

  const handleCancel = async (id) => {
    if (!window.confirm("정말 예약을 취소하시겠습니까?")) return;

    try {
      const res = await fetch("http://127.0.0.1:5000/reservation/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ reservation_id: id }),
      });

      const data = await res.json();

      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
        alert(data.message || "예약이 취소되었습니다.");
      } else {
        alert(data.error || "취소 실패");
      }
    } catch (error) {
      console.error("예약 취소 실패:", error);
      alert("서버 오류로 예약 취소에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">📅 나의 예약 목록</h2>

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
              <p>🪑 테이블: {res.table} | 인원: {res.guest_count}명</p>
              <p>📅 날짜: {res.date} | {res.time_slot === "lunch" ? "점심" : "저녁"}</p>
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
