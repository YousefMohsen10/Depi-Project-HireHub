
import { useEffect, useRef, useState } from "react";
import CandidateLayout from "../components/CandidateLayout";
import { api } from "../services/api";

function getInitials(name = "") {
  return name.trim().split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("");
}

function EditProfile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [newSkill, setNewSkill] = useState("");
  const [expModal, setExpModal] = useState(false);
  const [eduModal, setEduModal] = useState(false);
  const [expItem, setExpItem] = useState(null);
  const [eduItem, setEduItem] = useState(null);
  const [isDrag, setIsDrag] = useState(false);
  const photoRef = useRef();
  const resumeRef = useRef();

  useEffect(() => {
  api.getUser()
    .then(u => {
      setUser(u);
      setForm(u);
    })
    .catch(() => {
      setMsg({
        type: "err",
        text: "Failed to load profile. Is json-server running?"
      });
    })
    .finally(() => setLoading(false));
}, []);
  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setMsg({ type: "", text: "" });
  }

  function setLink(field, value) {
    setForm(f => ({ ...f, links: { ...f.links, [field]: value } }));
  }

  function addSkill() {
    const s = newSkill.trim();
    if (!s || form.skills.includes(s)) return;
    set("skills", [...form.skills, s]);
    setNewSkill("");
  }

  function removeSkill(s) {
    set("skills", form.skills.filter(x => x !== s));
  }

  function handlePhoto(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setMsg({ type: "err", text: "Please upload an image." });
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    setMsg({ type: "err", text: "Image must be less than 5 MB." });
    return;
  }

  const reader = new FileReader();

  reader.onload = () => set("avatar", reader.result);
  reader.readAsDataURL(file);
}

  function handleResume(file) {
  if (!file) return;

  const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

  if (!allowedTypes.includes(file.type)) {
    setMsg({ type: "err", text: "Please upload a PDF or DOCX file." });
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    setMsg({ type: "err", text: "Resume must be less than 10 MB." });
    return;
  }

  set("resume", {
    fileName: file.name,
    sizeKB: Math.round(file.size / 1024),
    uploadedAt: new Date().toISOString()
  });
}

  async function handleSave(e) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) {
      return setMsg({ type: "err", text: "Full name and email are required." });
    }
    setSaving(true);
    try {
      const updated = await api.updateUser(form);
      setUser(updated);
      setMsg({ type: "ok", text: "Profile saved successfully!" });
    } catch {
      setMsg({ type: "err", text: "Save failed. Check json-server." });
    } finally {
      setSaving(false);
    }
  }


  function openAddExp() { setExpItem({ title: "", company: "", type: "Full-time", from: "", to: "", location: "", description: "" }); setExpModal(true); }
  function openEditExp(item) { setExpItem({ ...item }); setExpModal(true); }
  function saveExp() {
    if (!(expItem.title || "").trim() || !(expItem.company || "").trim()) return;
    const currentExperience = form.experience || [];
    const updated = expItem.id
      ? currentExperience.map(e => e.id === expItem.id ? expItem : e)
      : [{ ...expItem, id: Date.now() }, ...currentExperience];
    set("experience", updated);
    setExpModal(false);
  }
  function removeExp(id) { set("experience", (form.experience || []).filter(e => e.id !== id)); }


  function openAddEdu() { setEduItem({ degree: "", school: "", from: "", to: "", location: "" }); setEduModal(true); }
  function openEditEdu(item) { setEduItem({ ...item }); setEduModal(true); }
  function saveEdu() {
    if (!(eduItem.degree || "").trim() || !(eduItem.school || "").trim()) return;
    const currentEducation = form.education || [];
    const updated = eduItem.id
      ? currentEducation.map(e => e.id === eduItem.id ? eduItem : e)
      : [{ ...eduItem, id: Date.now() }, ...currentEducation];
    set("education", updated);
    setEduModal(false);
  }
  function removeEdu(id) { set("education", (form.education || []).filter(e => e.id !== id)); }

  if (loading) return <CandidateLayout user={null}><div className="card text-center py-5"><div className="spinner-border text-primary" /></div></CandidateLayout>;
  if (!form) return <CandidateLayout user={null}><div className="alert-err">{msg.text || "Failed to load profile. Please try again."}</div></CandidateLayout>;

  return (
    <CandidateLayout user={form}>
      <h1>Edit Profile</h1>
      <p className="sub">Keep your profile up to date to attract the right opportunities.</p>

      {msg.text && <div className={msg.type === "ok" ? "alert-ok" : "alert-err"}>{msg.text}</div>}

      <form onSubmit={handleSave}>
        {/*  Photo  */}
        <div className="card">
          <h2>Profile Photo</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="avatar lg">{form.avatar ? <img src={form.avatar} alt="avatar" /> : getInitials(form.fullName)}</div>
            <div>
              <button type="button" className="btn-out" onClick={() => photoRef.current.click()}>Upload photo</button>
              {form.avatar && <button type="button" className="btn-link red ms-2" onClick={() => set("avatar", null)}>Remove</button>}
              <div style={{ fontSize: "0.76rem", color: "#94a3b8", marginTop: 4 }}>JPG or PNG, max 5 MB</div>
              <input ref={photoRef} type="file" accept="image/*" className="d-none" onChange={e => { handlePhoto(e.target.files[0]); e.target.value = ""; }} />
            </div>
          </div>
        </div>

        {/*  Personal Info  */}
        <div className="card">
          <h2>Personal Information</h2>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="lbl">Full name *</label>
              <input className="inp" value={form.fullName || ""} onChange={e => set("fullName", e.target.value)} placeholder="Alex Morgan" />
            </div>
            <div className="col-md-6">
              <label className="lbl">Email *</label>
              <input className="inp" type="email" value={form.email || ""} onChange={e => set("email", e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="col-md-6">
              <label className="lbl">Phone</label>
              <input className="inp" value={form.phone || ""} onChange={e => set("phone", e.target.value)} placeholder="+20 100 123 4567" />
            </div>
            <div className="col-md-6">
              <label className="lbl">Location</label>
              <input className="inp" value={form.location || ""} onChange={e => set("location", e.target.value)} placeholder="Cairo, Egypt" />
            </div>
            <div className="col-12">
              <label className="lbl">Headline</label>
              <input className="inp" value={form.headline || ""} onChange={e => set("headline", e.target.value)} placeholder="Frontend Developer | React & TypeScript" />
            </div>
            <div className="col-12">
              <label className="lbl">About you</label>
              <textarea className="inp" rows={4} value={form.about || ""} onChange={e => set("about", e.target.value)} placeholder="Short bio..." />
              <div style={{ fontSize: "0.76rem", color: "#94a3b8" }}>{(form.about || "").length} / 1000</div>
            </div>
          </div>
        </div>

        {/*  Skills  */}
        <div className="card">
          <h2>Skills</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {(form.skills || []).map(s => (
              <span key={s} className="chip">{s}<button type="button" onClick={() => removeSkill(s)}>×</button></span>
            ))}
            {!form.skills?.length && <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>No skills yet.</span>}
          </div>
          <div className="d-flex gap-2">
            <input className="inp" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add a skill (e.g. React)" />
            <button type="button" className="btn-out" onClick={addSkill}>+ Add</button>
          </div>
        </div>

        {/* Experience */}
        <div className="card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Experience</h2>
            <button type="button" className="btn-link" onClick={openAddExp}>+ Add</button>
          </div>
          {(form.experience || []).map(e => (
            <div key={e.id} className="d-flex gap-3 pb-3 mb-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{e.title}</div>
                <div style={{ color: "#334155", fontSize: "0.85rem" }}>{e.company} · {e.type}</div>
                <div style={{ color: "#64748b", fontSize: "0.8rem" }}>{e.from} – {e.to || "Present"}{e.location ? ` · ${e.location}` : ""}</div>
                {e.description && <p style={{ fontSize: "0.84rem", color: "#475569", marginTop: 6 }}>{e.description}</p>}
                <div className="d-flex gap-2 mt-1">
                  <button type="button" className="btn-link" onClick={() => openEditExp(e)}>Edit</button>
                  <button type="button" className="btn-link red" onClick={() => removeExp(e.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          {!form.experience?.length && <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>No experience added yet.</p>}
          <button type="button" className="btn-out w-100" onClick={openAddExp}>+ Add experience</button>
        </div>

        {/*  Education  */}
        <div className="card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Education</h2>
            <button type="button" className="btn-link" onClick={openAddEdu}>+ Add</button>
          </div>
          {(form.education || []).map(e => (
            <div key={e.id} className="d-flex gap-3 pb-3 mb-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{e.degree}</div>
                <div style={{ color: "#334155", fontSize: "0.85rem" }}>{e.school}</div>
                <div style={{ color: "#64748b", fontSize: "0.8rem" }}>{e.from} – {e.to || "Present"}{e.location ? ` · ${e.location}` : ""}</div>
                <div className="d-flex gap-2 mt-1">
                  <button type="button" className="btn-link" onClick={() => openEditEdu(e)}>Edit</button>
                  <button type="button" className="btn-link red" onClick={() => removeEdu(e.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          {!form.education?.length && <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>No education added yet.</p>}
          <button type="button" className="btn-out w-100" onClick={openAddEdu}>+ Add education</button>
        </div>

        {/*  Resume */}
        <div className="card">
          <h2>Resume</h2>
          <div
            className={`dropzone ${isDrag ? "over" : ""}`}
            onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
            onDragLeave={() => setIsDrag(false)}
            onDrop={e => { e.preventDefault(); setIsDrag(false); handleResume(e.dataTransfer.files[0]); }}
            onClick={() => resumeRef.current.click()}
          >
            <i className="fa-solid fa-cloud-arrow-up fa-2x text-primary mb-2" />
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Drag & drop your resume here</div>
            <div style={{ color: "#94a3b8", fontSize: "0.78rem", marginBottom: 10 }}>PDF or DOCX · Max 10 MB</div>
            <button type="button" className="btn-out" onClick={e => { e.stopPropagation(); resumeRef.current.click(); }}>Browse files</button>
            <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" className="d-none" onChange={e => { handleResume(e.target.files[0]); e.target.value = ""; }} />
          </div>
          {form.resume && (
            <div className="d-flex align-items-center justify-content-between mt-3 p-3 rounded-3" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{form.resume.fileName}</div>
                <div style={{ color: "#64748b", fontSize: "0.76rem" }}>{form.resume.sizeKB} KB</div>
              </div>
              <button type="button" className="btn-link red" onClick={() => set("resume", null)}>Remove</button>
            </div>
          )}
        </div>

        {/*  Links */}
        <div className="card">
          <h2>Social Links</h2>
          <div className="d-flex flex-column gap-3">
            <div>
              <label className="lbl">LinkedIn</label>
              <input className="inp" type="url" value={form.links?.linkedin || ""} onChange={e => setLink("linkedin", e.target.value)} placeholder="https://linkedin.com/in/username" />
            </div>
            <div>
              <label className="lbl">Portfolio</label>
              <input className="inp" type="url" value={form.links?.portfolio || ""} onChange={e => setLink("portfolio", e.target.value)} placeholder="https://yoursite.dev" />
            </div>
            <div>
              <label className="lbl">GitHub</label>
              <input className="inp" type="url" value={form.links?.github || ""} onChange={e => setLink("github", e.target.value)} placeholder="https://github.com/username" />
            </div>
          </div>
        </div>

        {/*Save bar */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn-out" onClick={() => { setForm(user); setMsg({ type: "", text: "" }); }}>Cancel</button>
          <button type="submit" className="btn-blue" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
        </div>
      </form>

      {/* Experience Modal */}
      {expModal && expItem && (
        <div className="backdrop">
          <div className="modal" style={{ maxWidth: 520 }}>
            <div className="modal-head">
              <h3 style={{ fontWeight: 700, fontSize: "1rem", margin: 0 }}>{expItem.id ? "Edit experience" : "Add experience"}</h3>
              <button type="button" className="btn-close" onClick={() => setExpModal(false)} />
            </div>
            <div className="modal-body">
              <div><label className="lbl">Job title *</label><input className="inp" value={expItem.title} onChange={e => setExpItem(p => ({ ...p, title: e.target.value }))} placeholder="Frontend Developer" /></div>
              <div className="row g-3">
                <div className="col-7"><label className="lbl">Company *</label><input className="inp" value={expItem.company} onChange={e => setExpItem(p => ({ ...p, company: e.target.value }))} /></div>
                <div className="col-5">
                  <label className="lbl">Type</label>
                  <select className="inp" value={expItem.type} onChange={e => setExpItem(p => ({ ...p, type: e.target.value }))}>
                    <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
                  </select>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-6"><label className="lbl">Start</label><input className="inp" type="month" value={expItem.from} onChange={e => setExpItem(p => ({ ...p, from: e.target.value }))} /></div>
                <div className="col-6"><label className="lbl">End (blank = present)</label><input className="inp" type="month" value={expItem.to || ""} onChange={e => setExpItem(p => ({ ...p, to: e.target.value }))} /></div>
              </div>
              <div><label className="lbl">Location</label><input className="inp" value={expItem.location || ""} onChange={e => setExpItem(p => ({ ...p, location: e.target.value }))} /></div>
              <div><label className="lbl">Description</label><textarea className="inp" rows={3} value={expItem.description || ""} onChange={e => setExpItem(p => ({ ...p, description: e.target.value }))} /></div>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn-out" onClick={() => setExpModal(false)}>Cancel</button>
              <button type="button" className="btn-blue" onClick={saveExp}>{expItem.id ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {eduModal && eduItem && (
        <div className="backdrop">
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-head">
              <h3 style={{ fontWeight: 700, fontSize: "1rem", margin: 0 }}>{eduItem.id ? "Edit education" : "Add education"}</h3>
              <button type="button" className="btn-close" onClick={() => setEduModal(false)} />
            </div>
            <div className="modal-body">
              <div><label className="lbl">Degree *</label><input className="inp" value={eduItem.degree} onChange={e => setEduItem(p => ({ ...p, degree: e.target.value }))} placeholder="B.Sc. Computer Science" /></div>
              <div><label className="lbl">School *</label><input className="inp" value={eduItem.school} onChange={e => setEduItem(p => ({ ...p, school: e.target.value }))} /></div>
              <div className="row g-3">
                <div className="col-6"><label className="lbl">Start year</label><input className="inp" type="number" value={eduItem.from || ""} onChange={e => setEduItem(p => ({ ...p, from: e.target.value }))} placeholder="2019" /></div>
                <div className="col-6"><label className="lbl">End year</label><input className="inp" type="number" value={eduItem.to || ""} onChange={e => setEduItem(p => ({ ...p, to: e.target.value }))} placeholder="2023" /></div>
              </div>
              <div><label className="lbl">Location</label><input className="inp" value={eduItem.location || ""} onChange={e => setEduItem(p => ({ ...p, location: e.target.value }))} /></div>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn-out" onClick={() => setEduModal(false)}>Cancel</button>
              <button type="button" className="btn-blue" onClick={saveEdu}>{eduItem.id ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </CandidateLayout>
  );
}

export default EditProfile;
