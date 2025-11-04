import React, { useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const CalendarWeek = () => {
  const hourWidth = 80;
  const rowHeight = 90;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  const today = new Date();
  const todayDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - todayDay);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const handleScroll = () => {
    if (scrollRef.current && headerRef.current) {
      headerRef.current.scrollLeft = scrollRef.current.scrollLeft;
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: { xs: 0, lg: 2 },
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        paddingTop: "6.2%",
        boxSizing: "border-box",
        overflow: "hidden",
        left: { xs: -50, lg: 0 },
      }}
    >
      {/* ✅ 시간 헤더 */}
      <Box
        ref={headerRef}
        sx={{
          position: "sticky",
          top: 0,
          left: "60px",
          overflow: "hidden",
          zIndex: 5,
          backgroundColor: "#fff",
          ml: "6.1%",
        }}
      >
        <Box sx={{ display: "flex", width: `${24 * hourWidth}px` }}>
          {Array.from({ length: 24 }, (_, hour) => (
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
                fontFamily={"Pretendard"}
                fontSize={12}
              >
                {hour}:00
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ✅ 본문 */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          position: "relative",
          fontFamily: "Pretendard",
          fontSize: 12,
        }}
      >
        {/* 요일 고정 열 */}
        <Box
          sx={{
            position: "sticky",
            width: "60px",
            zIndex: 4,
            px: 2,
            borderRight: "1px solid #999",
            backgroundColor: "#fff",
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
                <Typography fontFamily={"Pretendard"} fontSize={12}>
                  {days[di]}
                </Typography>
                <Typography variant="caption">
                  {`${date.getMonth() + 1}월 ${date.getDate()}일`}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* ✅ 시간 칸 */}
        <Box
          ref={scrollRef}
          onScroll={handleScroll}
          sx={{
            flex: 1,
            overflowX: "auto",
            overflowY: "hidden",
            scrollBehavior: "smooth",
            position: "relative",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box sx={{ width: `${24 * hourWidth}px`, position: "relative" }}>
            {/* ✅ 세로 구분선 */}
            {Array.from({ length: 24 }, (_, i) => (
              <Box
                key={`vline-${i}`}
                sx={{
                  position: "absolute",
                  left: `${i * hourWidth + hourWidth / 2}px`,
                  top: 0,
                  bottom: 0,
                  borderLeft: "1px dashed rgba(0,0,0,0.15)",
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* ✅ 요일 행 */}
            {days.map((_, di) => (
              <Box
                key={di}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: rowHeight,
                  borderBottom:
                    di === days.length - 1 ? "none" : "1px dashed #ccc",
                }}
              >
                {Array.from({ length: 24 }, (_, hour) => (
                  <Box
                    key={hour}
                    sx={{
                      flex: `0 0 ${hourWidth}px`,
                      height: "100%",
                    }}
                  />
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ✅ 파란 그라데이션 (화면 전체 세로 덮기, 요일칸 제외) */}
      <Box
        sx={{
          position: "absolute",

          bottom: 0,
          left: "5.5%", // 요일칸 끝부터 시작
          width: "70px",
          height: "88%",
          background:
            "linear-gradient(to right, rgba(255, 255, 255, 0.7), transparent)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "70px",
          height: "88%",
          background:
            "linear-gradient(to left, rgba(255, 255, 255, 0.7), transparent)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
    </Box>
  );
};

export default CalendarWeek;
