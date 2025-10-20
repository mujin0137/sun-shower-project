import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Aside from "./common/aside";
import Main from "./components/Main";
import Calendar from "./components/Calendar";
import CalendarDay from "./components/CalendarDay";
import CalendarWeek from "./components/CalendarWeek";
import CalendarMonth from "./components/CalendarMonth";
import Weather from "./components/Weather";
import Transportation from "./components/Transportation";

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: "flex" }}>
        <Aside />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
