import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ScheduleModal from "./ScheduleModal";
import "../CSS/calendarmonth.css";

const CalendarMonth = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // 현재 월의 날짜 정보 가져오기
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // 이번 달의 첫 날과 마지막 날
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 첫 날의 요일 (0: 일요일)
  const startDay = firstDay.getDay();

  // 이번 달의 총 날짜 수
  const daysInMonth = lastDay.getDate();

  // 달력 셀 생성
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null); // 빈 셀
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: "450px", lg: "1525px" },
        height: "711.66px",
        backgroundColor: "#fff",
        padding: 3,
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      {/* 헤더 */}
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
      >
        {year}년 {month + 1}월
      </Typography>

      {/* 요일 헤더 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          mb: 1,
        }}
      >
        {weekDays.map((day, idx) => (
          <Box
            key={idx}
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: idx === 0 ? "#FF6B6B" : idx === 6 ? "#4DABF7" : "#333",
              fontSize: 14,
            }}
          >
            {day}
          </Box>
        ))}
      </Box>

      {/* 날짜 그리드 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
        }}
      >
        {days.map((day, idx) => (
          <Box
            key={idx}
            onClick={() => day && setModalOpen(true)}
            sx={{
              aspectRatio: "1/1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              cursor: day ? "pointer" : "default",
              backgroundColor: day
                ? day === today.getDate()
                  ? "#E3F2FD"
                  : "#fff"
                : "transparent",
              "&:hover": {
                backgroundColor: day ? "rgba(0, 0, 0, 0.05)" : "transparent",
              },
              transition: "background-color 0.2s",
            }}
          >
            {day && (
              <Typography
                sx={{
                  fontWeight: day === today.getDate() ? "bold" : "normal",
                  color:
                    day === today.getDate()
                      ? "#1976d2"
                      : idx % 7 === 0
                      ? "#FF6B6B"
                      : idx % 7 === 6
                      ? "#4DABF7"
                      : "#333",
                }}
              >
                {day}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      {/* Schedule Modal */}
      <ScheduleModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};

export default CalendarMonth;
