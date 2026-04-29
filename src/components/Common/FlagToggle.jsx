const FlagToggle = ({
  label,
  value,
  indeterminate,
  loading,
  onClick,
}) => {
  return (
    <div className="flex items-center gap-3">
      
      {/* Label */}
      <span className="text-sm font-semibold text-gray-700">
        {label}
      </span>

      {/* Toggle */}
      <div
        onClick={!loading ? onClick : undefined}
        className={`relative w-14 h-7 rounded-full transition-all duration-300
          ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${
            indeterminate
              ? "bg-yellow-400"
              : value
              ? "bg-[#468432]"
              : "bg-gray-300"
          }
        `}
      >
        {/* Knob */}
        <div
          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md
            flex items-center justify-center
            transition-all duration-300
            ${
              indeterminate
                ? "translate-x-[14px]"   // center
                : value
                ? "translate-x-[28px]"   // right
                : "translate-x-0"        // left
            }
          `}
        >
          {/* Icons */}
          {indeterminate ? (
            <div className="w-2 h-2 bg-yellow-700 rounded-full" />
          ) : value ? (
            <svg
              className="w-3 h-3 text-green-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default FlagToggle;