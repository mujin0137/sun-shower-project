import React, { useState } from "react";
import { Box } from "@mui/material";
import "../CSS/main.css";

// 새로운 월간 캘린더 컴포넌트
function MonthlyCalendar({
  onWeeksChange,
}: {
  onWeeksChange?: (weeks: number) => void;
}) {
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
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0(일) ~ 6(토)
  const lastDate = new Date(year, month, 0).getDate(); // 현재 달의 마지막 날짜

  // 이전 달의 마지막 날짜
  const prevMonthLastDate = new Date(year, month - 1, 0).getDate();

  // 다음 달의 시작일
  const nextMonthStart = 1;

  // 캘린더 날짜 배열 생성
  const calendarDays: Array<{
    date: number;
    isCurrentMonth: boolean;
  }> = [];

  // 이전 달 날짜들 (회색)
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      date: prevMonthLastDate - i,
      isCurrentMonth: false,
    });
  }

  // 현재 달 날짜들
  for (let i = 1; i <= lastDate; i++) {
    calendarDays.push({
      date: i,
      isCurrentMonth: true,
    });
  }

  // 필요한 전체 칸 수 계산 (7의 배수로 맞추기)
  const totalCells = Math.ceil(calendarDays.length / 7) * 7;

  // 다음 달 날짜들 (7의 배수로 채우기)
  const remainingCells = totalCells - calendarDays.length;
  for (let i = 0; i < remainingCells; i++) {
    calendarDays.push({
      date: nextMonthStart + i,
      isCurrentMonth: false,
    });
  }

  // 동적으로 주 수 계산해서 나누기
  const weeks = [];
  const weekCount = totalCells / 7;
  for (let i = 0; i < weekCount; i++) {
    weeks.push(calendarDays.slice(i * 7, (i + 1) * 7));
  }

  // 주 수를 부모 컴포넌트에 전달
  React.useEffect(() => {
    if (onWeeksChange) {
      onWeeksChange(weekCount);
    }
  }, [weekCount, onWeeksChange]);

  // 월 이름 배열
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
    <div className="monthly-calendar">
      {/* 상단: 월 타이틀 + 네비게이션 */}
      <div className="calendar-title-bar">
        <h2 className="calendar-month-title">
          &nbsp; {monthNames[month - 1]} / {year}
        </h2>
        <div className="calendar-nav">
          <button className="nav-btn prev" onClick={handlePrevMonth}>
            &lt;
          </button>
          <button className="nav-btn next" onClick={handleNextMonth}>
            &gt;
          </button>
        </div>
      </div>

      {/* 헤더: 요일 */}
      <div className="calendar-header">
        {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
          <div
            key={day}
            className={`calendar-day-label ${
              index === 0 ? "sunday" : index === 6 ? "saturday" : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 본문: 날짜 */}
      <div className="calendar-body">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-week">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`calendar-cell ${
                  !day.isCurrentMonth ? "other-month" : ""
                }`}
              >
                <span className="date-number">{day.date}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const Main = () => {
  const [calendarWeeks, setCalendarWeeks] = useState(6);

  return (
    <Box
      className="page"
      sx={{
        display: "flex",
        gap: { xs: "10px", md: "15px", lg: "25px" },
        overflow: "hidden",
        width: "100%",
        maxHeight: {
          xs: "calc(100vh - 80px)",
          md: "calc(100vh - 100px)",
          lg: "auto",
        },
        justifyContent:"space-between"
      }}
    >
      {/* 왼쪽 영역 - 30% */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: "8px", md: "10px" },
          flex: { xs: "1", md: "0 0 30%" },
          minWidth: 0,
        }}
      >
        {/* 상단 스케줄 */}
        <Box
          sx={{
            width: "100%",
            height: { xs: "150px", md: "23%", lg: "227px" },
            backgroundColor: "red",
            borderRadius: "10px",
          }}
        >
          123123
        </Box>
        {/* 예약/체크리스트 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: "8px", md: "10px", lg: "20px" },
            flex: 1,
          }}
        >
          <Box
            sx={{
              flex: 1,
              backgroundColor: "blue",
              borderRadius: "10px",
            }}
          >
            456546
          </Box>
          <Box
            sx={{
              flex: 1,
              backgroundColor: "green",
              borderRadius: "10px",
            }}
          >
            789789
          </Box>
        </Box>
      </Box>

      {/* 오른쪽 영역 - 70% */}
      <Box
        sx={{
          display: { xs: "none", md: "flex",},
          flexDirection: "column",
          gap: { xs: "8px", md: "10px" },
          flex: { md: "0 0 65%", lg:"0 0 68%"},
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            height:
              calendarWeeks === 5
                ? { md: "565px", lg: "565px" }
                : { md: "655px", lg: "655px" },
            minWidth: "100%",
            transition: "height 0.2s ease",
          }}
        >
          <MonthlyCalendar onWeeksChange={setCalendarWeeks}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            height:
              calendarWeeks === 5
                ? { md: "185px", lg: "215px" }
                : { md: "105px", lg: "127px" },
            backgroundColor: "yellow",
            borderRadius: "10px",
            transition: "height 0.2s ease",
          }}
        >
          5928123213
        </Box>
      </Box>
    </Box>
  );
};

export default Main;
