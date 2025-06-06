// src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TableCard from "../components/TableCard";
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn} = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealTime, setMealTime] = useState("lunch");
  const [selectedCapacity, setSelectedCapacity] = useState(2);
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleReserve = (table) => {
    navigate("/reserve", {
      state: {
        table,
        date: formatDate(selectedDate),
        time_slot: mealTime,
      },
    });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {

    if (!isLoggedIn) {
      return;
    }

    const fetchAvailableTables = async () => {
      setLoading(true);
      setError("");

      const formattedDate = formatDate(selectedDate);

      try {
        const res = await fetch(
          `http://localhost:5000/reservation/tables?date=${formattedDate}&time_slot=${mealTime}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Status ${res.status}`);
        }

        const json = await res.json();
        setAvailableTables(json.available_tables || []);
      } catch (err) {
        console.error("테이블 목록 조회 실패:", err);
        setError(`테이블 목록 불러오기 실패: ${err.message}`);
        setAvailableTables([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTables();
  }, [selectedDate, mealTime, isLoggedIn]);

  const filteredTables = availableTables.filter(
    (table) => table.capacity === selectedCapacity
  );

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">
        🪑 테이블 예약
      </h2>

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

      {loading && (
        <p className="text-center text-gray-600 mb-4">
          테이블을 불러오는 중...
        </p>
      )}
      {error && (
        <p className="text-center text-red-600 mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTables.length === 0 && !loading && !error ? (
          <p className="text-gray-500">
            해당 조건(시간대, 인원)에 맞는 테이블이 없습니다.
          </p>
        ) : (
          filteredTables.map((table) => (
            <TableCard
              key={table.id}
              table={{
                ...table,
                available: true,
              }}
              onReserve={() => handleReserve(table)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
