const ChartCard = ({ title, description, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        {description && (
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
