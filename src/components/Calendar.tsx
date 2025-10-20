import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";
import "../CSS/calendar.css";

const Calendar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에 따라 선택된 탭 결정
  const getCurrentTab = () => {
    if (location.pathname.includes("/day")) return "/calendar/day";
    if (location.pathname.includes("/week")) return "/calendar/week";
    if (location.pathname.includes("/month")) return "/calendar/month";
    return "/calendar/day"; // 기본값
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={getCurrentTab()} onChange={handleTabChange}>
          <Tab label="일간" value="/calendar/day" />
          <Tab label="주간" value="/calendar/week" />
          <Tab label="월간" value="/calendar/month" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Calendar;
