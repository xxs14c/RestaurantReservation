import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TableCard from "../components/TableCard";

const HomePage = () => {
  const navigate = useNavigate();

  // 1) 예약 날짜 (Date 객체)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 2) 시간대 ("lunch" 또는 "dinner")
  const [mealTime, setMealTime] = useState("lunch");

  // 3) 수용 인원 (2, 4, 6, 8 중 하나)
  const [selectedCapacity, setSelectedCapacity] = useState(2);

  // 4) 백엔드에서 받아온 “해당 날짜/시간대에 아직 예약되지 않은 테이블” 목록
  const [tables, setTables] = useState([]);

  // YYYY-MM-DD 문자열로 변환
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // 예약 버튼 클릭 시 /reserve 페이지로 이동하며 state로 table/date/time 전달
  const handleReserve = (table) => {
    navigate("/reserve", {
      state: {
        table,
        date: formatDate(selectedDate),
        time: mealTime,
      },
    });
  };

  // → selectedDate, mealTime이 바뀔 때마다 백엔드에서 갱신된 테이블 목록을 가져옴
  useEffect(() => {
    const fetchTables = async () => {
      const dateStr = formatDate(selectedDate);
      try {
        // 예약 가능한 테이블만 가져오는 API 호출
        const res = await fetch(
          `http://localhost:5000/reservation/tables?date=${dateStr}&time_slot=${mealTime}`,
          {
            method: "GET",
            credentials: "include", // 세션 쿠키 포함
          }
        );

        if (!res.ok) {
          // 실패 시 에러 메시지 화면 표시
          const text = await res.text();
          console.error("테이블 목록 불러오기 실패:", text);
          setTables([]); // 비워두기
          return;
        }

        const json = await res.json();
        // { available_tables: [ { id, location, capacity }, … ] } 형태로 온다고 가정
        if (json.available_tables) {
          // 수용 인원 필터링(예: capacity === 4 등)
          const filtered = json.available_tables.filter(
            (t) => t.capacity === selectedCapacity
          );
          // available 속성은 필요없으므로 그냥 배열 형태로 저장
          setTables(filtered);
        } else {
          setTables([]);
        }
      } catch (err) {
        console.error("테이블 요청 중 오류 발생:", err);
        setTables([]);
      }
    };

    fetchTables();
  }, [selectedDate, mealTime, selectedCapacity]);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">🪑 테이블 예약</h2>

      {/* 1) 날짜 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          예약 날짜
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          minDate={new Date()}
          maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
          dateFormat="yyyy-MM-dd"
          className="border p-2 rounded"
        />
      </div>

      {/* 2) 시간대 선택 (점심/저녁) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          시간대 선택
        </label>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded ${
              mealTime === "lunch"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setMealTime("lunch")}
          >
            점심
          </button>
          <button
            className={`px-4 py-2 rounded ${
              mealTime === "dinner"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setMealTime("dinner")}
          >
            저녁
          </button>
        </div>
      </div>

      {/* 3) 수용 인원 선택 (2,4,6,8명) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          수용 인원 선택
        </label>
        <div className="flex space-x-2">
          {[2, 4, 6, 8].map((cap) => (
            <button
              key={cap}
              className={`px-4 py-2 rounded ${
                selectedCapacity === cap
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedCapacity(cap)}
            >
              {cap}명
            </button>
          ))}
        </div>
      </div>

      {/* 4) 백엔드에서 받아온 “예약 가능한 테이블” 중 capacity===selectedCapacity만 렌더 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.length === 0 ? (
          <p className="text-gray-500">
            해당 조건(날짜: {formatDate(selectedDate)}, 시간:{" "}
            {mealTime === "lunch" ? "점심" : "저녁"}, 인원:{" "}
            {selectedCapacity}명)에 맞는 테이블이 없습니다.
          </p>
        ) : (
          tables.map((table) => (
            <TableCard
              key={table.id}
              table={{ ...table, available: true }}
              onReserve={() => handleReserve(table)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
