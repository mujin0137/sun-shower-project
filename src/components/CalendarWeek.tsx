import React, { useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

const CalendarWeek = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  // ✅ 반응형 구분
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1024px)");

  // ✅ 반응형 크기
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

  const today = new Date();
  const todayDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - todayDay);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  // ✅ 스크롤 동기화
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
        maxWidth: {xs:"500px", lg:"1525px"},
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        paddingTop: isMobile ? "5%" : "3%",
        boxSizing: "border-box",
        margin: "0 auto",
        overflowX: "hidden", // ✅ 외부 가로 스크롤 완전 차단
        overflowY:"hidden",
        alignContent:"center"
      }}
    >
      {/* ✅ 시간 헤더 */}
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

      {/* ✅ 교차 덮개 */}
      <Box
        sx={{
          position: "absolute",
          top: {xs:30 ,lg:40},
          left: 0,
          width: {xs:"99px", lg:"70px"},
          height: "28px",
          backgroundColor: "#fff",
          zIndex: 3,
        }}
      />

      {/* ✅ 본문 */}
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
        {/* ✅ 요일 고정 열 */}
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

        {/* ✅ 시간 칸 (내부만 스크롤 가능) */}
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
            {/* ✅ 세로 구분선 */}
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
                {Array.from({ length: hourCount }, (_, hour) => (
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

      {/* ✅ 양쪽 그라데이션 */}
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
    </Box>
  );
};

export default CalendarWeek;
