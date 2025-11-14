import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { CalendarOutletContext } from "./Calendar";
import { Box, Typography } from "@mui/material";
import ScheduleModal from "./ScheduleModal";
import ScheduleItem from "./ScheduleItem";
import {
  RestaurantRounded,
  LocalCafeRounded,
  HotelRounded,
  LocalMallRounded,
  LocalActivityRounded,
  TrainRounded,
} from "@mui/icons-material";
import "../CSS/calendarmonth.css";

interface Schedule {
  _id: string;
  userId: string;
  tripPlan: string;
  scheduleName: string;
  scheduleDate: string;
  startTime: string;
  endTime?: string;
  scheduleContent?: string;
  placeType?: string;
  placeName?: string;
  contact?: string;
  address?: string;
  createdAt: string;
}

// 여행일정에 따른 색상 매핑 함수
const getTripPlanColor = (tripPlan: string): string => {
  switch (tripPlan) {
    case "여행일정 1":
      return "#555396";
    case "여행일정 2":
      return "#63a465";
    case "여행일정 3":
      return "#FF9B4E";
    default:
      return "#63a465";
  }
};

// 장소 타입에 따른 아이콘 반환 함수
const getPlaceIcon = (placeType?: string) => {
  const iconStyle = { fontSize: "16px", color: "#000" };
  switch (placeType) {
    case "식당":
      return <RestaurantRounded sx={iconStyle} />;
    case "카페":
      return <LocalCafeRounded sx={iconStyle} />;
    case "숙소":
      return <HotelRounded sx={iconStyle} />;
    case "상가":
      return <LocalMallRounded sx={iconStyle} />;
    case "아케이드":
      return <LocalActivityRounded sx={iconStyle} />;
    case "교통":
      return <TrainRounded sx={iconStyle} />;
    default:
      return null;
  }
};

function MonthlyCalendar({
  onWeeksChange,
  currentDate,
  onDateSelect,
  onScheduleUpdate,
}: {
  onWeeksChange?: (weeks: number) => void;
  currentDate: Date;
  onDateSelect?: (date: string) => void;
  onScheduleUpdate?: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<
    Schedule | undefined
  >(undefined);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const prevMonthLastDate = new Date(year, month - 1, 0).getDate();

  // 일정 데이터 불러오기
  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const endDate = `${year}-${String(month).padStart(2, "0")}-${String(
        lastDate
      ).padStart(2, "0")}`;

      const response = await fetch(
        `http://${window.location.hostname}:5001/api/schedules?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (Array.isArray(data)) {
        setSchedules(data);
      } else if (data.schedules && Array.isArray(data.schedules)) {
        setSchedules(data.schedules);
      }
    } catch (error) {
      console.error("일정 불러오기 오류:", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  // 특정 날짜의 일정 가져오기
  const getSchedulesForDate = (date: number) => {
    const dateString = `${year}-${String(month).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;
    return schedules.filter((s) => s.scheduleDate === dateString);
  };

  // 날짜 클릭 핸들러 (빈 셀 클릭 시 새 일정 추가 모달 열기)
  const handleDateClick = (date: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    const dateString = `${year}-${String(month).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;
    setSelectedDate(dateString);
    if (onDateSelect) onDateSelect(dateString);

    // 빈 셀 클릭 시 새 일정 추가를 위한 모달 열기
    setSelectedSchedule(undefined); // 새 일정이므로 undefined
    setModalOpen(true);
  };

  // 일정 클릭 핸들러
  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setModalOpen(true);
  };

  // 모달 닫기
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSchedule(undefined);
    fetchSchedules();
    if (onScheduleUpdate) onScheduleUpdate();
  };

  const calendarDays: Array<{ date: number; isCurrentMonth: boolean }> = [];

  // 이전 달 날짜
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      date: prevMonthLastDate - i,
      isCurrentMonth: false,
    });
  }

  // 이번 달 날짜
  for (let i = 1; i <= lastDate; i++) {
    calendarDays.push({
      date: i,
      isCurrentMonth: true,
    });
  }

  // 다음 달 날짜로 채우기
  const totalCells = Math.ceil(calendarDays.length / 7) * 7;
  const remainingCells = totalCells - calendarDays.length;
  for (let i = 0; i < remainingCells; i++) {
    calendarDays.push({
      date: i + 1,
      isCurrentMonth: false,
    });
  }

  const weekCount = totalCells / 7;
  const weeks = [];
  for (let i = 0; i < weekCount; i++) {
    weeks.push(calendarDays.slice(i * 7, (i + 1) * 7));
  }

  // 부모로 주 수 전달
  useEffect(() => {
    if (onWeeksChange) onWeeksChange(weekCount);
  }, [weekCount, onWeeksChange]);

  return (
    <div className="monthly-calendar2">
      {/* 요일 헤더 */}
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

      {/* 날짜 본문 */}
      <div className="calendar-body">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-week">
            {week.map((day, dayIndex) => {
              const daySchedules = day.isCurrentMonth
                ? getSchedulesForDate(day.date)
                : [];
              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`calendar-cell2 ${
                    !day.isCurrentMonth ? "other-month" : ""
                  }`}
                  onClick={() => handleDateClick(day.date, day.isCurrentMonth)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="date-number">{day.date}</span>
                  {/* 일정 목록 표시 */}
                  <div
                    style={{
                      marginTop: "4px",
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: 0,
                      overflowY: "auto",
                      overflowX: "hidden",
                      paddingRight: "2px",
                      boxSizing: "border-box",
                    }}
                    className="schedule-list"
                  >
                    {daySchedules.map((schedule) => (
                      <ScheduleItem
                        key={schedule._id}
                        id={schedule._id}
                        scheduleName={schedule.scheduleName}
                        startTime={schedule.startTime}
                        endTime={schedule.endTime}
                        placeType={schedule.placeType}
                        tripPlan={schedule.tripPlan}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleScheduleClick(schedule);
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <ScheduleModal
        open={modalOpen}
        onClose={handleModalClose}
        initialDate={selectedDate || undefined}
        schedule={selectedSchedule || undefined}
        onSave={fetchSchedules}
      />
    </div>
  );
}

const CalendarMonth = () => {
  const { currentDate } = useOutletContext<CalendarOutletContext>(); // ✅ 부모로부터 날짜 받음
  const [calendarWeeks, setCalendarWeeks] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<
    Schedule | undefined
  >(undefined);

  // 선택한 날짜의 일정 목록
  const selectedDateSchedules = selectedDate
    ? schedules.filter((s) => s.scheduleDate === selectedDate)
    : [];

  // 날짜 표시 형식 (예: 2025년 1월 13일)
  const selectedDateDisplay = selectedDate
    ? `${new Date(selectedDate).getFullYear()}년 ${
        new Date(selectedDate).getMonth() + 1
      }월 ${new Date(selectedDate).getDate()}일`
    : "날짜를 선택하세요";

  // 일정 업데이트 시 다시 불러오기
  const handleScheduleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const lastDate = new Date(year, month, 0).getDate();
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-${String(
      lastDate
    ).padStart(2, "0")}`;

    try {
      const response = await fetch(
        `http://${window.location.hostname}:5001/api/schedules?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (Array.isArray(data)) {
        setSchedules(data);
      } else if (data.schedules && Array.isArray(data.schedules)) {
        setSchedules(data.schedules);
      }
    } catch (error) {
      console.error("일정 불러오기 오류:", error);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        left: 0,
        width: "100%",
        // width: "calc(100vw - 68px)",
        // maxWidth: { xs: "550px", lg: "1525px" },
        height: { xs: "100%", lg: "738px" },
        display: "flex",
        flexDirection: "column",
        // backgroundColor: "red",
        overflow: "hidden",
        boxSizing: "border-box",
        "@media (max-width:600px)": {
          width: "100%",
          height: "calc(100vh - 70px)",
          // maxWidth: "100vw",
          borderRadius: 0,
          justifyContent: "space-between",
        },
      }}
    >
      {/* 기존 상단 영역 제거 → Calendar.tsx가 제어 */}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: "8px", md: "10px" },
          flex: { md: "0 0 10%", lg: "0 0 100%" },
        }}
      >
        <Box
          sx={{
            height:
              calendarWeeks === 4
                ? { md: "475px", lg: "400px" }
                : calendarWeeks === 5
                ? { md: "575px", lg: "490px" }
                : { md: "655px", lg: "580px" },
            minWidth: "100%",
            transition: "height 0.2s ease",
            alignContent: "center",
            display: "flex",
          }}
        >
          <MonthlyCalendar
            onWeeksChange={setCalendarWeeks}
            currentDate={currentDate}
            onDateSelect={setSelectedDate}
            onScheduleUpdate={handleScheduleUpdate}
          />
        </Box>

        {/* Schedule Detail Box */}
        <Box
          sx={{
            width: "100%",
            height:
              calendarWeeks === 4
                ? { md: "275px", lg: "362px" }
                : calendarWeeks === 5
                ? { md: "195px", lg: "285px" }
                : { md: "105px", lg: "198px" },
            backgroundColor: "#fff",
            borderRadius: "10px",
            transition: "height 0.2s ease",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#000",
              display: "flex",
              fontFamily: "RG",
              paddingLeft: "30px",
              paddingTop: "6px",
            }}
          >
            {selectedDateDisplay}
          </Typography>
          <Box
            className="schedule-detail-box"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center",
              paddingTop: "1px",
              overflowY: "auto",
              maxHeight:
                calendarWeeks === 4
                  ? { md: "220px", lg: "362px" }
                  : calendarWeeks === 5
                  ? { md: "140px", lg: "285px" }
                  : { md: "50px", lg: "198px" },
              "&::-webkit-scrollbar": {
                display: "none",
              },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {selectedDateSchedules.length > 0 ? (
              selectedDateSchedules.map((schedule) => (
                <Box
                  key={schedule._id}
                  sx={{
                    width: "96%",

                    minHeight: "33px",
                    maxHeight: "33px",
                    display: "flex",
                    borderRadius: "5px",
                    flexDirection: "row",
                    border: "none",
                    overflow: "hidden",
                    backgroundColor: "#f5f5f5",
                    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
                    boxSizing: "border-box",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "10px",
                      height: "100%",
                      backgroundColor: getTripPlanColor(schedule.tripPlan),
                    }}
                  />
                  <Box
                    sx={{
                      width: "7%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "4px 30px",
                      boxSizing: "border-box",
                    }}
                  >
                    {schedule.startTime}
                  </Box>
                  <Box
                    sx={{
                      width: "55%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px 8px",
                      fontSize: "12px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      boxSizing: "border-box",
                    }}
                  >
                    {schedule.scheduleContent || schedule.scheduleName}
                  </Box>
                  <Box
                    sx={{
                      width: "10%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2px",
                      boxSizing: "border-box",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40px",
                        height: "100%",
                        backgroundColor: "#fff",
                        borderRadius: "20px",
                      }}
                    >
                      {getPlaceIcon(schedule.placeType)}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: "28%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px 8px",
                      fontSize: "11px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      boxSizing: "border-box",
                    }}
                  >
                    {schedule.address || schedule.placeName || "-"}
                  </Box>
                </Box>
              ))
            ) : (
              <Typography
                sx={{
                  color: "#999",
                  fontSize: "14px",
                  textAlign: "center",
                  paddingTop: "20px",
                }}
              >
                선택한 날짜에 일정이 없습니다
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarMonth;
