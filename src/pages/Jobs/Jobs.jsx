import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import dbData from "../../../db/db.json";
import "./Jobs.css";

const ALL_JOBS   = dbData.jobs;
const CATEGORIES = [...new Set(ALL_JOBS.map((j) => j.category))].sort();

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Search bar ──────────────────────────────────────────────
  const [keyword,  setKeyword]  = useState(searchParams.get("keyword")  || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  // ── Sidebar filters ─────────────────────────────────────────
  const [jobTypes,    setJobTypes]    = useState([]);
  const [workModes,   setWorkModes]   = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [salaryRange, setSalaryRange] = useState(2000);
  const [datePosted,  setDatePosted]  = useState("any");

  // ── Results ─────────────────────────────────────────────────
  const [jobs,       setJobs]      = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [savedJobs,  setSavedJobs]  = useState([]);
  const [sortBy,     setSortBy]    = useState("newest");
  const [page,       setPage]      = useState(1);
  const JOBS_PER_PAGE = 5;

  const TYPE_OPTIONS    = ["Full-time", "Part-time", "Contract", "Internship"];
  const WORK_OPTIONS    = ["Remote", "Hybrid", "On-site"];
  const EXP_OPTIONS     = ["Entry-level", "Mid-level", "Senior"];

  // ── Filter + sort whenever deps change ──────────────────────
  useEffect(() => {
    const kw  = searchParams.get("keyword")  || "";
    const loc = searchParams.get("location") || "";
    const cat = searchParams.get("category") || "";

    let result = [...ALL_JOBS];

    if (kw)  result = result.filter((j) =>
      j.title.toLowerCase().includes(kw.toLowerCase()) ||
      j.company.toLowerCase().includes(kw.toLowerCase())
    );
    if (loc) result = result.filter((j) =>
      j.location.toLowerCase().includes(loc.toLowerCase())
    );
    if (cat) result = result.filter((j) => j.category === cat);

    if (jobTypes.length)    result = result.filter((j) => jobTypes.includes(j.type));
    if (workModes.length)   result = result.filter((j) => workModes.includes(j.workMode));
    if (experiences.length) result = result.filter((j) =>
      experiences.some((e) => j.experienceLevel?.toLowerCase().includes(e.toLowerCase()))
    );

    result = result.filter((j) => j.salaryMin <= salaryRange);

    if (datePosted === "24h") {
      const cut = new Date(Date.now() - 86_400_000);
      result = result.filter((j) => new Date(j.postedAt) >= cut);
    } else if (datePosted === "7d") {
      const cut = new Date(Date.now() - 7 * 86_400_000);
      result = result.filter((j) => new Date(j.postedAt) >= cut);
    } else if (datePosted === "30d") {
      const cut = new Date(Date.now() - 30 * 86_400_000);
      result = result.filter((j) => new Date(j.postedAt) >= cut);
    }

    if (sortBy === "newest")      result.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    else if (sortBy === "oldest") result.sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt));
    else if (sortBy === "salary_high") result.sort((a, b) => b.salaryMax - a.salaryMax);
    else if (sortBy === "salary_low")  result.sort((a, b) => a.salaryMin - b.salaryMin);

    setJobs(result);
    setPage(1);

    // Build active filter tags
    const tags = [];
    if (kw)  tags.push({ label: kw,  key: "keyword" });
    if (loc) tags.push({ label: loc, key: "location" });
    if (cat) tags.push({ label: cat, key: "category" });
    jobTypes.forEach((t)  => tags.push({ label: t, key: "type_" + t }));
    workModes.forEach((m) => tags.push({ label: m, key: "mode_" + m }));
    experiences.forEach((e) => tags.push({ label: e, key: "exp_" + e }));
    setActiveTags(tags);
  }, [searchParams, jobTypes, workModes, experiences, salaryRange, datePosted, sortBy]);

  // ── Helpers ──────────────────────────────────────────────────
  function handleSearch(e) {
    e.preventDefault();
    const p = {};
    if (keyword)  p.keyword  = keyword;
    if (location) p.location = location;
    if (category) p.category = category;
    setSearchParams(p);
  }

  function removeTag(tag) {
    const p = Object.fromEntries(searchParams);
    if (tag.key === "keyword")       { setKeyword("");  delete p.keyword;   setSearchParams(p); }
    else if (tag.key === "location") { setLocation(""); delete p.location;  setSearchParams(p); }
    else if (tag.key === "category") { setCategory(""); delete p.category;  setSearchParams(p); }
    else if (tag.key.startsWith("type_")) setJobTypes((prev)    => prev.filter((x) => x !== tag.label));
    else if (tag.key.startsWith("mode_")) setWorkModes((prev)   => prev.filter((x) => x !== tag.label));
    else if (tag.key.startsWith("exp_"))  setExperiences((prev) => prev.filter((x) => x !== tag.label));
  }

  function clearAll() {
    setKeyword(""); setLocation(""); setCategory("");
    setJobTypes([]); setWorkModes([]); setExperiences([]);
    setSalaryRange(2000); setDatePosted("any");
    setSearchParams({});
  }

  function toggle(val, list, setter) {
    setter(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);
  }

  function toggleSave(id) {
    setSavedJobs((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function timeAgo(dateStr) {
    const hrs = Math.floor((Date.now() - new Date(dateStr)) / 3_600_000);
    if (hrs < 1)  return "Just now";
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
    const d = Math.floor(hrs / 24);
    return `${d} day${d > 1 ? "s" : ""} ago`;
  }

  function countField(val, field) {
    return ALL_JOBS.filter((j) => j[field] === val).length;
  }

  // ── Pagination ───────────────────────────────────────────────
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const pagedJobs  = jobs.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  // Build page numbers to display
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
      {/* ── Search Bar ───────────────────────────────────────── */}
      <div className="jobs-search-bar py-4">
        <div className="container">
          <form className="row g-2 align-items-end" onSubmit={handleSearch}>
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-secondary mb-1">Keyword</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="fa-solid fa-magnifying-glass text-secondary"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Job title or company…"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold text-secondary mb-1">Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="Cairo, Egypt"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold text-secondary mb-1">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="col-md-2">
              <button type="submit" className="btn bg-main-color text-white w-100 fw-semibold">
                Search jobs
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Main Layout ──────────────────────────────────────── */}
      <div className="container py-4">
        <div className="row g-4">

          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="filters-panel">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Filters</h6>
                <button className="btn btn-link btn-sm text-decoration-none main-color p-0 fw-semibold" onClick={clearAll}>
                  Clear all
                </button>
              </div>

              {/* Job Type */}
              <div className="filter-section mb-3">
                <p className="fw-semibold small mb-2">Job type</p>
                {TYPE_OPTIONS.map((t) => (
                  <div key={t} className="form-check d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center">
                      <input
                        className="form-check-input jobs-checkbox"
                        type="checkbox"
                        id={`type-${t}`}
                        checked={jobTypes.includes(t)}
                        onChange={() => toggle(t, jobTypes, setJobTypes)}
                      />
                      <label className="form-check-label small ms-2" htmlFor={`type-${t}`}>{t}</label>
                    </div>
                    <span className="text-muted small">{countField(t, "type")}</span>
                  </div>
                ))}
              </div>

              {/* Work Mode */}
              <div className="filter-section mb-3">
                <p className="fw-semibold small mb-2">Work mode</p>
                {WORK_OPTIONS.map((m) => (
                  <div key={m} className="form-check d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center">
                      <input
                        className="form-check-input jobs-checkbox"
                        type="checkbox"
                        id={`mode-${m}`}
                        checked={workModes.includes(m)}
                        onChange={() => toggle(m, workModes, setWorkModes)}
                      />
                      <label className="form-check-label small ms-2" htmlFor={`mode-${m}`}>{m}</label>
                    </div>
                    <span className="text-muted small">{countField(m, "workMode")}</span>
                  </div>
                ))}
              </div>

              {/* Experience */}
              <div className="filter-section mb-3">
                <p className="fw-semibold small mb-2">Experience</p>
                {EXP_OPTIONS.map((e) => (
                  <div key={e} className="form-check d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center">
                      <input
                        className="form-check-input jobs-checkbox"
                        type="checkbox"
                        id={`exp-${e}`}
                        checked={experiences.includes(e)}
                        onChange={() => toggle(e, experiences, setExperiences)}
                      />
                      <label className="form-check-label small ms-2" htmlFor={`exp-${e}`}>{e}</label>
                    </div>
                    <span className="text-muted small">
                      {ALL_JOBS.filter((j) => j.experienceLevel?.toLowerCase().includes(e.split("-")[0].toLowerCase())).length}
                    </span>
                  </div>
                ))}
              </div>

              {/* Salary Slider */}
              <div className="filter-section mb-3">
                <p className="fw-semibold small mb-2">Monthly salary (USD)</p>
                <input
                  type="range"
                  className="form-range jobs-range"
                  min={300} max={2000} step={50}
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(Number(e.target.value))}
                />
                <small className="text-muted">$300 – ${salaryRange.toLocaleString()} / month</small>
              </div>

              {/* Date Posted */}
              <div className="filter-section">
                <p className="fw-semibold small mb-2">Date posted</p>
                {[
                  { val: "any", label: "Any time" },
                  { val: "24h", label: "Past 24 hours" },
                  { val: "7d",  label: "Past 7 days"  },
                  { val: "30d", label: "Past 30 days" },
                ].map(({ val, label }) => (
                  <div key={val} className="form-check mb-1">
                    <input
                      className="form-check-input jobs-checkbox"
                      type="checkbox"
                      id={`date-${val}`}
                      checked={datePosted === val}
                      onChange={() => setDatePosted(val)}
                    />
                    <label className="form-check-label small ms-2" htmlFor={`date-${val}`}>{label}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="col-lg-9">
            {/* Header row */}
            <div className="d-flex flex-wrap justify-content-between align-items-start mb-3 gap-2">
              <div>
                <h5 className="fw-bold mb-1">{jobs.length.toLocaleString()} jobs found</h5>
                {activeTags.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {activeTags.map((tag) => (
                      <span key={tag.key} className="badge jobs-filter-tag d-flex align-items-center gap-1">
                        {tag.label}
                        <button
                          className="btn-close jobs-tag-close"
                          style={{ width: ".55rem", height: ".55rem" }}
                          onClick={() => removeTag(tag)}
                          aria-label="Remove"
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <select
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
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
              {pagedJobs.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fa-solid fa-briefcase fa-3x mb-3 d-block"></i>
                  No jobs match your filters. Try adjusting them.
                </div>
              ) : (
                pagedJobs.map((job) => {
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
                })
              )}
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
      </div>
    </div>
  );
}
