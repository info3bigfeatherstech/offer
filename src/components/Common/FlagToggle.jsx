// Common/FlagToggle.jsx

import React, { useRef, useEffect } from "react";

const FlagToggle = ({ label, checked, indeterminate, loading, onChange }) => {
  const checkboxRef = useRef(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all select-none ${
      loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
    } ${
      checked ? "bg-orange-50 border-orange-300 text-orange-700" :
      indeterminate ? "bg-yellow-50 border-yellow-300 text-yellow-700" :
      "bg-white border-gray-200 text-gray-600"
    }`}>
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={loading}
        className="w-4 h-4 rounded border-gray-300 text-orange-500 cursor-pointer accent-orange-500"
      />
      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
      {loading && (
        <div className="w-3 h-3 border border-orange-400 border-t-transparent rounded-full animate-spin" />
      )}
    </label>
  );
};

export default FlagToggle;