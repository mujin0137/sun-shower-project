import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import "../CSS/booking.css";

interface Reservation {
  height: number;
  text: string;
  color: string;
}

const Booking = () => {
  const [reservations, setReservations] = useState<Reservation[]>([
    { height: 60, text: "", color: "#a29bfe" },
  ]);

  const colors = ["#a29bfe", "#ff6b6b", "#4ecdc4", "#ffd93d", "#06f79bff"];

  // 페이지 로드 시 저장된 데이터 불러오기
  useEffect(() => {
    const savedReservations = localStorage.getItem("reservations");
    if (savedReservations) {
      try {
        setReservations(JSON.parse(savedReservations));
      } catch (error) {
        console.error("예약내역 불러오기 오류:", error);
      }
    }
  }, []);

  // 예약 추가
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

  // 예약 삭제
  const handleDeleteReservation = (index: number) => {
    const updatedReservations = reservations.filter((_, idx) => idx !== index);
    const finalReservations = updatedReservations.length === 0
      ? [{ height: 60, text: "", color: "#a29bfe" }]
      : updatedReservations;
    setReservations(finalReservations);
    localStorage.setItem("reservations", JSON.stringify(finalReservations));
  };

  // 텍스트 변경
  const handleTextChange = (index: number, value: string) => {
    const updatedReservations = [...reservations];
    updatedReservations[index].text = value;
    setReservations(updatedReservations);
    localStorage.setItem("reservations", JSON.stringify(updatedReservations));
  };

  return (
    <Box className="booking-page">
      <Box className="booking-container">
        {/* 헤더 */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 3,
            textAlign: "center",
            fontFamily: "RG",
            fontSize: { xs: "24px", sm: "28px", md: "32px" },
          }}
        >
          예약현황
        </Typography>

        {/* 예약 리스트 */}
        <Box className="reservation-list">
          {reservations.map((item, idx) => (
            <Box
              key={idx}
              className="reservation-item"
              sx={{
                height: `${item.height}px`,
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
                onChange={(e) => handleTextChange(idx, e.target.value)}
                placeholder="00:00 예약장소"
                className="reservation-input"
                onFocus={(e) => {
                  e.target.select();
                }}
              />
              <Box
                onClick={() => handleDeleteReservation(idx)}
                className="delete-btn"
              >
                ×
              </Box>
            </Box>
          ))}
        </Box>

        {/* 하단 버튼들 */}
        <Box className="button-container">
          <Box onClick={handleAddReservation} className="add-btn">
            +
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Booking;
