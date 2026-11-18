import { Link } from "react-router-dom";

function PostJobCta() {
  return (
    <section className="home-section pb-0">
      <div className="container">
        <div className="cta-banner">
          <div>
            <h2 className="h3 fw-bold mb-2">Hiring? Post a job in minutes</h2>
            <p className="mb-0 cta-text">Reach thousands of qualified candidates and find your next team member.</p>
          </div>
          <Link to="/admin/post-job" className="btn btn-light fw-bold px-4 cta-btn">
            Post a Job
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PostJobCta;
