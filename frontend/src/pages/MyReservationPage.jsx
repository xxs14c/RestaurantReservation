import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MyReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedSelectedDate = formatDate(selectedDate);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:5000/reservation/my_reservations",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const contentType = res.headers.get("Content-Type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setReservations(data);
        } else if (res.status === 401) {
          alert("로그인이 필요합니다. 다시 로그인해 주세요.");
        } else {
          const text = await res.text();
          alert("❌ 예약 목록 불러오기 실패\n" + text);
        }
      } catch (error) {
        alert("서버 오류로 예약 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const filteredReservations = reservations.filter(
    (r) => r.date === formattedSelectedDate
  );

  const canCancel = (reservationDate) => {
    const resDate = new Date(reservationDate);
    const now = new Date();
    return (resDate - now) / (1000 * 60 * 60 * 24) >= 1;
  };

  const handleCancel = async (id) => {
    if (!window.confirm("정말 예약을 취소하시겠습니까?")) return;
    try {
      const res = await fetch("http://localhost:5000/reservation/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reservation_id: id }),
      });
      const contentType = res.headers.get("Content-Type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error("JSON 응답이 아닙니다: " + text);
      }
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
        alert(data.message || "예약이 취소되었습니다.");
      } else {
        alert(data.error || "예약 취소 실패");
      }
    } catch (error) {
      alert("서버 오류로 예약 취소에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">📅 나의 예약 목록</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          조회할 날짜 선택
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="border p-2 rounded"
        />
      </div>

      {loading ? (
        <p className="text-gray-600">불러오는 중...</p>
      ) : reservations.length === 0 ? (
        <p className="text-gray-600">예약 내역이 없습니다.</p>
      ) : filteredReservations.length === 0 ? (
        <p className="text-gray-600">해당 날짜에 예약 내역이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((res) => (
            <div
              key={res.id}
              className="p-4 border rounded bg-white shadow-sm"
            >
              <p>
                🪑 테이블: {res.table} | 인원: {res.guest_count}명
              </p>
              <p>
                📅 날짜: {res.date} |{" "}
                {res.time_slot === "lunch" ? "점심" : "저녁"}
              </p>
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

export default MyReservationPage;
