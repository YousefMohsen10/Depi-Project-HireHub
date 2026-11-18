import { Link, NavLink } from "react-router-dom";
import logo from "../assets/Brandmark_green.svg";
import "./Navbar.css";

const links = [
  { to: "/jobs", label: "Find Jobs" },
  { to: "/companies", label: "Companies" },
  { to: "/admin/post-job", label: "Post a Job" },
  { to: "/about", label: "About" },
];

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top">
      <div className="container py-2">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="" className="mx-2" />
          <span className="fs-4 fw-bold">HireHub</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            {links.map((l) => (
              <li className="nav-item mx-2 fw-bold" key={l.to}>
                <NavLink className="nav-link" to={l.to}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">
            <Link to="/login" className="btn btn-md main-color rounded-3 border border-2 fw-bold login">
              <i className="fa-solid fa-arrow-right-to-bracket"></i> Login
            </Link>
            <Link to="/signup" className="btn btn-md bg-main-color text-white rounded-3 fw-bold sign">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
