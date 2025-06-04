import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TableCard from "../components/TableCard";

const mockTables = [
  { id: 1, location: "창가", capacity: 2, availableTimes: ["lunch", "dinner"] },
  { id: 2, location: "룸", capacity: 4, availableTimes: ["dinner"] },
  { id: 3, location: "내부", capacity: 6, availableTimes: ["lunch"] },
  { id: 4, location: "개인실", capacity: 8, availableTimes: ["dinner"] },
  // … 필요에 따라 더 추가
];

const HomePage = () => {
  const navigate = useNavigate();
  const [mealTime, setMealTime] = useState("lunch");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleReserve = (table) => {
    navigate("/reserve", {
      state: {
        table,
        date: formatDate(selectedDate),
        time: mealTime,
      },
    });
  };

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const filteredTables = mockTables.map((table) => ({
    ...table,
    available: table.availableTimes.includes(mealTime),
  }));

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">🪑 테이블 예약</h2>

      {/* 날짜 + 시간대 선택 */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0 mb-6">
        {/* 1) 예약 날짜 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            예약 날짜
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 오늘부터 한 달 뒤까지
            dateFormat="yyyy-MM-dd"
            className="border p-2 rounded"
          />
        </div>

        {/* 2) 점심/저녁 선택 */}
        <div>
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTables.length === 0 ? (
          <p className="text-gray-500">예약 가능한 테이블이 없습니다.</p>
        ) : (
          filteredTables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onReserve={() => handleReserve(table)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
