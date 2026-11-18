import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";

function CountUp({ value }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const t = setTimeout(() => setN(value), 0);
      return () => clearTimeout(t);
    }
    const duration = 1200;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{n.toLocaleString("en-US")}+</>;
}

function Stats() {
  const { data, loading, error } = useFetch("/stats");

  if (error) return null;

  return (
    <section className="stats-section">
      <div className="container">
        <div className="row g-3">
          {(loading ? [1, 2, 3] : data).map((s, i) => (
            <div className="col-12 col-md-4" key={s.id ?? i}>
              <div className="stat-card">
                {loading ? (
                  <div className="placeholder-glow w-100">
                    <span className="placeholder col-6 mb-2"></span>
                    <span className="placeholder col-4"></span>
                  </div>
                ) : (
                  <>
                    <div className="stat-icon">
                      <i className={`fa-solid ${s.icon}`}></i>
                    </div>
                    <div>
                      <div className="stat-value">
                        <CountUp value={s.value} />
                      </div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
