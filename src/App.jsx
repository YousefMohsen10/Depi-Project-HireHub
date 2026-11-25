import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SavedJobs from "./pages/SavedJobs.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import EditProfile from "./pages/EditeProfile.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/profile" element={<EditProfile />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
