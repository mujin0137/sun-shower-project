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
  const paddingTop = 92;
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [eventData, setEventData] = useState({
    start: "",
    end: "",
    place: "",
  });

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) =>
    `${(i + startHour).toString().padStart(2, "0")}:00`
  );

  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);


  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  // 클릭 시 모달 오픈
  const handleLineClick = (event: React.MouseEvent<HTMLElement>, time: string) => {
    setSelectedTime(time);
    setEventData((prev) => ({ ...prev, start: time }));
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  const handleChange = (key: string, value: string) => {
    setEventData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box
      sx={{
        position: "relative",
        left: 0,
        width: "calc(100vw - 68px)",
        maxWidth: {xs:"450px", lg:"1525px"},
        height: "711.66px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        overflow: "hidden",
        boxSizing: "border-box",

        "@media (max-width:600px)": {
          position: "fixed",
          top: 120,
          width: "100vw",
          height: "calc(100vh - 120px)", // 상단 제외 영역
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          borderRadius: 0,
        },
      }}
    >
      {/* 🧊 상단 고정 영역 */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          height: `${paddingTop}px`,
          backgroundColor: "white",
          zIndex: 2,
        }}
      />

      {/* 🧾 스크롤 영역 */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
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
            height: `calc(45px * ${hours.length})`,
            left: `${labelWidth + 36}px`,
            borderLeft: "1px solid #222",
            zIndex: 1,
            "@media (max-width:600px)": { left: `${labelWidth + 20}px` },
          }}
        />

        {/* 시간 라인 */}
        <Box sx={{ display: "flex", flexDirection: "column", position: "relative" }}>
          {hours.map((time, idx) => (
            <Box
              key={idx}
               onClick={(e) => handleLineClick(e, time)}
              sx={{
                display: "flex",
                alignItems: "center",
                height: 45,
                cursor: "pointer",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              {/* 시간 레이블 */}
              <Box
                sx={{
                  width: `${labelWidth}px`,
                  textAlign: "right",
                  pr: 1,
                  fontSize: 14,
                  color: "#000",
                  "@media (max-width:600px)": {
                    textAlign: "left",
                    pl: 2,
                    pr: 0,
                    fontSize: 13,
                  },
                }}
              >
                {time}
              </Box>

              {/* 가로선 */}
              <Box

              onClick={(e) => {
               e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              console.log("anchorPosition:", rect.top + window.scrollY, rect.left);
              setSelectedTime(time);
              setAnchorPosition({
                top : rect.top + window.scrollY,
                left: labelWidth + 36 + 79,
              });
              }}
                sx={{
                  flex: 1,
                  borderBottom: "1px dashed #999",
                  ml: 4,
                  "@media (max-width:600px)": { ml: 2 },
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

       {/* 일정 추가 다이얼로그 */}
      <Popover
        open={Boolean(anchorPosition)}
        onClose={()=> setAnchorPosition(null)}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition || {top:0 , left: 0}}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
         
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            zIndex : 9999,
            p : 2,
            borderRadius: 2,
            backgroundColor: "white",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
            minWidth: 500,
            "@media (max-width:600px)": {
              width: "95vw",
              minWidth: "unset",
              left: "10px !important",
            },
          },
        }}
      >
             
          <Stack
            direction="row"
            spacing={2}
            alignItems = "center"
          >
            <TextField
              label="시작시간"
              type="time"
              value={eventData.start}
              onChange={(e) => handleChange("start", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                minWidth: 120,
                "@media (max-width:600px)": { minWidth: "45%" },
              }}
            />
            <TextField
              label="종료시간"
              type="time"
              value={eventData.end}
              onChange={(e) => handleChange("end", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                minWidth: 120,
                "@media (max-width:600px)": { minWidth: "45%" },
              }}
            />
            <TextField
              label="일정 제목"
              value={eventData.place}
              onChange={(e) => handleChange("place", e.target.value)}
              fullWidth
              sx={{
                minWidth: 140,
                mt: 2,
                "@media (max-width:600px)": { width: "100%" },
              }}
            />

            <TextField
              label="일정 장소 상세주소"
              value={eventData.place}
              onChange={(e) => handleChange("place", e.target.value)}
              fullWidth
              sx={{
                minWidth: 200,
                mt: 2,
                "@media (max-width:600px)": { width: "100%" },
              }}
            />
          </Stack>
       </Popover>        

      {/* 🌫 상단 그라데이션 */}
      <Box
        sx={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          height: 40,
          background: "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))",
          zIndex: 10,
          pointerEvents: "none",
          "@media (max-width:600px)": {
            top: 90,
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
          background: "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
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