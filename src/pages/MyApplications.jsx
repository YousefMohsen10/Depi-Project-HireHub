import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CandidateLayout from "../components/CandidateLayout";
import { api } from "../services/api";

const PAGE_SIZE = 6;
const tabNames = ["All", "Applied", "In Review", "Interviews", "Closed"];
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];

function formatDate(date) {
  const d = new Date(date);
  return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

function daysAgo(date) {
  return (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
}

function getTab(status) {
  if (status === "Applied") return "Applied";
  if (status === "In Review" || status === "Shortlisted") return "In Review";
  if (status === "Interview") return "Interviews";
  return "Closed";
}

function getBadge(status) {
  if (status === "Applied") return "applied";
  if (status === "In Review") return "review";
  if (status === "Shortlisted") return "selected";
  if (status === "Interview") return "interview";
  if (status === "Not selected") return "closed";
  return "withdrawn";
}

function MyApplications() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.getUser(), api.getApplications(), api.getJobs()])
      .then(([userData, appsData, jobsData]) => {
        setUser(userData);
        setApplications(appsData);
        const jobsById = {};
        jobsData.forEach((job) => {
          jobsById[job.id] = job;
        });
        setJobs(jobsById);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load. Is json-server running?");
        setLoading(false);
      });
  }, []);

  function getJob(app) {return jobs[app.jobId] || {}; }

  function countTab(name) {
    if (name === "All") return applications.length;
    return applications.filter((app) => getTab(app.status) === name).length;
  }

  function withdraw(app) {
    api
      .updateApplication(app.id, { status: "Withdrawn" })
      .then(() => api.getApplications())
      .then((data) => {
        setApplications(data);
        setSelected(null);
      })
      .catch(() => setError("Could not withdraw application."));
  }

  function changeFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  const list = applications.filter((app) => {
    const job = getJob(app);
    const text = (job.title + " " + job.company).toLowerCase();
    const matchTab = tab === "All" || getTab(app.status) === tab;
    const matchText = text.includes(search.toLowerCase());
    const matchType = jobType === "All" || job.type === jobType;
    let matchDate = true;
    if (dateRange !== "All")
      matchDate = daysAgo(app.appliedAt) <= Number(dateRange);
    return matchTab && matchText && matchType && matchDate;
  });

  list.sort((a, b) => {
    if (sort === "newest") return new Date(b.appliedAt) - new Date(a.appliedAt);
    return new Date(a.appliedAt) - new Date(b.appliedAt);
  });

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const currentPage = page > totalPages ? totalPages : page;
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = list.slice(start, start + PAGE_SIZE);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <CandidateLayout user={user}>
      <h1>My applications</h1>
      <p className="sub">
        Every application is a step forward. Keep track of yours here.
      </p>

      {error && <div className="alert-err">{error}</div>}

      <div className="tabs">
        {tabNames.map((name) => (
          <button
            key={name}
            className={tab === name ? "tab active" : "tab"}
            onClick={() => changeFilter(setTab, name)}
          >
            {name} ({countTab(name)})
          </button>
        ))}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="lbl">Search applications</label>
          <input
            className="inp"
            value={search}
            onChange={(e) => changeFilter(setSearch, e.target.value)}
            placeholder="Job title or company"
          />
        </div>
        <div className="col-md-4">
          <label className="lbl">Date applied</label>
          <select
            className="inp"
            value={dateRange}
            onChange={(e) => changeFilter(setDateRange, e.target.value)}
          >
            <option value="All">All dates</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="lbl">Job type</label>
          <select
            className="inp"
            value={jobType}
            onChange={(e) => changeFilter(setJobType, e.target.value)}
          >
            <option value="All">All job types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : applications.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">
            <i className="fa-regular fa-file-lines" />
          </div>
          <h2 className="fs-5 fw-bold mb-2">Your next chapter starts here</h2>
          <p className="text-muted mb-3">
            You haven't applied to any jobs yet. Explore opportunities and take
            your next career step.
          </p>
          <button className="btn-blue" onClick={() => navigate("/jobs")}>
            Find jobs
          </button>
        </div>
      ) : list.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">
            <i className="fa-solid fa-magnifying-glass" />
          </div>
          <h2 className="fs-5 fw-bold mb-2">No matches</h2>
          <button
            className="btn-out mt-2"
            onClick={() => {
              setSearch("");
              setTab("All");
              setDateRange("All");
              setJobType("All");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              {list.length} applications
            </span>
            <select
              className="inp"
              style={{ width: "auto" }}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          <div className="tbl-wrap d-none d-md-block">
            <table>
              <thead>
                <tr>
                  <th>Job / Company</th>
                  <th>Date applied</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{getJob(app).title}</div>
                      <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
                        {getJob(app).company} · {getJob(app).location}
                      </div>
                    </td>
                    <td style={{ color: "#475569" }}>
                      {formatDate(app.appliedAt)}
                    </td>
                    <td>
                      <span className={"badge " + getBadge(app.status)}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-link"
                        onClick={() => setSelected(app)}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-column gap-3 d-md-none">
            {paginated.map((app) => (
              <div key={app.id} className="card mb-0 p-3">
                <div style={{ fontWeight: 700 }}>{getJob(app).title}</div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "0.82rem",
                    marginBottom: 8,
                  }}
                >
                  {getJob(app).company} · {getJob(app).location}
                </div>
                <div
                  style={{
                    color: "#475569",
                    fontSize: "0.82rem",
                    marginBottom: 8,
                  }}
                >
                  {formatDate(app.appliedAt)}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className={"badge " + getBadge(app.status)}>
                    {app.status}
                  </span>
                  <button className="btn-link" onClick={() => setSelected(app)}>
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pages">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                ‹
              </button>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  className={
                    currentPage === number ? "page-btn active" : "page-btn"
                  }
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              ))}
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                ›
              </button>
            </div>
          )}

          <div style={{ color: "#94a3b8", fontSize: "0.78rem", marginTop: 10 }}>
            Showing {start + 1}–{Math.min(start + PAGE_SIZE, list.length)} of{" "}
            {list.length} applications
          </div>
        </>
      )}

      {selected && (
        <div className="backdrop">
          <div className="modal">
            <div className="modal-head">
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                  {getJob(selected).title}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.84rem" }}>
                  {getJob(selected).company} · {getJob(selected).location}
                </div>
              </div>
              <button className="btn-close" onClick={() => setSelected(null)} />
            </div>

            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center">
                <span className={"badge " + getBadge(selected.status)}>
                  {selected.status}
                </span>
                <span style={{ color: "#64748b", fontSize: "0.83rem" }}>
                  Applied {formatDate(selected.appliedAt)}
                </span>
              </div>

              {selected.interview && (
                <div
                  style={{
                    background: "#f5f3ff",
                    border: "1px solid #ddd6fe",
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#6d28d9",
                      marginBottom: 4,
                    }}
                  >
                    <i className="fa-regular fa-calendar me-2" />
                    Scheduled interview
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#4c1d95" }}>
                    {formatDate(selected.interview.date)} ·{" "}
                    {selected.interview.mode}
                  </div>
                </div>
              )}

              <div className="review-box">
                <div className="rh">
                  <span>Submitted info</span>
                </div>
                <div style={{ fontSize: "0.84rem", color: "#334155" }}>
                  <div>
                    <b>Name:</b> {selected.fullName}
                  </div>
                  <div>
                    <b>Email:</b> {selected.email}
                  </div>
                  <div>
                    <b>Phone:</b> {selected.phone}
                  </div>
                  <div>
                    <b>Resume:</b> {selected.resumeFileName}
                  </div>
                </div>
              </div>

              <div className="review-box">
                <div className="rh">
                  <span>Cover letter</span>
                </div>
                <p
                  style={{
                    fontSize: "0.84rem",
                    color: selected.coverLetter ? "#334155" : "#94a3b8",
                    whiteSpace: "pre-line",
                    margin: 0,
                  }}
                >
                  {selected.coverLetter || "No cover letter submitted."}
                </p>
              </div>
            </div>

            <div className="modal-foot">
              {selected.status !== "Withdrawn" &&
              selected.status !== "Not selected" ? (
                <button
                  className="btn-out"
                  style={{ borderColor: "#fca5a5", color: "#dc2626" }}
                  onClick={() => withdraw(selected)}
                >
                  Withdraw
                </button>
              ) : (
                <span />
              )}
              <button className="btn-blue" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </CandidateLayout>
  );
}

export default MyApplications;
