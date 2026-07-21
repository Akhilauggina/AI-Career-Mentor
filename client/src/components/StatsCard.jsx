const StatsCard = ({ title, value, icon, color = "text-indigo-600", bg = "bg-indigo-50" }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <span className={color}>{icon}</span>
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className={`text-3xl font-bold mt-0.5 ${color}`}>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
