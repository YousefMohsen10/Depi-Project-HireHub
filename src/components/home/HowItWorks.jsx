const steps = [
  { icon: "fa-user-pen", title: "Create your profile", text: "Add your skills, experience and resume in a few minutes." },
  { icon: "fa-magnifying-glass", title: "Find the right job", text: "Search and filter thousands of jobs that match your skills." },
  { icon: "fa-paper-plane", title: "Apply and get hired", text: "Send your application and track its status in one place." },
];

function HowItWorks() {
  return (
    <section className="home-section bg-soft">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title h3 mb-1">How It Works</h2>
          <p className="section-sub mb-0">Get hired in three simple steps.</p>
        </div>
        <div className="row g-4">
          {steps.map((s, i) => (
            <div className="col-12 col-md-4" key={s.title}>
              <div className="step-card">
                <span className="step-number">{i + 1}</span>
                <span className="category-icon mb-3">
                  <i className={`fa-solid ${s.icon}`}></i>
                </span>
                <h3 className="h5 fw-bold">{s.title}</h3>
                <p className="section-sub mb-0">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
