import React from "react";
import "../CSS/mobilebar.css";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarMonthRounded,
  FreeCancellationRounded,
  ChecklistRounded,
  TuneRounded,
  HomeOutlined,
} from "@mui/icons-material";

const Mobilebar = () => {
  const location = useLocation();

  // 현재 경로에 따라 활성화 표시
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="mbarWrap">
      <ul className="mbar">
        <li className={isActive("/booking") ? "active" : ""}>
          <Link to="/booking">
            <FreeCancellationRounded />
            예약현황
          </Link>
        </li>
        <li className={isActive("/calendar") ? "active" : ""}>
          <Link to="/calendar">
            <CalendarMonthRounded />
            캘린더
          </Link>
        </li>
        <li className={isActive("/main") ? "active" : ""}>
          <Link to="/">
            <HomeOutlined />홈
          </Link>
        </li>
        <li className={isActive("/checklist") ? "active" : ""}>
          <Link to="/checklist">
            <ChecklistRounded />
            체크리스트
          </Link>
        </li>
        <li className={isActive("/setting") ? "active" : ""}>
          <Link to="/setting">
            <TuneRounded />
            설정
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Mobilebar;
