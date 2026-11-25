import { NavLink } from "react-router-dom";
import "../styles/candidatePortal.css";
function getInitials(name = "") { return name.trim().split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("");}

function CandidateLayout({ user, children }) {
  const name = user?.fullName || "Alex Morgan";

  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px 18px", borderBottom: "1px solid #f1f5f9", marginBottom: 12 }}>
          <div className="avatar">
            {user?.avatar ? <img src={user.avatar} alt={name} /> : getInitials(name)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{name}</div>
            <div style={{ fontSize: "0.76rem", color: "#64748b" }}>Candidate</div>
          </div>
        </div>

        <NavLink to="/my-applications" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fa-regular fa-file-lines" /> My Applications
        </NavLink>
        <NavLink to="/saved-jobs" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fa-regular fa-bookmark" /> Saved Jobs
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fa-regular fa-user" /> Profile
        </NavLink>
      </aside>

      {/* Main */}
      <main className="main">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="mob-nav">
        <NavLink to="/my-applications" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fa-regular fa-file-lines fa-lg" /><span>Applications</span>
        </NavLink>
        <NavLink to="/saved-jobs" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fa-regular fa-bookmark fa-lg" /><span>Saved</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
          <i className="fa-regular fa-user fa-lg" /><span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default CandidateLayout;
