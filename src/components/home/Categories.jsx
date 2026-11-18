import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

function Categories() {
  const { data, loading, error } = useFetch("/categories");

  return (
    <section className="home-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="section-title h3 mb-1">Popular Categories</h2>
            <p className="section-sub mb-0">Browse jobs by the field you care about.</p>
          </div>
          <Link to="/jobs" className="view-all">View all</Link>
        </div>

        {error && <p className="text-danger">Could not load categories. Is json-server running?</p>}

        <div className="row g-3">
          {(loading ? Array.from({ length: 8 }) : data || []).map((c, i) => (
            <div className="col-6 col-md-4 col-lg-3" key={c?.id ?? i}>
              {loading ? (
                <div className="category-card placeholder-glow">
                  <span className="placeholder col-8"></span>
                </div>
              ) : (
                <Link to={`/jobs?category=${c.slug}`} className="category-card">
                  <span className="category-icon">
                    <i className={`fa-solid ${c.icon}`}></i>
                  </span>
                  <span className="category-name">{c.name}</span>
                  <span className="category-count">{c.jobsCount.toLocaleString("en-US")} jobs</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
