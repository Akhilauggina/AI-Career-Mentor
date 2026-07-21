import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { Mail, Lock, User, Sparkles, ArrowRight, Loader2 } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await registerUser(form);
      addToast("Account created! Please log in.", "success");
      navigate("/login");
    } catch (error) {
      addToast(error?.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "John Doe", icon: User },
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com", icon: Mail },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">CareerMentor</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Create your account</h2>
          <p className="text-slate-500 text-sm mb-6">Start your AI-powered career journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, placeholder, icon: Icon }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all ${
                      errors[name] ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
                    }`}
                  />
                </div>
                {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
