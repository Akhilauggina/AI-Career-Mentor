import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/ProfileService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Spinner } from "../components/Loading";
import {
  User, Mail, Phone, GraduationCap, Code, Pencil, X, Check,
  BookOpen, Plus, Trash2,
} from "lucide-react";
import { getInitials } from "../utils/helpers";

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
      <Icon size={12} />
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ editing, value, onChange, name, placeholder, disabled, type = "text" }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    disabled={disabled || !editing}
    placeholder={placeholder}
    className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-800 transition-all ${
      editing && !disabled
        ? "border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        : "border-transparent bg-slate-50 text-slate-600 cursor-default"
    }`}
  />
);

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", college: "", degree: "", skills: "",
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skillsList, setSkillsList] = useState([]);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const skills = Array.isArray(res?.skills) ? res.skills : (res?.skills || "").split(",").map((s) => s.trim()).filter(Boolean);
      const data = {
        name: res?.name || "",
        email: res?.email || "",
        phone: res?.phone || "",
        college: res?.education?.[0]?.college || "",
        degree: res?.education?.[0]?.degree || "",
        skills: Array.isArray(res?.skills) ? res.skills.join(", ") : res?.skills || "",
      };
      setProfile(data);
      setOriginalProfile(data);
      setSkillsList(skills);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skillsList.includes(s)) {
      setSkillsList([...skillsList, s]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => setSkillsList(skillsList.filter((s) => s !== skill));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: profile.name,
        phone: profile.phone,
        skills: skillsList,
        education: [{ college: profile.college, degree: profile.degree }],
      };
      const updated = await updateProfile(payload);
      const refreshed = {
        name: updated.name || profile.name,
        email: updated.email || profile.email,
        phone: updated.phone || profile.phone,
        college: updated.education?.[0]?.college || profile.college,
        degree: updated.education?.[0]?.degree || profile.degree,
        skills: Array.isArray(updated.skills) ? updated.skills.join(", ") : updated.skills || profile.skills,
      };
      setProfile(refreshed);
      setOriginalProfile(refreshed);
      updateUser?.({ ...user, name: updated.name || profile.name });
      setEditing(false);
      addToast("Profile updated successfully!", "success");
    } catch (err) {
      addToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalProfile) setProfile(originalProfile);
    setSkillsList(
      originalProfile?.skills
        ? originalProfile.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : []
    );
    setEditing(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-start justify-between">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
              {getInitials(profile.name || "U")}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{profile.name || "Your Name"}</h2>
              <p className="text-slate-500 text-sm">{profile.email}</p>
              {profile.degree && (
                <p className="text-xs text-indigo-600 font-medium mt-1 flex items-center gap-1">
                  <GraduationCap size={12} />
                  {profile.degree} {profile.college && `· ${profile.college}`}
                </p>
              )}
            </div>
          </div>

          {/* Edit toggle */}
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Pencil size={15} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <X size={15} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
              >
                <Check size={15} /> {saving ? "Saving…" : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Personal Info */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <User size={16} className="text-indigo-600" /> Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" icon={User}>
            <Input editing={editing} name="name" value={profile.name} onChange={handleChange} placeholder="Your name" />
          </Field>
          <Field label="Email" icon={Mail}>
            <Input editing={false} disabled name="email" value={profile.email} onChange={handleChange} placeholder="Email" />
          </Field>
          <Field label="Phone" icon={Phone}>
            <Input editing={editing} name="phone" value={profile.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
          </Field>
        </div>
      </form>

      {/* Education */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-600" /> Education
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="College / University" icon={GraduationCap}>
            <Input editing={editing} name="college" value={profile.college} onChange={handleChange} placeholder="IIT Bombay" />
          </Field>
          <Field label="Degree" icon={GraduationCap}>
            <Input editing={editing} name="degree" value={profile.degree} onChange={handleChange} placeholder="B.Tech CSE" />
          </Field>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <Code size={16} className="text-indigo-600" /> Skills
        </h3>

        <div className="flex flex-wrap gap-2 min-h-10">
          {skillsList.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm rounded-xl font-medium"
            >
              {skill}
              {editing && (
                <button onClick={() => removeSkill(skill)} className="text-indigo-400 hover:text-red-500 transition-colors">
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
          {!skillsList.length && !editing && (
            <p className="text-slate-400 text-sm">No skills added yet.</p>
          )}
        </div>

        {editing && (
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              placeholder="Add skill (press Enter)"
              className="flex-1 px-3 py-2.5 border border-indigo-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
            >
              <Plus size={15} /> Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
