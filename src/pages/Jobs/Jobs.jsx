import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import dbData from "../../../db/db.json";
import "./Jobs.css";

const ALL_JOBS = dbData.jobs;
const NOW = Date.now();

export default function Jobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const JOBS_PER_PAGE = 5;

  // ── Sort jobs ────────────────────────────────────────────────
  const jobs = useMemo(() => {
    const sorted = [...ALL_JOBS];
    if (sortBy === "newest")      sorted.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    else if (sortBy === "oldest") sorted.sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt));
    else if (sortBy === "salary_high") sorted.sort((a, b) => b.salaryMax - a.salaryMax);
    else if (sortBy === "salary_low")  sorted.sort((a, b) => a.salaryMin - b.salaryMin);
    return sorted;
  }, [sortBy]);

  // ── Helpers ──────────────────────────────────────────────────
  function toggleSave(id) {
    setSavedJobs((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function timeAgo(dateStr) {    
  const hrs = Math.floor((NOW - new Date(dateStr)) / 3_600_000);
    if (hrs < 1)  return "Just now";
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
    const d = Math.floor(hrs / 24);
    return `${d} day${d > 1 ? "s" : ""} ago`;
  }

  // ── Pagination ───────────────────────────────────────────────
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const pagedJobs  = jobs.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  function pageNumbers() {
    const nums = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) nums.push(i);
    } else {
      nums.push(1);
      if (page > 3) nums.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) nums.push(i);
      if (page < totalPages - 2) nums.push("...");
      nums.push(totalPages);
    }
    return nums;
  }

  return (
    <div className="jobs-page">
      <div className="container py-4">
        {/* Header row */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h5 className="fw-bold mb-0">{jobs.length.toLocaleString()} jobs found</h5>
          <select
            className="form-select form-select-sm"
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            style={{ width: "auto" }}
          >
            <option value="newest">Most recent</option>
            <option value="oldest">Oldest</option>
            <option value="salary_high">Salary: High → Low</option>
            <option value="salary_low">Salary: Low → High</option>
          </select>
        </div>

        {/* Job cards */}
        <div className="d-flex flex-column gap-3">
          {pagedJobs.map((job) => {
            const isSaved = savedJobs.includes(job.id);
            return (
              <div key={job.id} className="job-card card border rounded-3 p-4 position-relative">
                {/* Top-right bookmark */}
                <button
                  className="btn p-0 position-absolute top-0 end-0 mt-3 me-3 bookmark-btn"
                  onClick={() => toggleSave(job.id)}
                  title={isSaved ? "Unsave" : "Save"}
                >
                  <i className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark fs-5 ${isSaved ? "main-color" : "text-muted"}`}></i>
                </button>

                {/* Company logo + info */}
                <div className="d-flex gap-3 align-items-start pe-4">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="job-company-logo rounded-circle"
                    width={48} height={48}
                    onError={(e) => { e.target.src = `https://placehold.co/48x48?text=${job.company[0]}`; }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1">{job.title}</h6>
                    <p className="text-muted small mb-1">{job.company}</p>
                    <div className="d-flex flex-wrap gap-3 small text-muted mb-2">
                      <span><i className="fa-solid fa-location-dot me-1"></i>{job.location}</span>
                      <span><i className="fa-solid fa-dollar-sign me-1"></i>${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()} / month</span>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge jobs-badge-primary">{job.type}</span>
                      <span className="badge jobs-badge-secondary">{job.workMode}</span>
                    </div>
                  </div>
                </div>

                {/* Footer row */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">
                    Posted {timeAgo(job.postedAt)} · {job.applicants} applicants
                  </small>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn p-0 bookmark-btn"
                      onClick={() => toggleSave(job.id)}
                      title={isSaved ? "Unsave" : "Save"}
                    >
                      <i className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark ${isSaved ? "main-color" : "text-muted"}`}></i>
                    </button>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="btn bg-main-color text-white px-4 fw-semibold rounded-2 view-job-btn"
                    >
                      View job
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-1 mt-4 flex-wrap">
            <button
              className="btn btn-outline-secondary btn-sm px-3"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >‹</button>

            {pageNumbers().map((n, i) =>
              n === "..." ? (
                <span key={`dots-${i}`} className="px-2 text-muted">…</span>
              ) : (
                <button
                  key={n}
                  className={`btn btn-sm px-3 ${page === n ? "bg-main-color text-white border-0" : "btn-outline-secondary"}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              )
            )}

            <button
              className="btn btn-outline-secondary btn-sm px-3"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >›</button>
          </div>
        )}

        {jobs.length > 0 && (
          <p className="text-center text-muted small mt-2">
            Showing {(page - 1) * JOBS_PER_PAGE + 1}–{Math.min(page * JOBS_PER_PAGE, jobs.length)} of {jobs.length} jobs
          </p>
        )}
      </div>
    </div>
  );
}
