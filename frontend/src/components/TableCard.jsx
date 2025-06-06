import React from "react";

const TableCard = ({ table, onReserve }) => {
  return (
    <div className="p-4 border rounded bg-white shadow-sm flex flex-col justify-between">
      <div>
        <p className="text-lg font-semibold">테이블 #{table.id}</p>
        <p>
          위치: <span className="font-medium">{table.location}</span>
        </p>
        <p>
          수용 인원: <span className="font-medium">{table.capacity}명</span>
        </p>
        <p>
          {table.available ? (
            <span className="text-green-600 font-semibold">예약 가능</span>
          ) : (
            <span className="text-red-600 font-semibold">예약 불가</span>
          )}
        </p>
      </div>
      <button
        onClick={onReserve}
        disabled={!table.available}
        className={`mt-4 w-full px-3 py-2 rounded font-semibold ${
          table.available
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        예약하기
      </button>
    </div>
  );
};

export default TableCard;
