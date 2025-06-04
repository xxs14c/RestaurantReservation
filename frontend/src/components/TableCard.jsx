// src/components/TableCard.jsx

import React from "react";

const TableCard = ({ table, onReserve }) => {
  // table.available: true/false에 따라 버튼 활성화/비활성화
  return (
    <div className="project-card p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-2">테이블 #{table.id}</h3>
      <p className="mb-1">위치: {table.location}</p>
      <p className="mb-1">수용 인원: {table.capacity}명</p>
      <p className="mb-4">
        {table.available
          ? <span className="text-green-600 font-medium">예약 가능</span>
          : <span className="text-red-500 font-medium">예약 불가</span>}
      </p>

      <button
        onClick={onReserve}
        disabled={!table.available}
        className={`px-4 py-2 rounded w-full text-white font-medium transition-colors ${
          table.available
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        예약하기
      </button>
    </div>
  );
};

export default TableCard;
