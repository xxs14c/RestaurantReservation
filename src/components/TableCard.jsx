import React from "react";

const TableCard = ({ table, onReserve }) => {
  return (
    <div className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">🪑 Table {table.id}</h3>

      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <p>📍 위치: <span className="font-medium text-gray-700">{table.location}</span></p>
        <p>👥 수용 인원: <span className="font-medium">{table.capacity}명</span></p>
        <p>
          상태:{" "}
          <span className={`font-semibold ${table.available ? "text-green-600" : "text-red-500"}`}>
            {table.available ? "예약 가능" : "예약 불가"}
          </span>
        </p>
      </div>

      <button
        onClick={() => onReserve(table)}
        disabled={!table.available}
        className={`w-full py-2 rounded font-semibold transition-colors
          ${table.available
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
      >
        예약하기
      </button>
    </div>
  );
};

export default TableCard;