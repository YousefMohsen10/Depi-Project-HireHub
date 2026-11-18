import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { getJSON, sendJSON } from "../../api";
import JobCard from "../JobCard";

// TODO: replace with the logged-in user id from AuthContext (Youssef Mohsen)
const USER_ID = 1;

function FeaturedJobs() {
  const { data: jobs, loading, error } = useFetch("/jobs?featured=true&_sort=postedAt&_order=desc&_limit=6");
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    getJSON(`/savedJobs?userId=${USER_ID}`)
      .then(setSaved)
      .catch(() => {});
  }, []);

  const toggleSave = async (job) => {
    const existing = saved.find((s) => s.jobId === job.id);
    try {
      if (existing) {
        await sendJSON(`/savedJobs/${existing.id}`, "DELETE");
        setSaved((prev) => prev.filter((s) => s.id !== existing.id));
      } else {
        const created = await sendJSON("/savedJobs", "POST", {
          userId: USER_ID,
          jobId: job.id,
          savedAt: new Date().toISOString(),
        });
        setSaved((prev) => [...prev, created]);
      }
    } catch {
      // keep UI unchanged if the request fails
    }
  };

  return (
    <section className="home-section bg-soft">
      <div className="container">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="section-title h3 mb-1">Featured Jobs</h2>
            <p className="section-sub mb-0">Fresh opportunities picked for you.</p>
          </div>
          <Link to="/jobs" className="view-all">View all</Link>
        </div>

        {error && <p className="text-danger">Could not load jobs. Is json-server running?</p>}

        <div className="row g-4">
          {(loading ? Array.from({ length: 3 }) : jobs || []).map((job, i) => (
            <div className="col-12 col-md-6 col-lg-4" key={job?.id ?? i}>
              {loading ? (
                <div className="job-card placeholder-glow">
                  <span className="placeholder col-12 mb-2"></span>
                  <span className="placeholder col-8 mb-2"></span>
                  <span className="placeholder col-6"></span>
                </div>
              ) : (
                <JobCard
                  job={job}
                  saved={saved.some((s) => s.jobId === job.id)}
                  onToggleSave={toggleSave}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedJobs;
