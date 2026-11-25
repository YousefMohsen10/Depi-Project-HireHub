import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "../styles/candidatePortal.css";

function ApplyModal({ job, user, onClose, onSuccess }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(user ? user.fullName : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [phone, setPhone] = useState(user ? user.phone : "");
  const [portfolio, setPortfolio] = useState(user ? user.links.portfolio : "");
  const [resumeFile, setResumeFile] = useState(user && user.resume ? user.resume.fileName : "");
  const [uploadPct, setUploadPct] = useState(user && user.resume ? 100 : 0);
  const [isDrag, setIsDrag] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const timerRef = useRef();

  const stepNames = ["Personal Info", "Resume", "Cover Letter", "Review"];

  function pickFile(file) {
    if (!file) return;
    const name = file.name.toLowerCase();
    if (!name.endsWith(".pdf") && !name.endsWith(".docx")) {
      setError("Resume must be a PDF or DOCX file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Resume must be less than 10 MB.");
      return;
    }
    setError("");
    setResumeFile(file.name);
    setUploadPct(10);
    let pct = 10;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      pct = pct + 25;
      if (pct >= 100) {
        clearInterval(timerRef.current);
        setUploadPct(100);
      } else {
        setUploadPct(pct);
      }
    }, 80);
  }

  function nextFromStep1() {
    if (fullName.trim() === "" || phone.trim() === "") {
      setError("Please fill the required fields.");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setStep(2);
  }

  function nextFromStep2() {
    if (resumeFile === "" || uploadPct < 100) {
      setError("Upload a resume first.");
      return;
    }
    setError("");
    setStep(3);
  }

  function submit() {
    if (!agreed) {
      setError("Please agree to the terms first.");
      return;
    }
    setSubmitting(true);
    api
      .addApplication({
        userId: user ? user.id : 1,
        jobId: job.id,
        status: "Applied",
        appliedAt: new Date().toISOString(),
        fullName: fullName,
        email: email,
        phone: phone,
        portfolio: portfolio,
        resumeFileName: resumeFile,
        coverLetter: coverLetter,
        interview: null,
      })
      .then((created) => {
        onSuccess(created);
        setStep(5);
      })
      .catch(() => setError("Submit failed. Check json-server."))
      .finally(() => setSubmitting(false));
  }

  return (
    <div className="shell modal-root">
      <div className="backdrop">
        <div className="modal">
          <div className="modal-head">
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                {step === 5 ? "Application Sent!" : "Apply – " + job.title}
              </div>
              <div style={{ color: "#64748b", fontSize: "0.83rem" }}>{job.company} · {job.location}</div>
            </div>
            <button className="btn-close" onClick={onClose} />
          </div>

          {step <= 4 && (
            <div className="stepper">
              {stepNames.map((label, i) => {
                const number = i + 1;
                let status = "";
                if (step === number) status = "active";
                if (step > number) status = "done";
                return (
                  <div key={label} className={"step " + status}>
                    <span className="step-num">
                      {step > number ? <i className="fa-solid fa-check" style={{ fontSize: 10 }} /> : number}
                    </span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="modal-body">
            {error !== "" && <div className="alert-err">{error}</div>}

            {step === 1 && (
              <>
                <div>
                  <label className="lbl">Full name *</label>
                  <input className="inp" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="lbl">Email *</label>
                    <input className="inp" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="lbl">Phone *</label>
                    <input className="inp" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="lbl">Portfolio / LinkedIn</label>
                  <input className="inp" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://" />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div
                  className={isDrag ? "dropzone over" : "dropzone"}
                  onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
                  onDragLeave={() => setIsDrag(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDrag(false); pickFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileRef.current.click()}
                >
                  <i className="fa-solid fa-cloud-arrow-up fa-2x mb-2" style={{ color: "#0F766E" }} />
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Drag & drop your resume</div>
                  <div style={{ color: "#94a3b8", fontSize: "0.78rem", marginBottom: 10 }}>PDF or DOCX · Max 10 MB</div>
                  <button type="button" className="btn-out" onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}>
                    Choose file
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="d-none"
                    onChange={(e) => { pickFile(e.target.files[0]); e.target.value = ""; }}
                  />
                </div>

                {resumeFile !== "" && (
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.87rem" }}>{resumeFile}</div>
                        <div style={{ color: "#64748b", fontSize: "0.75rem" }}>
                          {uploadPct === 100 ? "Ready" : "Uploading " + uploadPct + "%"}
                        </div>
                      </div>
                      <button className="btn-link red" onClick={() => { setResumeFile(""); setUploadPct(0); }}>Remove</button>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className={uploadPct === 100 ? "progress-bar-fill done" : "progress-bar-fill"} style={{ width: uploadPct + "%" }} />
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <div className="d-flex justify-content-between align-items-center">
                  <label className="lbl mb-0">Cover letter (optional)</label>
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => setCoverLetter("Hi " + job.company + " team,\n\nI'm excited to apply for the " + job.title + " position and would love to contribute to your team.")}
                  >
                    Use template
                  </button>
                </div>
                <textarea
                  className="inp"
                  rows={6}
                  maxLength={1000}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Why are you a great fit?"
                />
                <div style={{ color: "#94a3b8", fontSize: "0.76rem", textAlign: "right" }}>{coverLetter.length} / 1000</div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="review-box">
                  <div className="rh"><span>Personal Info</span><button className="btn-link" onClick={() => setStep(1)}>Edit</button></div>
                  <div style={{ fontSize: "0.84rem", color: "#334155" }}>
                    <div><b>Name:</b> {fullName}</div>
                    <div><b>Email:</b> {email}</div>
                    <div><b>Phone:</b> {phone}</div>
                    {portfolio && <div><b>Link:</b> {portfolio}</div>}
                  </div>
                </div>
                <div className="review-box">
                  <div className="rh"><span>Resume</span><button className="btn-link" onClick={() => setStep(2)}>Change</button></div>
                  <div style={{ fontSize: "0.84rem" }}><i className="fa-regular fa-file-lines me-2" />{resumeFile}</div>
                </div>
                <div className="review-box">
                  <div className="rh"><span>Cover Letter</span><button className="btn-link" onClick={() => setStep(3)}>Edit</button></div>
                  <p style={{ fontSize: "0.84rem", color: coverLetter ? "#334155" : "#94a3b8", whiteSpace: "pre-line", margin: 0 }}>
                    {coverLetter || "None provided."}
                  </p>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => { setAgreed(e.target.checked); setError(""); }}
                  />
                  <label className="form-check-label" htmlFor="terms" style={{ fontSize: "0.84rem" }}>
                    I confirm these details are accurate and agree to HireHub's Terms & Privacy Policy.
                  </label>
                </div>
              </>
            )}

            {step === 5 && (
              <div className="text-center py-3">
                <div style={{ width: 60, height: 60, background: "#e6f7f4", color: "#0f766e", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", marginBottom: 14 }}>
                  <i className="fa-solid fa-check" />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Application submitted!</h3>
                <p style={{ color: "#64748b", maxWidth: 360, margin: "0 auto" }}>
                  Your application for <b>{job.title}</b> at <b>{job.company}</b> has been sent. Track it in My Applications.
                </p>
              </div>
            )}
          </div>

          <div className="modal-foot">
            {step === 1 && (
              <>
                <button className="btn-out" onClick={onClose}>Cancel</button>
                <button className="btn-blue" onClick={nextFromStep1}>Next: Resume →</button>
              </>
            )}
            {step === 2 && (
              <>
                <button className="btn-out" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-blue" onClick={nextFromStep2}>Next: Cover Letter →</button>
              </>
            )}
            {step === 3 && (
              <>
                <button className="btn-out" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-blue" onClick={() => setStep(4)}>Next: Review →</button>
              </>
            )}
            {step === 4 && (
              <>
                <button className="btn-out" onClick={() => setStep(3)} disabled={submitting}>← Back</button>
                <button className="btn-blue" onClick={submit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </>
            )}
            {step === 5 && (
              <>
                <button className="btn-out" onClick={onClose}>Close</button>
                <button className="btn-blue" onClick={() => { onClose(); navigate("/my-applications"); }}>
                  View My Applications
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyModal;