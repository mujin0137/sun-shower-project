import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const CalendarMonth = () => {
  // 현재 날짜를 기본값으로 설정
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 0-11을 1-12로 변환

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  // 현재 달의 첫 날과 마지막 날
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const prevMonthLastDate = new Date(year, month - 1, 0).getDate();

  // 캘린더 날짜 배열 생성
  const calendarDays: Array<{ date: number; isCurrentMonth: boolean }> = [];

  // 이전 달 날짜
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      date: prevMonthLastDate - i,
      isCurrentMonth: false,
    });
  }

  // 현재 달 날짜
  for (let i = 1; i <= lastDate; i++) {
    calendarDays.push({
      date: i,
      isCurrentMonth: true,
    });
  }

  // 다음 달 일부 채우기
  const totalCells = Math.ceil(calendarDays.length / 7) * 7;
  const remainingCells = totalCells - calendarDays.length;
  for (let i = 0; i < remainingCells; i++) {
    calendarDays.push({
      date: i + 1,
      isCurrentMonth: false,
    });
  }

  // 주 단위로 자르기
  const weeks = [];
  const weekCount = totalCells / 7;
  for (let i = 0; i < weekCount; i++) {
    weeks.push(calendarDays.slice(i * 7, (i + 1) * 7));
  }

  const monthNames = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  return (
    <Box
      sx={{
        position: "relative",
        left: 0,
        width: "calc(100vw - 68px)",
        maxWidth: { xs: "450px", lg: "1525px" },
        height: "711.66px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        overflow: "hidden",
        boxSizing: "border-box",

        "@media (max-width:600px)": {
          position: "relative",
          width: "100vw",
          height: "calc(100vh - 70px)",
          maxWidth: "100vw",
          borderRadius: 0,
        },
      }}
    >
      {/* 🔹 상단 월 표시 + 네비게이션 (Main.tsx 스타일 동일) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: "20px",
          py: "16px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeft sx={{ color: "#333", fontSize: 28 }} />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#000",
            fontFamily: "RG",
          }}
        >
          {monthNames[month - 1]} / {year}
        </Typography>

        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRight sx={{ color: "#333", fontSize: 28 }} />
        </IconButton>
      </Box>

      {/* 🔹 요일 헤더 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          fontWeight: 600,
          fontSize: "14px",
          borderBottom: "1px solid #eee",
          py: 1,
        }}
      >
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <Box key={day}>{day}</Box>
        ))}
      </Box>

      {/* 🔹 날짜 영역 */}
      <Box
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridTemplateRows: `repeat(${weekCount}, 1fr)`,
        }}
      >
        {weeks.flat().map((day, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              padding: "6px 8px",
              color: day.isCurrentMonth ? "#000" : "#ccc",
              border: "1px solid #f0f0f0",
              boxSizing: "border-box",
              fontSize: "13px",
            }}
          >
            {day.date}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CalendarMonth;
