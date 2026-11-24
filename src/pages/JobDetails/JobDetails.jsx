import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import dbData from "../../../db/db.json";
import "./JobDetails.css";

const ALL_JOBS      = dbData.jobs;
const ALL_COMPANIES = dbData.companies;

export default function JobDetails() {
  const { id }     = useParams();
  const [saved, setSaved] = useState(false);
  const [savedSimilar, setSavedSimilar] = useState([]);

  // ── Find job + company ──────────────────────────────────────
  const job = useMemo(
    () => ALL_JOBS.find((j) => String(j.id) === String(id)) || null,
    [id]
  );

  const company = useMemo(
    () => (job ? ALL_COMPANIES.find((c) => c.id === job.companyId) || null : null),
    [job]
  );

  const similarJobs = useMemo(() => {
    if (!job) return [];
    return ALL_JOBS.filter(
      (j) => j.id !== job.id &&
        (j.category === job.category || j.companyId === job.companyId)
    ).slice(0, 3);
  }, [job]);

  // ── Helpers ──────────────────────────────────────────────────
  function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });
  }

  function timeAgo(dateStr) {
    const hrs = Math.floor((Date.now() - new Date(dateStr)) / 3_600_000);
    if (hrs < 1)  return "Just now";
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
    const d = Math.floor(hrs / 24);
    return `${d} day${d > 1 ? "s" : ""} ago`;
  }

  function jobIdLabel(j) {
    return `${j.company?.slice(0, 3).toUpperCase()}-${String(j.id).padStart(4, "0")}`;
  }

  function toggleSimilarSave(id) {
    setSavedSimilar((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // ── Not found ────────────────────────────────────────────────
  if (!job) {
    return (
      <div className="container py-5 text-center">
        <i className="fa-solid fa-briefcase fa-3x text-muted mb-3 d-block"></i>
        <h4 className="fw-bold">Job not found</h4>
        <p className="text-muted">This listing may have been removed or the link is incorrect.</p>
        <Link to="/jobs" className="btn bg-main-color text-white mt-2 px-4 fw-semibold">
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      {/* Breadcrumb */}
      <div className="container py-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 small">
            <li className="breadcrumb-item">
              <Link to="/jobs" className="text-decoration-none main-color">Find Jobs</Link>
            </li>
            {company && (
              <li className="breadcrumb-item">
                <Link to={`/companies/${company.id}`} className="text-decoration-none main-color">
                  {company.name}
                </Link>
              </li>
            )}
            <li className="breadcrumb-item active text-muted" aria-current="page">{job.title}</li>
          </ol>
        </nav>
      </div>

      <div className="container pb-5">

        {/* ── Header Card ─────────────────────────────────────── */}
        <div className="card border rounded-3 p-4 mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
            {/* Left: logo + title */}
            <div className="d-flex gap-3 align-items-center">
              <img
                src={job.logo}
                alt={job.company}
                className="jd-company-logo"
                width={64} height={64}
                onError={(e) => { e.target.src = `https://placehold.co/64x64?text=${job.company[0]}`; }}
              />
              <div>
                <h4 className="fw-bold mb-1">{job.title}</h4>
                <p className="text-muted mb-1">{job.company} · {job.location}</p>
                <p className="main-color fw-semibold mb-2">
                  ${job.salaryMin?.toLocaleString()} – ${job.salaryMax?.toLocaleString()} / month
                </p>
                <div className="d-flex gap-2 flex-wrap">
                  <span className="badge jd-badge-primary">{job.type}</span>
                  <span className="badge jd-badge-secondary">{job.workMode}</span>
                  <span className="badge jd-badge-secondary">{job.experienceLevel}</span>
                </div>
              </div>
            </div>

            {/* Right: CTA buttons */}
            <div className="d-flex flex-column gap-2">
              <button className="btn bg-main-color text-white px-4 fw-semibold">Apply Now</button>
              <button
                className={`btn fw-semibold ${saved ? "btn-save-active" : "btn-outline-secondary"}`}
                onClick={() => setSaved(!saved)}
              >
                <i className={`fa-${saved ? "solid" : "regular"} fa-bookmark me-1`}></i>
                {saved ? "Saved" : "Save job"}
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="mt-3 d-flex flex-wrap gap-2 text-muted small">
            <span>Posted {timeAgo(job.postedAt)}</span>
            <span>·</span>
            <span>{job.applicants} applicants</span>
            <span>·</span>
            <span>Job ID: {jobIdLabel(job)}</span>
          </div>
        </div>

        {/* ── Two-column layout ────────────────────────────────── */}
        <div className="row g-4">

          {/* Left: description */}
          <div className="col-lg-8">
            <div className="card border rounded-3 p-4 mb-4">

              <h5 className="fw-bold mb-2">Description</h5>
              <p className="text-secondary lh-lg">{job.description}</p>

              {job.responsibilities?.length > 0 && (
                <>
                  <h5 className="fw-bold mt-4 mb-2">Responsibilities</h5>
                  <ul className="jd-list">
                    {job.responsibilities.map((r, i) => <li key={i} className="mb-2 text-secondary">{r}</li>)}
                  </ul>
                </>
              )}

              {job.requirements?.length > 0 && (
                <>
                  <h5 className="fw-bold mt-4 mb-2">Requirements</h5>
                  <ul className="jd-list">
                    {job.requirements.map((r, i) => <li key={i} className="mb-2 text-secondary">{r}</li>)}
                  </ul>
                </>
              )}

              {job.benefits?.length > 0 && (
                <>
                  <h5 className="fw-bold mt-4 mb-2">Benefits</h5>
                  <ul className="jd-list">
                    {job.benefits.map((b, i) => <li key={i} className="mb-2 text-secondary">{b}</li>)}
                  </ul>
                </>
              )}

              {job.skills?.length > 0 && (
                <>
                  <h5 className="fw-bold mt-4 mb-2">Skills</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {job.skills.map((s, i) => (
                      <span key={i} className="badge jd-skill-badge">{s}</span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Similar jobs</h5>
                <div className="row g-3">
                  {similarJobs.map((sj) => {
                    const isSjSaved = savedSimilar.includes(sj.id);
                    return (
                      <div className="col-md-4" key={sj.id}>
                        <div className="card border rounded-3 p-3 h-100 similar-job-card">
                          {/* Header */}
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <img
                              src={sj.logo}
                              alt={sj.company}
                              width={36} height={36}
                              className="rounded-circle"
                              style={{ objectFit: "contain", border: "1px solid #e9ecef" }}
                              onError={(e) => { e.target.src = `https://placehold.co/36x36?text=${sj.company[0]}`; }}
                            />
                            <button
                              className="btn p-0 bookmark-btn"
                              onClick={() => toggleSimilarSave(sj.id)}
                            >
                              <i className={`fa-${isSjSaved ? "solid main-color" : "regular text-muted"} fa-bookmark`}></i>
                            </button>
                          </div>

                          <h6 className="fw-bold mb-1 small">{sj.title}</h6>
                          <p className="text-muted small mb-1">{sj.company}</p>
                          <div className="text-muted small mb-2">
                            <div><i className="fa-solid fa-location-dot me-1"></i>{sj.location}</div>
                            <div><i className="fa-solid fa-dollar-sign me-1"></i>${sj.salaryMin?.toLocaleString()} – ${sj.salaryMax?.toLocaleString()} / month</div>
                          </div>
                          <div className="d-flex gap-1 flex-wrap mb-3">
                            <span className="badge jd-badge-primary" style={{ fontSize: ".68rem" }}>{sj.type}</span>
                            <span className="badge jd-badge-secondary" style={{ fontSize: ".68rem" }}>{sj.workMode}</span>
                          </div>

                          {/* Footer */}
                          <div className="d-flex justify-content-between align-items-center mt-auto">
                            <div className="form-check mb-0">
                              <input
                                className="form-check-input jobs-checkbox"
                                type="checkbox"
                                id={`sj-cb-${sj.id}`}
                                checked={isSjSaved}
                                onChange={() => toggleSimilarSave(sj.id)}
                              />
                            </div>
                            <Link
                              to={`/jobs/${sj.id}`}
                              className="btn bg-main-color text-white btn-sm px-3 fw-semibold"
                            >
                              View job
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="col-lg-4">

            {/* Job Overview */}
            <div className="card border rounded-3 p-4 mb-4">
              <h6 className="fw-bold mb-3">Job overview</h6>
              <ul className="list-unstyled jd-overview-list">
                <li>
                  <span className="jd-overview-icon"><i className="fa-regular fa-calendar"></i></span>
                  <div>
                    <small className="text-muted d-block">Date posted</small>
                    <span className="fw-semibold small">{formatDate(job.postedAt)}</span>
                  </div>
                </li>
                <li>
                  <span className="jd-overview-icon"><i className="fa-regular fa-clock"></i></span>
                  <div>
                    <small className="text-muted d-block">Job type</small>
                    <span className="fw-semibold small">{job.type}</span>
                  </div>
                </li>
                <li>
                  <span className="jd-overview-icon"><i className="fa-solid fa-location-dot"></i></span>
                  <div>
                    <small className="text-muted d-block">Work mode</small>
                    <span className="fw-semibold small">{job.workMode} · {job.location}</span>
                  </div>
                </li>
                <li>
                  <span className="jd-overview-icon"><i className="fa-solid fa-layer-group"></i></span>
                  <div>
                    <small className="text-muted d-block">Experience</small>
                    <span className="fw-semibold small">{job.experienceLevel}</span>
                  </div>
                </li>
                <li>
                  <span className="jd-overview-icon"><i className="fa-solid fa-dollar-sign"></i></span>
                  <div>
                    <small className="text-muted d-block">Salary</small>
                    <span className="fw-semibold small">
                      ${job.salaryMin?.toLocaleString()} – ${job.salaryMax?.toLocaleString()} / month
                    </span>
                  </div>
                </li>
                <li>
                  <span className="jd-overview-icon"><i className="fa-regular fa-calendar-xmark"></i></span>
                  <div>
                    <small className="text-muted d-block">Apply before</small>
                    <span className="fw-semibold small">{formatDate(job.deadline)}</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* About the company */}
            {company && (
              <div className="card border rounded-3 p-4 mb-4">
                <h6 className="fw-bold mb-3">About the company</h6>
                <div className="d-flex gap-2 align-items-center mb-2">
                  <img
                    src={company.logo}
                    alt={company.name}
                    width={42} height={42}
                    className="rounded-circle"
                    style={{ objectFit: "contain", border: "1px solid #e9ecef" }}
                    onError={(e) => { e.target.src = `https://placehold.co/42x42?text=${company.name[0]}`; }}
                  />
                  <div>
                    <p className="fw-semibold mb-0 small">{company.name}</p>
                    <small className="text-muted">{company.openJobs} open positions</small>
                  </div>
                </div>
                <p className="text-secondary small mb-1">{company.about}</p>
                <p className="text-muted small mb-3">{company.industry} · {company.size}</p>
                <Link
                  to={`/companies/${company.id}`}
                  className="btn btn-outline-secondary w-100 fw-semibold btn-sm"
                >
                  View company
                </Link>
              </div>
            )}

            {/* Share */}
            <div className="card border rounded-3 p-4">
              <h6 className="fw-bold mb-1">Share this job</h6>
              <p className="text-muted small mb-3">Help someone find their next chapter.</p>
              <div className="d-flex gap-3">
                <a href="#" className="text-muted jd-share-icon"><i className="fa-brands fa-linkedin fs-5"></i></a>
                <a href="#" className="text-muted jd-share-icon"><i className="fa-brands fa-x-twitter fs-5"></i></a>
                <a href="#" className="text-muted jd-share-icon"><i className="fa-brands fa-facebook fs-5"></i></a>
                <a href="#" className="text-muted jd-share-icon"><i className="fa-solid fa-link fs-5"></i></a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
