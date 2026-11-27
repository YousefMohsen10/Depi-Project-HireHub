import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Jobs.css";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/jobs")
      .then((response) => response.json())
      .then((data) => setJobs(data));
  }, []);

  function toggleSave(id) {
    setSavedJobs((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function timeAgo(dateStr) {
    const hrs = Math.floor((Date.now() - new Date(dateStr)) / 3_600_000);
    if (hrs < 1) return "Just now";
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return (
    <div className="jobs-page">
      <div className="container py-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h5 className="fw-bold mb-0">{jobs.length.toLocaleString()} jobs found</h5>
        </div>

        <div className="d-flex flex-column gap-3">
            {jobs.map((job) => {
              const isSaved = savedJobs.includes(job.id);
              return (
                <div key={job.id} className="job-card card border rounded-3 p-4 position-relative">
                  <button
                    className="btn p-0 position-absolute top-0 end-0 mt-3 me-3 bookmark-btn"
                    onClick={() => toggleSave(job.id)}
                    title={isSaved ? "Unsave" : "Save"}
                    aria-label={isSaved ? "Unsave job" : "Save job"}
                  >
                    <i className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark fs-5 ${isSaved ? "main-color" : "text-muted"}`} />
                  </button>

                  <div className="d-flex gap-3 align-items-start pe-4">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="job-company-logo rounded-circle"
                      width={48}
                      height={48}
                      onError={(e) => { e.currentTarget.src = `https://placehold.co/48x48?text=${job.company?.[0] || "?"}`; }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{job.title}</h6>
                      <p className="text-muted small mb-1">{job.company}</p>
                      <div className="d-flex flex-wrap gap-3 small text-muted mb-2">
                        <span><i className="fa-solid fa-location-dot me-1" />{job.location}</span>
                        <span><i className="fa-solid fa-dollar-sign me-1" />${(job.salaryMin ?? 0).toLocaleString()} – ${(job.salaryMax ?? 0).toLocaleString()} / month</span>
                      </div>
                      <div className="d-flex gap-2 flex-wrap">
                        <span className="badge jobs-badge-primary">{job.type}</span>
                        <span className="badge jobs-badge-secondary">{job.workMode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      Posted {timeAgo(job.postedAt)} · {job.applicants ?? 0} applicants
                    </small>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn p-0 bookmark-btn"
                        onClick={() => toggleSave(job.id)}
                        title={isSaved ? "Unsave" : "Save"}
                        aria-label={isSaved ? "Unsave job" : "Save job"}
                      >
                        <i className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark ${isSaved ? "main-color" : "text-muted"}`} />
                      </button>
                      <Link to={`/jobs/${job.id}`} className="btn bg-main-color text-white px-4 fw-semibold rounded-2 view-job-btn">
                        View job
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
