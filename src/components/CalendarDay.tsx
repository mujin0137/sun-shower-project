import React, { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { Popover } from "@mui/material";

const CalendarDay = () => {
  const startHour = 0;
  const endHour = 23;
  const labelWidth = 60;
  const verticalLineOffset = 42; // 세로선 오프셋 (데스크톱 84px = 70 + 14)
  const verticalLineOffsetMobile = 40; // 모바일 세로선 오프셋 (모바일 94px = 75 + 19)
  const paddingTop = 92;
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [eventData, setEventData] = useState({
    start: "",
    end: "",
    place: "",
  });

  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => `${(i + startHour).toString().padStart(2, "0")}:00`
  );

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  const handleChange = (key: string, value: string) => {
    setEventData((prev) => ({ ...prev, [key]: value }));
  };

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
              sx={{
                display: "flex",
                alignItems: "center",
                height: 45,
              }}
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
                sx={{
                  flex: 1,
                  borderBottom: "1px dashed rgba(0,0,0,0.15)",
                  ml: `${verticalLineOffset - 40}px`,
                  minHeight: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  "@media (max-width:600px)": {
                    ml: `${verticalLineOffsetMobile - 39}px`,
                  },
                }}
              />
            </Box>
          ))}
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
          "@media (max-width:600px)": {
            top: 0,
            height: 80,
          },
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
          "@media (max-width:600px)": {
            height: 80,
          },
        }}
      />
    </Box>
  );
};

export default CalendarDay;
