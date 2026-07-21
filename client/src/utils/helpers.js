export const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const truncate = (str, length = 60) => {
  if (!str) return "";
  return str.length > length ? str.slice(0, length) + "…" : str;
};

export const statusColors = {
  Applied: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  "Interview Scheduled": { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  "Interview Completed": { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  Offer: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  Accepted: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  Rejected: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  Saved: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  Active: { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
};

export const jobTypes = ["Full-time", "Part-time", "Internship", "Contract", "Remote"];
export const experienceLevels = ["Fresher", "Junior", "Mid-level", "Senior", "Lead"];
export const applicationStatuses = [
  "Applied",
  "Interview Scheduled",
  "Interview Completed",
  "Offer",
  "Rejected",
  "Accepted",
];
export const jobStatuses = ["Saved", "Applied", "Closed"];
