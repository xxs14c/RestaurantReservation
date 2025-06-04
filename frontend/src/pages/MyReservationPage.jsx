import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ── 1. 예약 목록 가져오기 ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch("http://localhost:5000/reservation/my_reservations", {
          method: "GET",
          credentials: "include", // 세션 쿠키 포함
        });

        // Content-Type이 JSON인지 확인 후 파싱
        const contentType = res.headers.get("Content-Type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setReservations(data);
        } else {
          const text = await res.text();
          console.error("예약 목록 불러오기 실패:", text);
          alert("❌ 예약 목록 불러오기 실패\n" + text);
        }
      } catch (error) {
        console.error("예약 목록 요청 중 오류 발생:", error);
        alert("서버 오류로 예약 데이터를 불러오지 못했습니다.");
      }
    };

    fetchReservations();
  }, []);

  // ── 2. 날짜 문자열 포맷 함수 ─────────────────────────────────────────────────
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // "YYYY-MM-DD"
  };

  // ── 3. 선택된 날짜 문자열 / 필터링 ─────────────────────────────────────────
  const formattedSelectedDate = formatDate(selectedDate);
  // 백엔드에서 받은 r.date가 "YYYY-MM-DD" 형식이므로 동일 포맷으로 비교
  const filteredReservations = reservations.filter((r) => r.date === formattedSelectedDate);

  // ── 4. 예약 취소 가능여부 계산 ───────────────────────────────────────────────
  const canCancel = (reservationDate) => {
    const resDate = new Date(reservationDate);
    const now = new Date();
    // (resDate - now) 일 수로 바꾼 뒤 1일 이상 남았으면 취소 가능
    return (resDate - now) / (1000 * 60 * 60 * 24) >= 1;
  };

  // ── 5. 예약 취소 핸들러 ────────────────────────────────────────────────────
  const handleCancel = async (id) => {
    if (!window.confirm("정말 예약을 취소하시겠습니까?")) return;

    try {
      const res = await fetch("http://localhost:5000/reservation/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 세션 쿠키 포함
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
        // 성공적으로 삭제되면, 화면에서도 해당 예약 제거
        setReservations((prev) => prev.filter((r) => r.id !== id));
        alert(data.message || "✅ 예약이 취소되었습니다.");
      } else {
        alert(data.error || "❌ 예약 취소 실패");
      }
    } catch (error) {
      console.error("예약 취소 실패:", error);
      alert("서버 오류로 예약 취소에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">📅 나의 예약 목록</h2>

      {/* ── 날짜 선택 섹션 ───────────────────────────────────────────── */}
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

      {/* ── 예약 리스트 / 메시지 출력 ───────────────────────────────────────── */}
      {reservations.length > 0 && filteredReservations.length === 0 ? (
        <p className="text-gray-600">해당 날짜에 예약 내역이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((res) => (
            <div
              key={res.id}
              className="p-4 border rounded bg-white shadow-sm"
            >
              {/* 테이블 위치, 인원 수, 예약 날짜 및 시간대를 화면에 표시 */}
              <p>🪑 테이블 위치: {res.table}</p>
              <p>👥 인원 수: {res.guest_count}명</p>
              <p>
                📅 날짜: {res.date} | {res.time_slot === "lunch" ? "점심" : "저녁"}
              </p>

              {/* 취소 버튼: 1일 전까지만 활성화 */}
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
