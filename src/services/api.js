const BASE = "http://localhost:3001";
const USER_ID = 1; // current logged-in user

export const api = {
  getUser: () => fetch(`${BASE}/users/${USER_ID}`).then(r => r.json()),
  updateUser: (data) => fetch(`${BASE}/users/${USER_ID}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),

  getJobs: () => fetch(`${BASE}/jobs`).then(r => r.json()),
  getSavedJobs: () => fetch(`${BASE}/savedJobs?userId=${USER_ID}`).then(r => r.json()),
  removeSavedJob: (id) => fetch(`${BASE}/savedJobs/${id}`, { method: "DELETE" }),
  saveJob: (jobId) => fetch(`${BASE}/savedJobs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: USER_ID, jobId, savedAt: new Date().toISOString() }) }).then(r => r.json()),

  getApplications: () => fetch(`${BASE}/applications?userId=${USER_ID}`).then(r => r.json()),
  addApplication: (data) => fetch(`${BASE}/applications`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
  updateApplication: (id, data) => fetch(`${BASE}/applications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json()),
};
