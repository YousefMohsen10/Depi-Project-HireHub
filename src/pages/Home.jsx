import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import Categories from "../components/home/Categories";
import FeaturedJobs from "../components/home/FeaturedJobs";
import TopCompanies from "../components/home/TopCompanies";
import HowItWorks from "../components/home/HowItWorks";
import PostJobCta from "../components/home/PostJobCta";
import "./Home.css";

function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Categories />
      <FeaturedJobs />
      <TopCompanies />
      <HowItWorks />
      <PostJobCta />
    </>
  );
}

export default Home;
