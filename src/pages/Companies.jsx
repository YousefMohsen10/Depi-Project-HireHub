import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Companies.css";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/companies")
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="companies-page py-5">
      <div className="container">
        {/* Header */}
        <p className="text-muted small mb-1">Discover your next workplace</p>
        <h2 className="fw-bold mb-1">
          Great companies. Better opportunities.
        </h2>
        <p className="text-muted mb-4">
          Explore top employers, discover their culture, and find a team where
          you belong.
        </p>

        {/* Results count */}
        <p className="mb-3 fw-semibold">
          {companies.length.toLocaleString()} companies
        </p>

        {/* Companies Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-teal" role="status" />
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-5 text-muted">No companies found.</div>
        ) : (
          <div className="row g-4">
            {companies.map((company) => (
              <div key={company.id} className="col-lg-4 col-md-6">
                <div className="card h-100 border shadow-sm company-card">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="company-logo me-3"
                      />
                      <div>
                        <h6 className="mb-0 fw-bold">{company.name}</h6>
                        <small className="text-muted">{company.openJobs} open positions</small>
                      </div>
                    </div>
                    <span className="badge industry-badge mb-2">
                      {company.industry}
                    </span>
                    <p className="text-muted small mb-1">
                      <i className="fa-solid fa-location-dot me-1 main-color"></i>
                      {company.location}
                    </p>
                    <p className="text-muted small mb-3">{company.tagline}</p>
                    <Link
                      to={`/companies/${company.id}`}
                      className="btn btn-sm bg-main-color text-white fw-semibold w-100"
                    >
                      View jobs
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Companies;
