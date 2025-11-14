import React, { useState, useEffect } from "react";
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
import "../CSS/main.css";

// API 베이스 URL 동적 설정
const API_BASE_URL = `http://${window.location.hostname}:5001`;

interface WeatherDetail {
  location: {
    name: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  weather: {
    main: string;
    description: string;
    icon: string;
    iconUrl: string;
  };
  temperature: {
    current: number;
    feelsLike: number;
    min: number;
    max: number;
  };
  details: {
    humidity: number;
    pressure: number;
    visibility: number;
    windSpeed: number;
    windDeg: number;
    clouds: number;
  };
  alert: string;
}

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
      return "#FF9B4E";
    case "여행일정 3":
      return "#63a465";
    default:
      return "#63a465"; // 기본값
  }
};

// 새로운 월간 캘린더 컴포넌트
function MonthlyCalendar({
  onWeeksChange,
  onDateSelect,
  onScheduleUpdate,
}: {
  onWeeksChange?: (weeks: number) => void;
  onDateSelect?: (
    year: number,
    month: number,
    date: number,
    schedules: Schedule[]
  ) => void;
  onScheduleUpdate?: (updatedSchedules: Schedule[]) => void;
}) {
  // 현재 날짜를 기본값으로 설정
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [currentSelectedDateStr, setCurrentSelectedDateStr] = useState<
    string | null
  >(null);

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

  // 일정 데이터 불러오기
  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      // 현재 월의 시작일과 종료일
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const endDate = `${year}-${String(month).padStart(2, "0")}-${String(
        lastDate
      ).padStart(2, "0")}`;

      const response = await fetch(
        `${API_BASE_URL}/api/schedules?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setSchedules(data.schedules);
        console.log("✅ 일정 불러오기 성공:", data.schedules);
        return data.schedules; // 불러온 일정 반환
      }
      return [];
    } catch (error) {
      console.error("❌ 일정 불러오기 오류:", error);
      return [];
    }
  };

  // 컴포넌트 마운트 시 및 월 변경 시 일정 불러오기
  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  // 특정 날짜의 일정 필터링
  const getSchedulesForDate = (date: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      date
    ).padStart(2, "0")}`;
    return schedules
      .filter((schedule) => schedule.scheduleDate === dateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // 날짜 클릭 핸들러 (새 일정 생성)
  const handleDateClick = (date: number, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
        date
      ).padStart(2, "0")}`;
      setSelectedDate(dateStr);
      setSelectedSchedule(null); // 새 일정 생성 모드
      setModalOpen(true);
      setCurrentSelectedDateStr(dateStr); // 현재 선택된 날짜 저장

      // 부모 컴포넌트로 날짜와 해당 날짜의 일정들 전달
      if (onDateSelect) {
        const daySchedules = getSchedulesForDate(date);
        onDateSelect(year, month, date, daySchedules);
      }
    }
  };

  // 일정 클릭 핸들러 (기존 일정 수정)
  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setSelectedDate(null);
    setModalOpen(true);
    setCurrentSelectedDateStr(schedule.scheduleDate); // 현재 선택된 날짜 저장

    // 부모 컴포넌트로 날짜와 해당 날짜의 일정들 전달
    if (onDateSelect && schedule.scheduleDate) {
      const [scheduleYear, scheduleMonth, scheduleDate] = schedule.scheduleDate
        .split("-")
        .map(Number);
      const daySchedules = getSchedulesForDate(scheduleDate);
      onDateSelect(scheduleYear, scheduleMonth, scheduleDate, daySchedules);
    }
  };

  // 모달 닫기 핸들러 (일정 다시 불러오기)
  const handleModalClose = async () => {
    setModalOpen(false);
    setSelectedDate(null);
    setSelectedSchedule(null);

    // 일정 목록 갱신 후 선택된 날짜의 일정도 업데이트
    const updatedAllSchedules = await fetchSchedules();

    // 현재 선택된 날짜가 있으면 해당 날짜의 일정을 부모에게 즉시 전달
    if (currentSelectedDateStr && onScheduleUpdate && updatedAllSchedules) {
      const updatedSchedules = updatedAllSchedules
        .filter((s: Schedule) => s.scheduleDate === currentSelectedDateStr)
        .sort((a: Schedule, b: Schedule) =>
          a.startTime.localeCompare(b.startTime)
        );
      onScheduleUpdate(updatedSchedules);
    }
  };

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
            {week.map((day, dayIndex) => {
              const daySchedules = day.isCurrentMonth
                ? getSchedulesForDate(day.date)
                : [];
              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`calendar-cell ${
                    !day.isCurrentMonth ? "other-month" : ""
                  }`}
                  onClick={() => handleDateClick(day.date, day.isCurrentMonth)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="date-number">{day.date}</span>
                  {/* 일정 목록 표시 */}
                  <div className="schedule-list">
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

      {/* Schedule Modal */}
      <ScheduleModal
        open={modalOpen}
        onClose={handleModalClose}
        initialDate={selectedDate || undefined}
        schedule={selectedSchedule || undefined}
      />
    </div>
  );
}

const Main = () => {
  const [calendarWeeks, setCalendarWeeks] = useState(6);
  const [reservations, setReservations] = useState([
    { height: 60, text: "", color: "#a29bfe" },
  ]);
  const [checklistItems, setChecklistItems] = useState([
    { text: "", isChecked: false },
  ]);
  const [currentWeather, setCurrentWeather] = useState<WeatherDetail | null>(
    null
  );
  const [selectedDateDisplay, setSelectedDateDisplay] = useState<string>("");
  const [selectedDateSchedules, setSelectedDateSchedules] = useState<
    Schedule[]
  >([]);

  const colors = ["#a29bfe", "#ff6b6b", "#4ecdc4", "#ffd93d", "#06f79bff"];

  // 날짜 선택 핸들러
  const handleDateSelect = (
    year: number,
    month: number,
    date: number,
    schedules: Schedule[]
  ) => {
    setSelectedDateDisplay(`${month}월 ${date}일`);
    setSelectedDateSchedules(schedules);
  };

  // 일정 업데이트 핸들러 (수정/삭제 후)
  const handleScheduleUpdate = (updatedSchedules: Schedule[]) => {
    setSelectedDateSchedules(updatedSchedules);
  };

  // 장소 타입에 따른 아이콘 반환
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

  // 날씨 정보 가져오기
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `http://${window.location.hostname}:5001/api/weather/current?city=Seoul`
        );
        const data = await response.json();
        setCurrentWeather(data);
      } catch (error) {
        console.error("날씨 정보를 가져오는데 실패했습니다:", error);
      }
    };

    fetchWeather();
  }, []);

  const handleAddReservation = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newReservation = {
      height: 60,
      text: "",
      color: randomColor,
    };
    const updatedReservations = [...reservations, newReservation];
    setReservations(updatedReservations);
    localStorage.setItem("reservations", JSON.stringify(updatedReservations));
  };

  const handleAddChecklistItem = () => {
    const newItem = {
      text: "",
      isChecked: false,
    };
    const updatedItems = [...checklistItems, newItem];
    setChecklistItems(updatedItems);
    localStorage.setItem("checklistItems", JSON.stringify(updatedItems));
  };

  const handleChecklistTextChange = (index: number, newText: string) => {
    const updatedItems = [...checklistItems];
    updatedItems[index].text = newText;
    setChecklistItems(updatedItems);
    localStorage.setItem("checklistItems", JSON.stringify(updatedItems));
  };

  const handleChecklistToggle = (index: number) => {
    const updatedItems = [...checklistItems];
    updatedItems[index].isChecked = !updatedItems[index].isChecked;
    setChecklistItems(updatedItems);
    localStorage.setItem("checklistItems", JSON.stringify(updatedItems));
  };

  // 예약내역 개별 삭제
  const handleDeleteReservation = (index: number) => {
    const updatedReservations = reservations.filter((_, idx) => idx !== index);
    const finalReservations = updatedReservations.length === 0
      ? [{ height: 60, text: "", color: "#a29bfe" }]
      : updatedReservations;
    setReservations(finalReservations);
    localStorage.setItem("reservations", JSON.stringify(finalReservations));
  };

  // 체크리스트 개별 삭제
  const handleDeleteChecklistItem = (index: number) => {
    const updatedItems = checklistItems.filter((_, idx) => idx !== index);
    const finalItems = updatedItems.length === 0
      ? [{ text: "", isChecked: false }]
      : updatedItems;
    setChecklistItems(finalItems);
    localStorage.setItem("checklistItems", JSON.stringify(finalItems));
  };

  // 페이지 로드 시 저장된 데이터 불러오기
  useEffect(() => {
    const savedReservations = localStorage.getItem("reservations");
    const savedChecklistItems = localStorage.getItem("checklistItems");

    if (savedReservations) {
      try {
        setReservations(JSON.parse(savedReservations));
      } catch (error) {
        console.error("예약내역 불러오기 오류:", error);
      }
    }

    if (savedChecklistItems) {
      try {
        setChecklistItems(JSON.parse(savedChecklistItems));
      } catch (error) {
        console.error("체크리스트 불러오기 오류:", error);
      }
    }
  }, []);

  return (
    <Box
      className="page"
      sx={{
        // backgroundColor: "yellow",
        display: "flex",
        gap: { xs: "10px", md: "15px", lg: "25px" },
        overflow: "hidden",
        width: "100%",
        maxHeight: {
          xs: "calc(100vh - 80px)",
          md: "calc(100vh - 100px)",
          lg: "auto",
        },
        justifyContent: "space-between",
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
          height: "100%",
          maxHeight: "100%",
          overflow: "hidden",
        }}
      >
        {/* 상단 스케줄 */}
        <Box
          sx={{
            width: "100%",
            height: { xs: "220px", lg: "227px" },
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          {currentWeather ? (
            <Box sx={{ width: "100%", height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  // gap: "10px",
                }}
              >
                <Box
                  sx={{
                    // width: "73px",
                    // height: "84px",
                    // backgroundColor: "#f0f0f0",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    src={currentWeather.weather.iconUrl}
                    alt="weather icon"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    paddingTop: "28px",
                  }}
                >
                  <Box sx={{ fontSize: "24px", fontFamily: "RG" }}>
                    {currentWeather.temperature.current}°
                  </Box>
                  <Box sx={{ fontSize: "12px" }}>
                    습도: {currentWeather.details.humidity}%
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    backgroundColor: "#555396",
                    color: "#ffffff",
                    width: "40%",
                    padding: "1px 0 1px 0",
                    fontSize: "12px",
                    alignContent: "center",
                    textAlign: "center",
                    borderRadius: "20px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: "Bold",
                  }}
                >
                  {currentWeather.alert}
                </Typography>
                <Box
                  sx={{
                    textAlign: "center",
                    fontSize: "12px",
                    paddingBottom: "20px",
                    paddingTop: "5px",
                  }}
                >
                  최고 {currentWeather.temperature.max}° | 최저{" "}
                  {currentWeather.temperature.min}°
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "12px",
                  }}
                >
                  초미세먼지{" "}
                  <Typography
                    sx={{
                      width: "80%",
                      fontSize: "12px",
                      fontWeight: "Bold",
                      color: "#fff",
                      backgroundColor: "#63A465",
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "20px",
                    }}
                  >
                    좋음
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",

                    alignItems: "center",
                    fontSize: "12px",
                  }}
                >
                  미세먼지{" "}
                  <Typography
                    sx={{
                      width: "90%",
                      fontSize: "12px",
                      fontWeight: "Bold",
                      color: "#fff",
                      backgroundColor: "#63A465",
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "20px",
                    }}
                  >
                    좋음
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    alignItems: "center",
                    fontSize: "12px",
                  }}
                >
                  자외선{" "}
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: "Bold",
                      color: "#fff",
                      backgroundColor: "#FF7A00",
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "20px",
                      width: "100%",
                    }}
                  >
                    주의
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box>날씨 정보를 불러오는 중...</Box>
          )}
        </Box>
        {/* 예약/체크리스트 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: "8px", md: "10px", lg: "20px" },
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* 예약내역 */}
          <Box
            sx={{
              flex: 1,
              height: "100%",
              maxHeight: "555px",
              display: "flex",
              position: "relative",
              backgroundColor: "white",
              borderRadius: "10px",
              flexDirection: "column",
              p: "10px",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "black",
                fontWeight: 500,
                textAlign: "center",
                mb: "18px",
                mt: "23px",
                fontSize: 16,
                flexShrink: 0,
                fontFamily: "RG",
              }}
            >
              예약내역
            </Typography>
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: "scroll",
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                pb: "60px",
                pr: "6px",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                  borderRadius: "3px",
                },
              }}
            >
              {reservations.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    width: "100%",
                    height: `${item.height}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
                    fontWeight: 700,
                    fontSize: 12,
                    overflow: "hidden",
                    flexShrink: 0,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "11px",
                      height: "100%",
                      backgroundColor: item.color,
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                    },
                  }}
                >
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const updatedReservations = [...reservations];
                      updatedReservations[idx].text = e.target.value;
                      setReservations(updatedReservations);
                      localStorage.setItem("reservations", JSON.stringify(updatedReservations));
                    }}
                    placeholder="00:00 예약장소"
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      fontWeight: 700,
                      fontSize: 13,
                      textAlign: "center",
                      color: item.text ? "black" : "#aaa",
                      padding: "2px 4px",
                    }}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                  />
                  <Box
                    onClick={() => handleDeleteReservation(idx)}
                    sx={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      width: "18px",
                      height: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // backgroundColor: "#d32f2f",
                      color: "#ccc",
                      borderRadius: "50%",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#b71c1c",
                      },
                    }}
                  >
                    ×
                  </Box>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                flexShrink: 0,
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                pr: "10px",
                pl: "10px",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  right: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                  fontSize: "28px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                }}
                onClick={handleAddReservation}
              >
                +
              </Box>
            </Box>
          </Box>

          {/* 체크리스트 */}
          <Box
            sx={{
              flex: 1,
              height: "100%",
              maxHeight: "555px",
              display: "flex",
              position: "relative",
              backgroundColor: "#fff",
              borderRadius: "10px",
              flexDirection: "column",
              p: "12px",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "black",
                fontWeight: 500,
                textAlign: "center",
                mb: "19px",
                mt: "19px",
                fontSize: 16,
                flexShrink: 0,
                fontFamily: "RG",
              }}
            >
              체크리스트
            </Typography>

            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                pb: "60px",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                  borderRadius: "3px",
                },
              }}
            >
              {checklistItems.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "center", md: "flex-start" },
                    gap: "11px",
                    marginLeft: "20px",
                    marginRight: "20px",
                    width: "calc(100% - 40px)",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  <Box
                    onClick={() => handleChecklistToggle(idx)}
                    sx={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: item.isChecked ? "#555396" : "#ddd",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "0.2s",
                      flexShrink: 0,
                      marginLeft: "9px",
                    }}
                  >
                    {item.isChecked && (
                      <Box
                        component="span"
                        sx={{
                          width: "6px",
                          height: "10px",
                          borderRight: "2px solid white",
                          borderBottom: "2px solid white",
                          transform: "rotate(45deg) translate(-1px, -1.5px)",
                        }}
                      />
                    )}
                  </Box>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) =>
                      handleChecklistTextChange(idx, e.target.value)
                    }
                    placeholder="체크리스트"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      fontWeight: 600,
                      fontSize: "13px",
                      color: "black",
                      textAlign: window.innerWidth < 900 ? "center" : "left",
                    }}
                  />
                  <Box
                    onClick={() => handleDeleteChecklistItem(idx)}
                    sx={{
                      width: "18px",
                      height: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // backgroundColor: "#d32f2f",
                      color: "#ccc",
                      borderRadius: "50%",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      flexShrink: 0,
                      "&:hover": {
                        backgroundColor: "#b71c1c",
                      },
                    }}
                  >
                    ×
                  </Box>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                flexShrink: 0,
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                pr: "10px",
                pl: "10px",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  right: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                  fontSize: "28px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                }}
                onClick={handleAddChecklistItem}
              >
                +
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 오른쪽 영역 - 70% */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          gap: { xs: "8px", md: "10px" },
          flex: { md: "0 0 65%", lg: "0 0 68%" },
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            height:
              calendarWeeks === 4
                ? { md: "475px", lg: "475px" }
                : calendarWeeks === 5
                ? { md: "575px", lg: "575px" }
                : { md: "655px", lg: "655px" },
            minWidth: "100%",
            transition: "height 0.2s ease",
          }}
        >
          <MonthlyCalendar
            onWeeksChange={setCalendarWeeks}
            onDateSelect={handleDateSelect}
            onScheduleUpdate={handleScheduleUpdate}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            height:
              calendarWeeks === 4
                ? { md: "275px", lg: "305px" }
                : calendarWeeks === 5
                ? { md: "195px", lg: "205px" }
                : { md: "105px", lg: "127px" },
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
              // backgroundColor: "yellow",
            }}
          >
            {selectedDateDisplay || "날짜를 선택하세요"}
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
                  ? { md: "220px", lg: "250px" }
                  : calendarWeeks === 5
                  ? { md: "140px", lg: "150px" }
                  : { md: "50px", lg: "72px" },
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
                  }}
                >
                  <Box
                    sx={{
                      width: "10px",
                      height: "100%",
                      backgroundColor: getTripPlanColor(schedule.tripPlan),
                    }}
                  ></Box>
                  {/* 시작 시간 - 파란색 영역 (7%) */}

                  <Box
                    sx={{
                      width: "7%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: "600",
                      padding: "4px 2px",
                      boxSizing: "border-box",
                      // backgroundColor: "#fff",
                    }}
                  >
                    {schedule.startTime}
                  </Box>

                  {/* 일정 메모 - 초록색 영역 (55%) */}
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
                      // boxShadow: "0 4px 4px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {schedule.scheduleContent || schedule.scheduleName}
                  </Box>

                  {/* 아이콘 - 노란색 영역 (10%) */}
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

                  {/* 상세 주소 - 보라색 영역 (28%) */}
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
                      // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    {schedule.address || schedule.placeName || "-"}
                  </Box>
                </Box>
              ))
            ) : (
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#999",
                  paddingTop: "20px",
                }}
              >
                일정이 없습니다
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Main;
