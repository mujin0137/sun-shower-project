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
      <Box sx={{ 
        width:"100%",
        display: "flex",
        position:"relative",
        flexDirection:"row",
        backgroundColor:"#F5F5F5",
        alignContent:"center",
        paddingY:{xs:0, lg:5},
        paddingX:{xs:0, lg:10},
        boxSizing:"border-box",
        gap:3
        }}>
        <Aside />
        <Box component="main"
          sx={{ 
            flexGrow: 1,
            display:"flex",
            alignContent:"center"
            }}>
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
