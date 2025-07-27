import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboardPage";
// import FeedBackPage from "./Pages/FeedBackPage";
// import NavBarPage from "./Pages/NavBarPage";
// import ThankyouPage from "./Pages/ThankyouPage";
import FeedBackPage from "./pages/FeedBackPage";
import NavBarPage from "./pages/NavBarPage";
import ThankyouPage from "./pages/ThankyouPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      {/* NavBar visible on all pages */}
      <NavBarPage />
      <div className=" ">
        <Routes>
          {/* Admin */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Public */}
          <Route path="/feedbackpage" element={<FeedBackPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/thankyou" element={<ThankyouPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
