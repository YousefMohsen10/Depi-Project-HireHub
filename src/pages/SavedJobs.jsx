import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CandidateLayout from "../components/CandidateLayout";
import ApplyModal from "./ApplyModal";
import { api } from "../services/api";

const PAGE_SIZE = 6;

function formatSalary(job) {
  const min = job.salaryMin;
  const max = job.salaryMax;

  if (min == null && max == null) return "Competitive";

  const symbol = job.currency === "EGP" ? "EGP " : "$";
  const period = job.salaryPeriod || "month";

  if (min == null) return `Up to ${symbol}${max.toLocaleString()} / ${period}`;
  if (max == null) return `From ${symbol}${min.toLocaleString()} / ${period}`;

  return `${symbol}${min.toLocaleString()} – ${symbol}${max.toLocaleString()} / ${period}`;
}

function savedAgo(date) {
  const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Saved today";
  if (days === 1) return "Saved 1 day ago";
  return "Saved " + days + " days ago";
}

function SavedJobs() {
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState([]);
  const [jobs, setJobs] = useState({});
  const [appliedIds, setAppliedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [applyJob, setApplyJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.getUser(), api.getSavedJobs(), api.getJobs(), api.getApplications()])
      .then(([userData, savedData, jobsData, appsData]) => {
        setUser(userData);
        setSaved(savedData);
        const jobsById = {};
        jobsData.forEach((job) => {
          jobsById[job.id] = job;
        });
        setJobs(jobsById);
        setAppliedIds(appsData.map((app) => app.jobId));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load. Is json-server running?");
        setLoading(false);
      });
  }, []);

  function removeSaved(id) {
    api
      .removeSavedJob(id)
      .then(() => setSaved(saved.filter((item) => item.id !== id)))
      .catch(() => setError("Remove failed."));
  }

  function removeAll() {
    if (!window.confirm("Remove all saved jobs?")) return;
    Promise.all(saved.map((item) => api.removeSavedJob(item.id)))
      .then(() => setSaved([]))
      .catch(() => setError("Remove failed."));
  }

  let list = saved.map((item) => ({ ...item, job: jobs[item.jobId] })).filter((item) => item.job);

  if (search.trim() !== "") {
    const text = search.toLowerCase();
    list = list.filter((item) => item.job.title.toLowerCase().includes(text) || item.job.company.toLowerCase().includes(text));
  }

  list.sort((a, b) => {
    if (sort === "recent") return new Date(b.savedAt) - new Date(a.savedAt);
    if (sort === "oldest") return new Date(a.savedAt) - new Date(b.savedAt);
    if (sort === "salary") return (b.job.salaryMax || 0) - (a.job.salaryMax || 0);
    return a.job.title.localeCompare(b.job.title);
  });

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const currentPage = page > totalPages ? totalPages : page;
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = list.slice(start, start + PAGE_SIZE);

  return (
    <CandidateLayout user={user}>
      <h1>Saved jobs</h1>
      <p className="sub">A little inspiration for your next move. All your favourites, in one place.</p>

      {error && <div className="alert-err">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="lbl">Search saved jobs</label>
          <input
            className="inp"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Job title or company"
          />
        </div>
        <div className="col-md-6">
          <label className="lbl">Sort by</label>
          <select className="inp" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recent">Recently saved</option>
            <option value="oldest">Oldest saved</option>
            <option value="salary">Highest salary</option>
            <option value="title">Job title A–Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : saved.length === 0 ? (
        <div className="empty">
          <div className="empty-icon"><i className="fa-regular fa-bookmark" /></div>
          <h2 className="fs-5 fw-bold mb-2">Your shortlist starts here</h2>
          <p className="text-muted mb-3">Save the jobs you love and come back when you're ready to apply.</p>
          <button className="btn-blue" onClick={() => navigate("/jobs")}>Find jobs</button>
        </div>
      ) : list.length === 0 ? (
        <div className="empty">
          <div className="empty-icon"><i className="fa-solid fa-magnifying-glass" /></div>
          <h2 className="fs-5 fw-bold mb-2">No matches</h2>
          <button className="btn-out mt-2" onClick={() => setSearch("")}>Clear search</button>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{saved.length} saved jobs</span>
            <button className="btn-link" onClick={removeAll}>Remove all</button>
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
            {paginated.map((item) => (
              <div key={item.id} className="col">
                <div className="job-card h-100">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <img src={item.job.logo} alt={item.job.company} className="job-logo" />
                    <button className="btn-link" title="Remove from saved" onClick={() => removeSaved(item.id)}>
                      <i className="fa-solid fa-bookmark fs-5" />
                    </button>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 4 }}>{item.job.title}</div>
                  <div style={{ color: "#64748b", fontSize: "0.84rem", marginBottom: 10 }}>{item.job.company}</div>

                  <div style={{ fontSize: "0.82rem", color: "#475569", marginBottom: 10 }}>
                    <div><i className="fa-solid fa-location-dot me-2 text-muted" />{item.job.location}</div>
                    <div><i className="fa-solid fa-dollar-sign me-2 text-muted" />{formatSalary(item.job)}</div>
                  </div>

                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    <span className="pill type">{item.job.type}</span>
                    <span className="pill mode">{item.job.workMode}</span>
                  </div>

                  <div className="d-flex gap-2 mt-auto">
                    <button className="btn-out px-3" title="Remove from saved" onClick={() => removeSaved(item.id)}>
                      <i className="fa-regular fa-bookmark" />
                    </button>
                    {appliedIds.includes(item.job.id) ? (
                      <button className="btn-out flex-grow-1" style={{ color: "#0f766e", borderColor: "#a7f3d0" }} onClick={() => navigate("/my-applications")}>
                        <i className="fa-solid fa-check me-1" />Applied
                      </button>
                    ) : (
                      <button className="btn-blue flex-grow-1" onClick={() => setApplyJob(item.job)}>Apply</button>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center" style={{ fontSize: "0.76rem", color: "#94a3b8", marginTop: 10, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
                    <span>{savedAgo(item.savedAt)}</span>
                    <button className="btn-link" onClick={() => removeSaved(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pages">
              <button className="page-btn" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button key={number} className={currentPage === number ? "page-btn active" : "page-btn"} onClick={() => setPage(number)}>
                  {number}
                </button>
              ))}
              <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>›</button>
            </div>
          )}

          <div style={{ color: "#94a3b8", fontSize: "0.78rem", marginTop: 10 }}>
            Showing {start + 1}–{Math.min(start + PAGE_SIZE, list.length)} of {list.length} saved jobs
          </div>
        </>
      )}

      {applyJob && (
        <ApplyModal
          job={applyJob}
          user={user}
          onClose={() => setApplyJob(null)}
          onSuccess={(newApp) => setAppliedIds(appliedIds.concat(newApp.jobId))}
        />
      )}
    </CandidateLayout>
  );
}

export default SavedJobs;