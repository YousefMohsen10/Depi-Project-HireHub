import { useState } from "react";
import { useNavigate } from "react-router-dom";

const popular = ["Frontend Developer", "UI/UX Designer", "Remote", "Marketing", "Data Analyst"];

function Hero() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const goSearch = (params) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && q.set(k, v));
    navigate(`/jobs?${q.toString()}`);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    goSearch({ keyword: keyword.trim(), location: location.trim(), category });
  };

  return (
    <section className="hero">
      <div className="container text-center">
        <h1 className="hero-title">
          Find your next <span className="main-color">opportunity</span>
        </h1>
        <p className="hero-sub">
          Search thousands of jobs from top companies and start your career today.
        </p>

        <form className="hero-search" onSubmit={onSubmit} role="search">
          <label className="hero-field">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Job title or keyword"
              aria-label="Job title or keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </label>
          <label className="hero-field">
            <i className="fa-solid fa-location-dot"></i>
            <input
              type="text"
              placeholder="City or location"
              aria-label="City or location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>
          <label className="hero-field">
            <i className="fa-solid fa-layer-group"></i>
            <select
              aria-label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              <option value="tech">Technology</option>
              <option value="marketing">Marketing</option>
              <option value="design">Design</option>
              <option value="sales">Sales</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="support">Customer Support</option>
            </select>
          </label>
          <button type="submit" className="btn btn-main hero-btn">
            Search Jobs
          </button>
        </form>

        <div className="popular">
          <span className="popular-label">Popular searches:</span>
          {popular.map((p) => (
            <button
              type="button"
              key={p}
              className="tag-chip"
              onClick={() => goSearch({ keyword: p })}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
