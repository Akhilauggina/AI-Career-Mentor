// Seed a fake token + user so AuthContext and Navbar don't show blank state.
// This file is imported once from main.jsx and can be deleted when real auth is wired up.
if (!localStorage.getItem("token")) {
  localStorage.setItem("token", "preview-token");
}
if (!localStorage.getItem("user")) {
  localStorage.setItem(
    "user",
    JSON.stringify({
      _id: "preview",
      name: "Preview User",
      email: "preview@example.com",
      title: "Software Engineer",
      skills: ["React", "Node.js", "MongoDB"],
    })
  );
}
