// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import AdminLoginPage from "./pages/AdminLoginPage";
// // import AdminDashboardPage from "./pages/AdminDashboardPage";
// // import StudentLoginPage from "./pages/StudentLoginPage";
// // import StudentDashboardPage from "./pages/StudentDashboardPage";
// // import FeedBackPage from "./pages/FeedBackPage";
// // import NavBarPage from "./pages/NavBarPage";
// // import ThankyouPage from "./pages/ThankyouPage";
// // import HomePage from "./pages/HomePage";
// // import TeacherRatingsPage from "./pages/TeacherRatingsPage"; // NEW
// import AdminLoginPage from "./Pages/AdminLoginPage";
// import AdminDashboardPage from "./Pages/AdminDashboardPage";
// import StudentLoginPage from "./Pages/StudentLoginPage";
// import StudentDashboardPage from "./Pages/StudentDashboardPage";
// import FeedBackPage from "./Pages/FeedBackPage";
// import NavBarPage from "./Pages/NavBarPage";
// import ThankyouPage from "./Pages/ThankyouPage";
// import HomePage from "./Pages/HomePage";
// import TeacherRatingsPage from "./Pages/TeacherRatingsPage";

// function App() {
//   return (
//     <Router>
//       <NavBarPage />
//       <div>
//         <Routes>
//           {/* Home */}
//           <Route path="/" element={<HomePage />} />

//           {/* Admin Routes */}
//           <Route path="/admin/login" element={<AdminLoginPage />} />
//           <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

//           {/* Student Routes */}
//           <Route path="/student/login" element={<StudentLoginPage />} />
//           <Route path="/student/dashboard" element={<StudentDashboardPage />} />
//           <Route path="/student/feedback" element={<FeedBackPage />} />

//           {/* Teacher Ratings Page */}
//           <Route path="/teachers" element={<TeacherRatingsPage />} />

//           {/* Thank You Page */}
//           <Route path="/thankyou" element={<ThankyouPage />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AdminLoginPage from "./Pages/AdminLoginPage";
import AdminDashboardPage from "./Pages/AdminDashboardPage";
import StudentLoginPage from "./Pages/StudentLoginPage";
import StudentDashboardPage from "./Pages/StudentDashboardPage";
import FeedBackPage from "./Pages/FeedBackPage";
import NavBarPage from "./Pages/NavBarPage";
import ThankyouPage from "./Pages/ThankyouPage";
import HomePage from "./Pages/HomePage";
import TeacherRatingsPage from "./Pages/TeacherRatingsPage";
import { useEffect } from "react";

// Layout wrapper to handle sidebar spacing dynamically
function LayoutWrapper({ children }) {
  const location = useLocation();

  // routes where sidebar should NOT appear
  const noSidebarRoutes = [
    "/admin/dashboard",
    "/student/dashboard",
    "/student/feedback",
    "/admin/login",
    "/student/login",
  ];

  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  // scroll to top when route changes (optional but nice touch)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <NavBarPage />
      {/* Add margin-left only when sidebar is visible */}
      <div className={`${showSidebar ? "md:ml-64" : ""} pt-0 p-0`}>
        {children}
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

          {/* Student Routes */}
          <Route path="/student/login" element={<StudentLoginPage />} />
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route path="/student/feedback" element={<FeedBackPage />} />

          {/* Teacher Ratings Page */}
          <Route path="/teachers" element={<TeacherRatingsPage />} />

          {/* Thank You Page */}
          <Route path="/thankyou" element={<ThankyouPage />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
