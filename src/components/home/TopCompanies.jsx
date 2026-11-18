import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { companyLogos } from "../../companyLogos";

function TopCompanies() {
  const { data, loading, error } = useFetch("/companies?_sort=openJobs&_order=desc&_limit=8");

  return (
    <section className="home-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="section-title h3 mb-1">Top Companies Hiring</h2>
            <p className="section-sub mb-0">Companies with the most open roles right now.</p>
          </div>
          <Link to="/companies" className="view-all">View all</Link>
        </div>

        {error && <p className="text-danger">Could not load companies. Is json-server running?</p>}

        <div className="row g-3">
          {(loading ? Array.from({ length: 8 }) : data || []).map((c, i) => (
            <div className="col-6 col-md-4 col-lg-3" key={c?.id ?? i}>
              {loading ? (
                <div className="company-card placeholder-glow">
                  <span className="placeholder col-8"></span>
                </div>
              ) : (
                <Link to={`/companies/${c.id}`} className="company-card">
                  <span className="company-logo lg">
                      {companyLogos[c.name] ? (
                      <img src={companyLogos[c.name]} alt={`${c.name} logo`} />
                         ) : (
                             c.name.substring(0, 2).toUpperCase()
                               )}
                   </span>
                  <span className="company-name">{c.name}</span>
                  <span className="company-industry">{c.industry}</span>
                  <span className="badge-soft">{c.openJobs} open jobs</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopCompanies;
