import React, { useRef, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { CalendarOutletContext } from "./Calendar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import ScheduleModal from "./ScheduleModal";
import {
  RestaurantRounded,
  LocalCafeRounded,
  HotelRounded,
  LocalMallRounded,
  LocalActivityRounded,
  TrainRounded,
} from "@mui/icons-material";

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
  const iconStyle = { fontSize: "14px", color: "#000" };
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

const CalendarWeek = () => {
  // 부모(Calendar)로부터 날짜를 받아옵니다.
  const { currentDate } = useOutletContext<CalendarOutletContext>();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | undefined>(undefined);

  // ✅ 반응형 구분 (원본 그대로)
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1024px)");

  // ✅ 반응형 크기 (원본 그대로)
  const hourWidth = isMobile ? 45 : isTablet ? 60 : 80;
  const rowHeight = isMobile ? 110 : isTablet ? 80 : 90;
  const hourCount = 24;

  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  // ----- 변경된 부분: today 대신 부모에서 받은 currentDate 사용 -----
  const today = new Date(currentDate);
  const todayDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - todayDay);
  // ------------------------------------------------------------------

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  // 일정 데이터 불러오기 함수 (주 단위)
  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // 주의 시작일과 종료일 계산
      const startDate = weekDates[0];
      const endDate = weekDates[6];

      const startDateString = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, "0")}-${startDate.getDate().toString().padStart(2, "0")}`;
      const endDateString = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, "0")}-${endDate.getDate().toString().padStart(2, "0")}`;

      const response = await fetch(
        `http://${window.location.hostname}:5001/api/schedules?startDate=${startDateString}&endDate=${endDateString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("주간 일정 데이터:", data);
        if (Array.isArray(data)) {
          setSchedules(data);
        } else if (data.schedules && Array.isArray(data.schedules)) {
          setSchedules(data.schedules);
        } else {
          console.warn("일정 데이터를 찾을 수 없습니다:", data);
          setSchedules([]);
        }
      } else {
        setSchedules([]);
      }
    } catch (error) {
      console.error("주간 일정 불러오기 오류:", error);
      setSchedules([]);
    }
  };

  // 주가 바뀔 때마다 일정 불러오기
  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  // 시간을 분으로 변환
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // 일정의 위치와 너비 계산
  const getScheduleStyle = (schedule: Schedule) => {
    const startMinutes = timeToMinutes(schedule.startTime);
    const endMinutes = schedule.endTime
      ? timeToMinutes(schedule.endTime)
      : startMinutes + 60;

    const startHours = startMinutes / 60;
    const duration = (endMinutes - startMinutes) / 60;

    const left = startHours * hourWidth;
    const width = duration * hourWidth;

    return { left, width };
  };

  // 일정이 해당 요일에 속하는지 확인
  const getSchedulesForDay = (dayIndex: number) => {
    const targetDate = weekDates[dayIndex];
    const targetDateString = `${targetDate.getFullYear()}-${(targetDate.getMonth() + 1).toString().padStart(2, "0")}-${targetDate.getDate().toString().padStart(2, "0")}`;

    return schedules.filter((schedule) => schedule.scheduleDate === targetDateString);
  };

  // ✅ 스크롤 동기화 (원본 그대로)
  const handleScroll = () => {
    if (scrollRef.current && headerRef.current) {
      headerRef.current.scrollLeft = scrollRef.current.scrollLeft;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        width: "100%",
        boxSizing: "border-box",
        maxWidth: { xs: "500px", lg: "1526px" },
        backgroundColor: "white",
        flexDirection: "column",
        paddingTop: isMobile ? "5%" : "3%",
        margin: "0 auto",
        overflowX: "hidden", // ✅ 외부 가로 스크롤 완전 차단
        overflowY: "hidden",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      {/* ✅ 시간 헤더 (원본 그대로) */}
      <Box
        ref={headerRef}
        sx={{
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 2,
          backgroundColor: "#fff",
          pl: "70px", // 요일 열 너비만큼
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: `${hourCount * hourWidth}px`,
            transition: "width 0.2s ease",
          }}
        >
          {Array.from({ length: hourCount }, (_, hour) => (
            <Box
              key={hour}
              sx={{
                flex: `0 0 ${hourWidth}px`,
                textAlign: "center",
                py: 0.5,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontFamily="Pretendard"
                fontSize={isMobile ? 11 : 12}
              >
                {hour}:00
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ✅ 교차 덮개 (원본 그대로) */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 30, lg: 40 },
          left: 0,
          width: { xs: "99px", lg: "70px" },
          height: "28px",
          backgroundColor: "#fff",
          zIndex: 3,
        }}
      />

      {/* ✅ 본문 (원본 구조 유지) */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          position: "relative",
          fontFamily: "Pretendard",
          fontSize: 12,
          overflow: "hidden", // ✅ 부모는 절대 스크롤 안 생김
        }}
      >
        {/* ✅ 요일 고정 열 (원본 그대로) */}
        <Box
          sx={{
            position: "sticky",
            left: 0,
            top: 0,
            width: isMobile ? "75px" : "70px",
            zIndex: 4,
            px: isMobile ? 1.5 : 2,
            borderRight: "1px solid #ccc",
            backgroundColor: "#fff",
            flexShrink: 0,
          }}
        >
          {weekDates.map((date, di) => {
            const isToday =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear();

            return (
              <Box
                key={di}
                sx={{
                  height: rowHeight,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  color: isToday ? "#1976d2" : "#333",
                }}
              >
                <Typography fontSize={isMobile ? 13 : 12} fontWeight={600}>
                  {days[di]}
                </Typography>
                <Typography variant="caption" fontSize={isMobile ? 11 : 10}>
                  {`${date.getMonth() + 1}월 ${date.getDate()}일`}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* ✅ 시간 칸 (내부만 스크롤 가능) - 원본 그대로 */}
        <Box
          ref={scrollRef}
          onScroll={handleScroll}
          sx={{
            flex: 1,
            overflowX: "auto", // ✅ 내부에서만 스크롤
            overflowY: "hidden",
            scrollBehavior: "smooth",
            position: "relative",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box
            sx={{
              width: `${hourCount * hourWidth}px`,
              position: "relative",
              transition: "width 0.2s ease",
              zIndex: 1,
            }}
          >
            {/* ✅ 세로 구분선 (원본 그대로) */}
            {Array.from({ length: hourCount }, (_, i) => (
              <Box
                key={`vline-${i}`}
                sx={{
                  position: "absolute",
                  left: `${i * hourWidth}px`,
                  top: 0,
                  bottom: 0,
                  borderLeft: "1px dashed rgba(0,0,0,0.15)",
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* ✅ 요일 행 (원본 그대로) */}
            {days.map((_, di) => {
              const daySchedules = getSchedulesForDay(di);

              return (
                <Box
                  key={di}
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    height: rowHeight,
                    borderBottom:
                      di === days.length - 1 ? "none" : "1px dashed #ccc",
                  }}
                >
                  {Array.from({ length: hourCount }, (_, hour) => (
                    <Box
                      key={hour}
                      onClick={() => setModalOpen(true)}
                      sx={{
                        flex: `0 0 ${hourWidth}px`,
                        height: "100%",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.02)",
                        },
                      }}
                    />
                  ))}

                  {/* 일정 블록 렌더링 */}
                  {daySchedules.map((schedule) => {
                    const { left, width } = getScheduleStyle(schedule);
                    return (
                      <Box
                        key={schedule._id}
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setModalOpen(true);
                        }}
                        sx={{
                          position: "absolute",
                          left: `${left}px`,
                          width: `${width}px`,
                          height: "70%",
                          top: "15%",
                          display: "flex",
                          borderRadius: "5px",
                          overflow: "hidden",
                          backgroundColor: "#f5f5f5",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          cursor: "pointer",
                          zIndex: 2,
                          "&:hover": {
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.15)",
                          },
                        }}
                      >
                        {/* 왼쪽 색상 바 */}
                        <Box
                          sx={{
                            width: "6px",
                            height: "100%",
                            backgroundColor: getTripPlanColor(schedule.tripPlan),
                            flexShrink: 0,
                          }}
                        />

                        {/* 일정 내용 */}
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            padding: isMobile ? "2px 4px" : "4px 8px",
                            gap: isMobile ? "2px" : "4px",
                            overflow: "hidden",
                          }}
                        >
                          {/* 시작 시간 */}
                          <Typography
                            sx={{
                              fontSize: isMobile ? "9px" : "10px",
                              fontWeight: 600,
                              flexShrink: 0,
                              minWidth: isMobile ? "25px" : "30px",
                            }}
                          >
                            {schedule.startTime}
                          </Typography>

                          {/* 일정 메모 */}
                          <Typography
                            sx={{
                              fontSize: isMobile ? "9px" : "10px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: 1,
                            }}
                          >
                            {schedule.scheduleContent || schedule.scheduleName}
                          </Typography>

                          {/* 아이콘 */}
                          {!isMobile && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "20px",
                                height: "20px",
                                backgroundColor: "#fff",
                                borderRadius: "10px",
                                flexShrink: 0,
                              }}
                            >
                              {getPlaceIcon(schedule.placeType)}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* ✅ 양쪽 그라데이션 (원본 그대로) */}
      <Box
        sx={{
          position: "absolute",
          top: isMobile ? "4%" : "3%",
          left: isMobile ? "75px" : "70px",
          width: "50px",
          height: "97%",
          background:
            "linear-gradient(to right, rgba(255, 255, 255, 0.8), transparent)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: isMobile ? "4%" : "3%",
          right: 0,
          width: "50px",
          height: "97%",
          background:
            "linear-gradient(to left, rgba(255, 255, 255, 0.8), transparent)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSchedule(undefined);
        }}
        onSave={fetchSchedules}
        schedule={selectedSchedule}
      />
    </Box>
  );
};

export default CalendarWeek;
