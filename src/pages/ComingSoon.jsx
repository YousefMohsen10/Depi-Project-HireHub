import { Link } from "react-router-dom";

// placeholder until the teammate who owns the page adds it
function ComingSoon() {
  return (
    <div className="container text-center py-5 my-5">
      <i className="fa-regular fa-clock fs-1 main-color mb-3"></i>
      <h1 className="h3 fw-bold">This page is coming soon</h1>
      <p className="section-sub">It will be added by the team soon.</p>
      <Link to="/" className="btn btn-main px-4">Back to home</Link>
    </div>
  );
}

export default ComingSoon;
