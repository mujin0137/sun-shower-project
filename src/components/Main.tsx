import React from "react";
import "../CSS/main.css";

// table태그 달력 함수 추가 (컴포넌트 내부)
function CalendarTable({
  year,
  month,
  style,
}: {
  year: number;
  month: number;
  style?: React.CSSProperties;
}) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const weeks: (number | null)[][] = [];
  let current = 1 - firstDay;
  for (let i = 0; i < 6; i++) {
    const week: (number | null)[] = [];
    for (let d = 0; d < 7; d++, current++) {
      week.push(current > 0 && current <= lastDate ? current : null);
    }
    weeks.push(week);
  }
  return (
    <table className="calendar-table" style={style}>
      <thead>
        <tr>
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <th key={d}>{d}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, i) => (
          <tr key={i}>
            {week.map((date, j) => (
              <td key={j}>{date ? date : ""}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
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
        <div className="main-right-wrap">
          <CalendarTable year={2025} month={10} />
        </div>
        <div className="main-schedule-bottom">123</div>
      </div>
    </section>
  );
};

export default Main;
