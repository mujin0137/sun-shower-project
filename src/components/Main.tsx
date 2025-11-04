import React from "react";
import "../CSS/main.css";

// 새로운 월간 캘린더 컴포넌트
function MonthlyCalendar({ year, month }: { year: number; month: number }) {
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

  return (
    <div className="monthly-calendar">
      {/* 상단: 월 타이틀 + 네비게이션 */}
      <div className="calendar-title-bar">
        <h2 className="calendar-month-title">{month} OCT</h2>
        <div className="calendar-nav">
          <button className="nav-btn prev">&lt;</button>
          <button className="nav-btn next">&gt;</button>
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
  return (
    <section className="main page">
      <div className="main-left">
        <div className="main-schedule-top">123123</div>
        <div className="main-left-wrap">
          <div className="main-reservation">456546</div>
          <div className="main-checklist">789789</div>
        </div>
      </div>
      <div className="main-right">
        {/* <div className="main-right-wrap"> */}
        <MonthlyCalendar year={2025} month={3} />
        <div className="main-schedule-bottom"></div>
        {/* </div> */}
      </div>
    </section>
  );
};

export default Main;
