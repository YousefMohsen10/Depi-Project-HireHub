import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import brandWhite from "../assets/Brand_mark_white.svg";
import "./Auth.css";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("candidate");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the Terms of Service");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser(
        email,
        password,
        fullName,
        role,
        companyName
      );

      if (data.session) {
        navigate("/login");
      } else {
        setSuccess("Account created! Please check your email to confirm your account.");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper d-flex">
      <div className="auth-left d-none d-md-flex flex-column justify-content-between p-4 p-lg-5">
        <div className="auth-logo d-flex align-items-center gap-2">
          <img src={brandWhite} alt="HireHub" height={36} />
          <span className="fw-bold fs-4 text-white">HireHub</span>
        </div>

        <div className="auth-hero my-auto">
          <h1 className="display-5 fw-bold text-white mb-3">
            Your next career<br />starts here
          </h1>
          <p className="text-white-50 mb-0" style={{ maxWidth: 320 }}>
            Discover great opportunities, connect with top companies, and build
            the career you want.
          </p>
        </div>

        <div className="auth-stats d-flex gap-5 pt-4">
          <div>
            <div className="text-white fw-bold fs-4">12,458</div>
            <div className="text-white-50 small">Jobs posted</div>
          </div>
          <div>
            <div className="text-white fw-bold fs-4">3,240</div>
            <div className="text-white-50 small">Companies</div>
          </div>
          <div>
            <div className="text-white fw-bold fs-4">18,760</div>
            <div className="text-white-50 small">Candidates hired</div>
          </div>
        </div>
      </div>

      <div className="auth-right flex-grow-1 d-flex flex-column p-4 p-lg-5">
        <div className="text-end mb-4">
          <Link to="/" className="text-muted text-decoration-none small">
            ← Back to HireHub
          </Link>
        </div>

        <div className="auth-form-wrap mx-auto w-100">
          <h2 className="fw-bold mb-1" style={{ color: "#0d3b30" }}>Create your account</h2>
          <p className="text-muted mb-4">
            {role === "employer"
              ? "Find the right talent for your team."
              : "Take the next step in your career."}
          </p>

          <div className="btn-group w-100 mb-4" role="group">
            <button
              type="button"
              className={`btn btn-role ${role === "candidate" ? "active" : ""}`}
              onClick={() => setRole("candidate")}
            >
              <i className="fa-regular fa-user me-2"></i>Job Seeker
            </button>
            <button
              type="button"
              className={`btn btn-role ${role === "employer" ? "active" : ""}`}
              onClick={() => setRole("employer")}
            >
              <i className="fa-regular fa-building me-2"></i>Employer
            </button>
          </div>

          <div className="d-flex mb-4 auth-tabs">
            <Link to="/login" className="auth-tab flex-fill">Login</Link>
            <Link to="/signup" className="auth-tab flex-fill active">Sign Up</Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small">Full name</label>
              <input
                type="text"
                className="form-control auth-input"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {role === "employer" && (
              <div className="mb-3">
                <label className="form-label fw-semibold small">Company name</label>
                <input
                  type="text"
                  className="form-control auth-input"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-semibold small">Email address</label>
              <input
                type="email"
                className="form-control auth-input"
                placeholder={role === "employer" ? "you@company.com" : "you@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-1">
              <label className="form-label fw-semibold small">Password</label>
              <div className="position-relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control auth-input pe-5"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                >
                  <i className={`fa-regular ${showPass ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>
            <p className="text-muted small mb-3">Use at least 8 characters.</p>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Confirm password</label>
              <div className="position-relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="form-control auth-input pe-5"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                >
                  <i className={`fa-regular ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <label className="form-check-label small" htmlFor="terms">
                I agree to the
                <span className="text-decoration-none mx-1" style={{ color: "#1a7a5e" }}>
                  Terms of Service
                </span>
                and
                <span className="text-decoration-none mx-1" style={{ color: "#1a7a5e" }}>
                  Privacy Policy
                </span>
                .
              </label>
            </div>
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            {success && (
              <div className="alert alert-success">{success}</div>
            )}
            <button type="submit" className="btn btn-hirehub text-white w-100 mb-3">
              Create Account
            </button>

            <div className="d-flex align-items-center gap-3 mb-3">
              <hr className="flex-grow-1 m-0" />
              <span className="text-muted small">or continue with</span>
              <hr className="flex-grow-1 m-0" />
            </div>



            <p className="text-center text-muted small mb-0">
              Already have an account?{" "}
              <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: "#1a7a5e" }}>
                Log in
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center text-muted small mt-auto pt-4 mb-0">
          © 2026 <strong>HireHub</strong>. All rights reserved.
        </p>
      </div>
    </div>
  );
}

