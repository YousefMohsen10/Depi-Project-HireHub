import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./CompanyDetails.css";

function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3001/companies/${id}`).then((r) => r.json()),
      fetch(`http://localhost:3001/jobs?companyId=${id}`).then((r) => r.json()),
    ])
      .then(([companyData, jobsData]) => {
        setCompany(companyData);
        setJobs(jobsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: "#0f766e" }} />
      </div>
    );

  if (!company)
    return (
      <div className="text-center py-5 text-muted">Company not found.</div>
    );

  return (
    <div className="company-details-page">
      <div className="container pt-4 pb-2">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 small">
            <li className="breadcrumb-item">
              <Link to="/companies" className="text-decoration-none main-color">
                Companies
              </Link>
            </li>
            <li className="breadcrumb-item active">{company.name}</li>
          </ol>
        </nav>
      </div>

      <div className="cover-wrapper">
        <img src={company.cover} alt="cover" className="cover-img" />
      </div>

      <div className="container">
        <div className="company-header-card card border-0 shadow-sm p-4 mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
            <div className="d-flex align-items-center gap-3">
              <img
                src={company.logo}
                alt={company.name}
                className="company-header-logo"
              />
              <div>
                <h4 className="fw-bold mb-0">{company.name}</h4>
                <p className="text-muted mb-0 small">
                  {company.industry} &bull; {company.size}
                </p>
                <p className="text-muted mb-0 small">
                  <i className="fa-solid fa-location-dot me-1 main-color"></i>
                  {company.location} &bull;{" "}
                  <a
                    href={company.website}
                    className="main-color text-decoration-none"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {company.website.replace("https://", "")} ↗
                  </a>
                </p>
              </div>
            </div>
            <button className="btn btn-outline-success fw-semibold follow-btn">
              <i className="fa-solid fa-plus me-1"></i> Follow company
            </button>
          </div>

          <div className="tabs mt-4 border-bottom">
            {["about", "openJobs", "life"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "about"
                  ? "About"
                  : tab === "openJobs"
                  ? "Open Jobs"
                  : "Life at Company"}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "about" && (
          <div className="row g-4 mb-5">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4 mb-4">
                <h5 className="fw-bold mb-3">About {company.name}</h5>
                <p className="text-muted">{company.about}</p>
              </div>

              <div className="card border-0 shadow-sm p-4 mb-4">
                <div className="row text-center g-3">
                  <div className="col-4">
                    <h3 className="fw-bold main-color mb-0">{company.openJobs * 100 + 45}</h3>
                    <small className="text-muted">Open Jobs</small>
                  </div>
                  <div className="col-4">
                    <h3 className="fw-bold main-color mb-0">{company.countries}+</h3>
                    <small className="text-muted">Countries</small>
                  </div>
                  <div className="col-4">
                    <h3 className="fw-bold main-color mb-0">{company.founded}</h3>
                    <small className="text-muted">Founded</small>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Open jobs at {company.name}</h5>
                  <button
                    className="btn btn-link text-decoration-none main-color p-0 small fw-semibold"
                    onClick={() => setActiveTab("openJobs")}
                  >
                    View all {jobs.length}
                  </button>
                </div>
                <div className="row g-3">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="col-md-4">
                      <div className="card job-card border shadow-sm h-100 p-3">
                        <div className="d-flex align-items-center mb-2 gap-2">
                          <img
                            src={job.logo}
                            alt={job.company}
                            className="job-logo"
                          />
                          <small className="fw-semibold">{job.company}</small>
                        </div>
                        <h6 className="fw-bold mb-1">{job.title}</h6>
                        <small className="text-muted d-block mb-1">
                          <i className="fa-solid fa-location-dot me-1 main-color"></i>
                          {job.location}
                        </small>
                        <small className="text-muted d-block mb-2">
                          \${job.salaryMin}–\${job.salaryMax}/{job.salaryPeriod}
                        </small>
                        <div className="d-flex gap-1 mb-3 flex-wrap">
                          <span className="badge job-type-badge">{job.type}</span>
                          <span className="badge job-mode-badge">{job.workMode}</span>
                        </div>
                        <div className="d-flex gap-2 mt-auto">
                          <button className="btn btn-sm btn-outline-secondary flex-fill">
                            <i className="fa-regular fa-bookmark"></i>
                          </button>
                          <button className="btn btn-sm bg-main-color text-white flex-fill fw-semibold">
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {company.lifeAtCompany && (
                <div className="card border-0 shadow-sm p-4">
                  <h5 className="fw-bold mb-2">Life at {company.name}</h5>
                  <p className="text-muted small mb-3">
                    {company.lifeAtCompany.intro}
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {company.lifeAtCompany.perks.map((perk) => (
                      <span key={perk} className="perk-badge">
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4 sticky-sidebar">
                <h6 className="fw-bold mb-3">At a glance</h6>
                <div className="mb-3">
                  <small className="text-muted d-block">Industry</small>
                  <span className="fw-semibold">{company.industry}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Company size</small>
                  <span className="fw-semibold">{company.size}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Location</small>
                  <span className="fw-semibold">{company.location}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Founded</small>
                  <span className="fw-semibold">{company.founded}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Website</small>
                  <a
                    href={company.website}
                    className="main-color text-decoration-none fw-semibold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {company.website.replace("https://", "")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "openJobs" && (
          <div className="mb-5">
            <h5 className="fw-bold mb-4">
              {jobs.length} open positions at {company.name}
            </h5>
            <div className="row g-3">
              {jobs.map((job) => (
                <div key={job.id} className="col-12">
                  <div className="card border shadow-sm p-4 job-list-card">
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                      <div className="d-flex gap-3">
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="job-logo-lg"
                        />
                        <div>
                          <h6 className="fw-bold mb-1">{job.title}</h6>
                          <small className="text-muted d-block mb-1">
                            {job.company} &bull; {job.location}
                          </small>
                          <small className="text-muted d-block mb-2">
                            \${job.salaryMin}–\${job.salaryMax}/{job.salaryPeriod}
                          </small>
                          <div className="d-flex gap-2 flex-wrap">
                            <span className="badge job-type-badge">{job.type}</span>
                            <span className="badge job-mode-badge">{job.workMode}</span>
                            <span className="badge job-exp-badge">
                              {job.experienceLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        <button className="btn btn-outline-secondary btn-sm">
                          <i className="fa-regular fa-bookmark"></i>
                        </button>
                        <button className="btn bg-main-color text-white btn-sm fw-semibold px-4">
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "life" && company.lifeAtCompany && (
          <div className="mb-5">
            <div className="card border-0 shadow-sm p-5 text-center">
              <h5 className="fw-bold mb-3">Life at {company.name}</h5>
              <p className="text-muted mb-4">{company.lifeAtCompany.intro}</p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                {company.lifeAtCompany.perks.map((perk) => (
                  <div key={perk} className="perk-card">
                    <i className="fa-solid fa-check-circle main-color me-2"></i>
                    <span className="fw-semibold">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyDetails;
