import { Link } from "react-router-dom";
import { companyLogos } from "../companyLogos";

function JobCard({ job, saved, onToggleSave }) {
  return (
    <article className="job-card">
      <div className="d-flex justify-content-between align-items-start">
        <span className="company-logo">
  {companyLogos[job.company] ? (
    <img src={companyLogos[job.company]} alt={`${job.company} logo`} />
  ) : (
    job.company.substring(0, 2).toUpperCase()
  )}
</span>
        <button
          type="button"
          className={`save-btn ${saved ? "saved" : ""}`}
          onClick={() => onToggleSave(job)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
        >
          <i className={`${saved ? "fa-solid" : "fa-regular"} fa-bookmark`}></i>
        </button>
      </div>

      <h3 className="job-title">{job.title}</h3>
      <div className="job-company">{job.company}</div>

      <ul className="job-meta list-unstyled">
        <li><i className="fa-solid fa-location-dot"></i> {job.location}</li>
        <li><i className="fa-solid fa-dollar-sign"></i> {job.salary}</li>
      </ul>

      <div className="d-flex gap-2 flex-wrap mb-3">
        <span className="badge-soft">{job.type}</span>
        <span className="badge-soft">{job.workMode}</span>
      </div>

      <Link to={`/jobs/${job.id}`} className="btn btn-main w-100">
        Apply
      </Link>
    </article>
  );
}

export default JobCard;
