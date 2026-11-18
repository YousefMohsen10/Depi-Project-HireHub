import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ComingSoon from "./pages/ComingSoon";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* other pages are owned by teammates, add their routes here */}
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
}

export default App;
