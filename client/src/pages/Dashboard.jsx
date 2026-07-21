import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { ClipboardList, Briefcase, FileText, Trophy, Plus, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboard, getRecentApplications } from "../services/dashboardService";
import { Spinner, SkeletonGrid } from "../components/Loading";
import DashboardCard from "../components/DashboardCard";
import ChartCard from "../components/ChartCard";
import RecentApplications from "../components/RecentApplications";
import EmptyState from "../components/EmptyState";

const PIE_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const [dashData, recentData] = await Promise.all([
        getDashboard(),
        getRecentApplications(),
      ]);
      setDashboard(dashData?.dashboard ?? dashData ?? {});
      const apps = Array.isArray(recentData?.applications)
        ? recentData.applications
        : Array.isArray(recentData?.data)
        ? recentData.data
        : [];
      setApplications(apps);
    } catch (err) {
      console.error(err);
      setDashboard({});
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Applications",
      value: dashboard?.totalApplications ?? 0,
      color: "text-indigo-600",
      icon: <ClipboardList size={22} />,
    },
    {
      title: "Jobs Saved",
      value: dashboard?.totalJobs ?? 0,
      color: "text-emerald-600",
      icon: <Briefcase size={22} />,
    },
    {
      title: "Resumes",
      value: dashboard?.totalResumes ?? 0,
      color: "text-purple-600",
      icon: <FileText size={22} />,
    },
    {
      title: "Offers",
      value: dashboard?.offers ?? 0,
      color: "text-amber-600",
      icon: <Trophy size={22} />,
    },
  ];

  // Build pie data from status breakdown if available
  const statusData = dashboard?.statusBreakdown
    ? Object.entries(dashboard.statusBreakdown).map(([name, value]) => ({ name, value }))
    : [
        { name: "Applied", value: dashboard?.totalApplications ?? 0 },
        { name: "Offers", value: dashboard?.offers ?? 0 },
      ];

  // Monthly chart data
  const monthlyData = dashboard?.monthlyApplications ?? [];

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonGrid count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm h-64 animate-pulse" />
          <div className="bg-white rounded-2xl shadow-sm h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
          <p className="text-slate-500 text-sm mt-0.5">Track your job search progress</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/30"
          >
            <Plus size={16} /> Add Job
          </button>
          <button
            onClick={() => navigate("/ai")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Bot size={16} className="text-indigo-600" /> AI Mentor
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <DashboardCard key={s.title} {...s} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {monthlyData.length > 0 ? (
          <ChartCard title="Applications per Month" description="Monthly application activity">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        ) : (
          <ChartCard title="Applications per Month">
            <div className="h-52 flex items-center justify-center text-slate-400 text-sm">
              No monthly data yet
            </div>
          </ChartCard>
        )}

        <ChartCard title="Application Status" description="Breakdown by status">
          {statusData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(val) => <span className="text-xs text-slate-600">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-400 text-sm">
              No applications yet
            </div>
          )}
        </ChartCard>
      </div>

      {/* Recent Applications */}
      <ChartCard title="Recent Applications" description="Your latest job applications">
        {applications.length > 0 ? (
          <RecentApplications applications={applications} />
        ) : (
          <EmptyState
            message="No applications yet"
            description="Start applying to jobs and track them here"
            action={{ label: "Browse Jobs", onClick: () => navigate("/jobs") }}
          />
        )}
      </ChartCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Upload Resume", path: "/resume", color: "bg-purple-50 text-purple-700 hover:bg-purple-100", icon: <FileText size={20} /> },
          { label: "Add Job", path: "/jobs", color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100", icon: <Briefcase size={20} /> },
          { label: "Track Application", path: "/applications", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100", icon: <ClipboardList size={20} /> },
          { label: "Chat with AI", path: "/ai", color: "bg-amber-50 text-amber-700 hover:bg-amber-100", icon: <Bot size={20} /> },
        ].map((a) => (
          <button
            key={a.path}
            onClick={() => navigate(a.path)}
            className={`${a.color} rounded-2xl p-4 flex flex-col items-center gap-2 transition-colors text-sm font-medium`}
          >
            {a.icon}
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
