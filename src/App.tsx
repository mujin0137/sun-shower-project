import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Aside from "./common/aside";
import Main from "./components/Main";
import Calendar from "./components/Calendar";
import CalendarDay from "./components/CalendarDay";
import CalendarWeek from "./components/CalendarWeek";
import CalendarMonth from "./components/CalendarMonth";
import Weather from "./components/Weather";
import Transportation from "./components/Transportation";
import "./App.css";

const AppContent = () => {
  const location = useLocation();
  const hideTabsPages = ["/weather", "/transportation"];
  const shouldHideTabs = hideTabsPages.includes(location.pathname);

  return (
    <div className="app-container">
      <div className={`trip-tabs-container ${shouldHideTabs ? "hidden" : ""}`}>
        <div className="trip-tab trip-tab-1">여행일정 1</div>
        <div className="trip-tab trip-tab-2">여행일정 2</div>
        <div className="trip-tab trip-tab-3">여행일정 3</div>
        <div className="add-button">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.21998 7.58001C0.459981 7.58001 -1.95205e-05 6.92001 -1.95205e-05 5.86001C-1.95205e-05 4.80001 0.459981 4.14001 1.21998 4.14001H4.23998L4.15998 1.60001C4.09998 0.320014 4.93998 1.38283e-05 5.93998 1.38283e-05C6.93998 1.38283e-05 7.67998 0.120013 7.75998 1.40001C7.79998 2.20001 7.83998 3.14001 7.83998 4.14001H10.6C11.38 4.14001 11.84 4.80001 11.84 5.86001C11.84 6.92001 11.38 7.58001 10.6 7.58001H7.81998L7.73998 10.48C7.69998 11.76 6.93998 11.88 5.93998 11.88C4.93998 11.88 4.05998 11.56 4.13998 10.28C4.17998 9.40001 4.21998 8.50001 4.23998 7.58001H1.21998Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
      <div className="main-container">
        <Aside />
        <main className="content-wrapper">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/calendar" element={<Calendar />}>
              <Route index element={<Navigate to="/calendar/day" replace />} />
              <Route path="day" element={<CalendarDay />} />
              <Route path="week" element={<CalendarWeek />} />
              <Route path="month" element={<CalendarMonth />} />
            </Route>
            <Route path="/weather" element={<Weather />} />
            <Route path="/transportation" element={<Transportation />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 보호된 라우트 */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
