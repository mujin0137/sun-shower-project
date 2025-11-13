import React, { useRef, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { CalendarOutletContext } from "./Calendar";
import Box from "@mui/material/Box";
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

const CalendarDay = () => {
  const { currentDate } = useOutletContext<CalendarOutletContext>(); // ✅ 부모로부터 날짜 받기

  const startHour = 0;
  const endHour = 23;
  const labelWidth = 60;
  const verticalLineOffset = 42;
  const verticalLineOffsetMobile = 40;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | undefined>(undefined);

  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => `${(i + startHour).toString().padStart(2, "0")}:00`
  );

  // 일정 데이터 불러오기 함수
  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const day = currentDate.getDate().toString().padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      const response = await fetch(
        `http://${window.location.hostname}:5001/api/schedules?date=${dateString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("일정 데이터:", data);
        // 응답 형태에 따라 처리
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
      console.error("일정 불러오기 오류:", error);
      setSchedules([]);
    }
  };

  // 일정 데이터 불러오기
  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [currentDate]); // ✅ 날짜 바뀔 때 스크롤 초기화

  // 디버깅: 일정 개수 확인
  useEffect(() => {
    console.log("현재 표시할 일정 개수:", schedules.length);
    console.log("일정 목록:", schedules);
  }, [schedules]);

  // 시간을 분으로 변환
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // 일정의 위치와 높이 계산
  const getScheduleStyle = (schedule: Schedule) => {
    const startMinutes = timeToMinutes(schedule.startTime);
    const endMinutes = schedule.endTime
      ? timeToMinutes(schedule.endTime)
      : startMinutes + 60; // 종료시간이 없으면 1시간으로 설정

    const startHours = startMinutes / 60;
    const duration = (endMinutes - startMinutes) / 60; // 시간 단위

    // 시간 라벨이 translateY(15px)로 아래로 이동되어 있으므로
    // 일정 블록도 15px 더 내려가야 시간 라인과 맞음
    const top = startHours * 45 + 32; // 각 시간 블록의 높이가 45px + 라벨 오프셋 32px
    const height = duration * 45;

    console.log(`일정 위치 계산:`, {
      scheduleName: schedule.scheduleName,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      startMinutes,
      endMinutes,
      startHours,
      duration,
      top,
      height,
    });

    return { top, height };
  };

  return (
    <Box
      sx={{
        position: "relative",
        left: 0,
        width: "100%",
        height: "711.66px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        overflow: "hidden",
        boxSizing: "border-box",
        "@media (max-width:600px)": {
          position: "relative",
          height: "calc(100vh - 70px)",
          maxWidth: "100vw",
          borderRadius: 0,
        },
      }}
    >
      {/* 🧾 스크롤 영역 */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          paddingBottom: "40px",
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        {/* 세로 기준선 */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            height: `calc(45px * ${hours.length} + 40px)`,
            left: `${labelWidth + verticalLineOffset}px`,
            borderLeft: "1px solid #ccc",
            zIndex: 1,
            "@media (max-width:600px)": {
              left: `${labelWidth + verticalLineOffsetMobile}px`,
            },
          }}
        />

        {/* 시간 라인 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {hours.map((time, idx) => (
            <Box
              key={idx}
              sx={{ display: "flex", alignItems: "center", height: 45 }}
            >
              {/* 시간 레이블 */}
              <Box
                sx={{
                  width: "70px",
                  textAlign: "center",
                  px: 2,
                  fontSize: 14,
                  color: "#000",
                  transform: "translateY(15px)",
                  "@media (max-width:600px)": {
                    width: "75px",
                    textAlign: "center",
                    px: 1.5,
                    fontSize: 13,
                  },
                }}
              >
                {time}
              </Box>

              {/* 가로선 */}
              <Box
                onClick={() => setModalOpen(true)}
                sx={{
                  flex: 1,
                  borderBottom: "1px dashed rgba(0,0,0,0.15)",
                  ml: `${verticalLineOffset - 40}px`,
                  minHeight: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.02)" },
                  "@media (max-width:600px)": {
                    ml: `${verticalLineOffsetMobile - 39}px`,
                  },
                }}
              />
            </Box>
          ))}
        </Box>

        {/* 일정 블록 렌더링 */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: `${labelWidth + verticalLineOffset}px`,
            right: 0,
            height: `calc(45px * ${hours.length})`,
            pointerEvents: "none",
            "@media (max-width:600px)": {
              left: `${labelWidth + verticalLineOffsetMobile}px`,
            },
          }}
        >
          {schedules.map((schedule) => {
            const { top, height } = getScheduleStyle(schedule);
            return (
              <Box
                key={schedule._id}
                onClick={() => {
                  setSelectedSchedule(schedule);
                  setModalOpen(true);
                }}
                sx={{
                  position: "absolute",
                  top: `${top}px`,
                  left: "10px",
                  width: "calc(100% - 20px)",
                  height: `${height}px`,
                  minHeight: "33px",
                  display: "flex",
                  borderRadius: "5px",
                  flexDirection: "row",
                  border: "none",
                  overflow: "hidden",
                  backgroundColor: "#f5f5f5",
                  boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
                  boxSizing: "border-box",
                  pointerEvents: "auto",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                {/* 왼쪽 색상 바 */}
                <Box
                  sx={{
                    width: "10px",
                    height: "100%",
                    backgroundColor: getTripPlanColor(schedule.tripPlan),
                  }}
                />

                {/* 시작 시간 */}
                <Box
                  sx={{
                    width: "15%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "4px 2px",
                    boxSizing: "border-box",
                  }}
                >
                  {schedule.startTime}
                </Box>

                {/* 일정 메모 */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px 8px",
                    fontSize: "12px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: height < 45 ? "nowrap" : "normal",
                    boxSizing: "border-box",
                  }}
                >
                  {schedule.scheduleContent || schedule.scheduleName}
                </Box>

                {/* 아이콘 */}
                <Box
                  sx={{
                    width: "50px",
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
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#fff",
                      borderRadius: "15px",
                    }}
                  >
                    {getPlaceIcon(schedule.placeType)}
                  </Box>
                </Box>

                {/* 상세 주소 */}
                <Box
                  sx={{
                    width: "25%",
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
                  {schedule.placeName || schedule.address || ""}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* 🌫 상단 그라데이션 */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 40,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))",
          zIndex: 10,
          pointerEvents: "none",
          "@media (max-width:600px)": { height: 80 },
        }}
      />

      {/* 🌫 하단 그라데이션 */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 40,
          background:
            "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
          zIndex: 10,
          pointerEvents: "none",
          "@media (max-width:600px)": { height: 80 },
        }}
      />

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

export default CalendarDay;
