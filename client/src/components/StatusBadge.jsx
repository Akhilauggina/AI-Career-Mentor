import { statusColors } from "../utils/helpers";

const StatusBadge = ({ status, size = "sm" }) => {
  const style = statusColors[status] || { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" };
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${style.bg} ${style.text} ${textSize}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
