import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Companies.css";

const ITEMS_PER_PAGE = 6;

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All Industries");
  const [location, setLocation] = useState("Egypt");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Most relevant");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/companies")
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Extract unique industries
  const industries = [
    "All Industries",
    ...new Set(companies.map((c) => c.industry)),
  ];

  const handleSearch = () => {
    let result = [...companies];
    if (search.trim()) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (industry !== "All Industries") {
      result = result.filter((c) => c.industry === industry);
    }
    setFiltered(result);
    setCurrentPage(1);
  };

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Most open jobs") return b.openJobs - a.openJobs;
    return 0; // Most relevant = default order
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

        {/* Search Bar */}
        <div className="card border-0 shadow-sm p-3 mb-4">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">
                Search companies
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Company name or keyword"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">
                Industry
              </label>
              <select
                className="form-select"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                {industries.map((ind) => (
                  <option key={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">
                Location
              </label>
              <select
                className="form-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option>Egypt</option>
                <option>Cairo</option>
                <option>Giza</option>
                <option>Alexandria</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn bg-main-color text-white w-100 fw-bold"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="mb-0 fw-semibold">
            {filtered.length.toLocaleString()} companies
          </p>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Sort:</span>
            <select
              className="form-select form-select-sm w-auto"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Most relevant</option>
              <option>Most open jobs</option>
            </select>
          </div>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-teal" role="status" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-5 text-muted">No companies found.</div>
        ) : (
          <div className="row g-4">
            {paginated.map((company) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4 gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              &laquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`btn btn-sm ${
                  p === currentPage
                    ? "bg-main-color text-white"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              &raquo;
            </button>
          </div>
        )}

        {/* Showing info */}
        <p className="text-muted small text-center mt-3">
          Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
          {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
          {filtered.length} companies
        </p>
      </div>
    </div>
  );
}

export default Companies;
