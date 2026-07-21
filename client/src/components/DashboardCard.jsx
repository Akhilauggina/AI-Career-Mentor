const DashboardCard = ({ title, value, color, icon, trend }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-current/10`}
            style={{ backgroundColor: "currentcolor", opacity: 0.1 }}>
            <div style={{ opacity: 10 }}>{icon}</div>
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-1 text-xs">
          <span className={trend >= 0 ? "text-emerald-600" : "text-red-500"}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
          <span className="text-slate-400">from last month</span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
