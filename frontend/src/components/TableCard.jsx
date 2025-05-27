import React from "react";

const TableCard = ({ table, onReserve }) => {
  return (
    <div className="border p-4 bg-white rounded shadow-md">
      <h3 className="text-lg font-bold mb-2">Table {table.id}</h3>
      <p>📍 위치: {table.location}</p>
      <p>👥 수용 인원: {table.capacity}명</p>
      <p className={`font-semibold ${table.available ? "text-green-600" : "text-red-500"}`}>
        {table.available ? "예약 가능" : "예약 불가"}
      </p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
        disabled={!table.available}
        onClick={() => onReserve(table)}
      >
        예약하기
      </button>
    </div>
  );
};

export default TableCard;