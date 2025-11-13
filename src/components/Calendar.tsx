import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import ShareButton from "./ShareButton";
import type { SelectChangeEvent } from "@mui/material/Select";

export interface CalendarOutletContext {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedTripPlan: string;
  setSelectedTripPlan: React.Dispatch<React.SetStateAction<string>>;
}

const Calendar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 탭
  const getCurrentTab = () => {
    if (location.pathname.includes("/day")) return "/calendar/day";
    if (location.pathname.includes("/week")) return "/calendar/week";
    if (location.pathname.includes("/month")) return "/calendar/month";
    return "/calendar/day";
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    navigate(event.target.value);
  };

  // 날짜 상태
  const [currentDate, setCurrentDate] = useState(new Date());

  // 여행 플랜 선택 상태
  const [selectedTripPlan, setSelectedTripPlan] = useState("여행일정 1");

  const handleTripPlanChange = (event: SelectChangeEvent<string>) => {
    setSelectedTripPlan(event.target.value);
  };

  const formatDate = (date: Date) => {
    const tab = getCurrentTab();

    if (tab === "/calendar/day") {
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    }

    if (tab === "/calendar/week") {
      const start = new Date(date);
      start.setDate(date.getDate() - date.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.getMonth() + 1}월 ${start.getDate()}일 ~ ${
        end.getMonth() + 1
      }월 ${end.getDate()}일`;
    }

    if (tab === "/calendar/month") {
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    }
  };

  const handlePrev = () => {
    const tab = getCurrentTab();
    const newDate = new Date(currentDate);

    if (tab === "/calendar/day") newDate.setDate(currentDate.getDate() - 1);
    else if (tab === "/calendar/week")
      newDate.setDate(currentDate.getDate() - 7);
    else if (tab === "/calendar/month")
      newDate.setMonth(currentDate.getMonth() - 1);

    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const tab = getCurrentTab();
    const newDate = new Date(currentDate);

    if (tab === "/calendar/day") newDate.setDate(currentDate.getDate() + 1);
    else if (tab === "/calendar/week")
      newDate.setDate(currentDate.getDate() + 7);
    else if (tab === "/calendar/month")
      newDate.setMonth(currentDate.getMonth() + 1);

    setCurrentDate(newDate);
  };

  const handleToday = () => setCurrentDate(new Date());

  return (
    <Box
      sx={{
        backgroundColor: "#ffffffff",
        display: "flex",
        borderRadius: 2,
        width: "100%",
        alignContent: "center",
        boxSizing: "border-box",
        position: "relative",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Box
        className="page"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* 🔹 상단 바 (날짜 + 드롭다운) */}
        <Box
          sx={{
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
          }}
        >
          {/* 🔸 날짜 + 화살표 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              padding: "0px 20px",
              // backgroundColor: "red",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Romanticgumi",
                fontSize: "13px",
                minWidth: 80,
                textAlign: "center",
              }}
            >
              {formatDate(currentDate)}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                // backgroundColor: "#ff2f2f",
              }}
            >
              <IconButton
                size="small"
                onClick={handlePrev}
                sx={{
                  width: 18,
                  height: 8,
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <ChevronLeft fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={handleNext}
                sx={{
                  width: 18,
                  height: 28,
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <ChevronRight fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* 🔸 드롭다운 + 오늘 버튼 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              onClick={handleToday}
              variant="outlined"
              size="small"
              sx={{
                fontSize: "0.8rem",
                borderRadius: "20px",
                height: 28,
                textTransform: "none",
                borderColor: "#c4c4c4",
                color: "#555",
                backgroundColor: "#fafafa",
                "&:hover": {
                  backgroundColor: "#eaeaea",
                  borderColor: "#bdbdbd",
                },
              }}
            >
              오늘
            </Button>

            <FormControl
              size="small"
              sx={{
                backgroundColor: "#d3d3d3",
                borderRadius: "20px",
                minWidth: 105,
                height: 25,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiSelect-select": {
                  padding: "2px 10px",
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                },
              }}
            >
              <Select
                value={getCurrentTab()}
                onChange={handleSelectChange}
                IconComponent={(props) => (
                  <span
                    {...props}
                    style={{
                      fontSize: "0.7rem",
                      marginLeft: "4px",
                      lineHeight: "13px",
                      padding: "0 10px",
                    }}
                  >
                    ▼
                  </span>
                )}
              >
                <MenuItem value="/calendar/day">일 D</MenuItem>
                <MenuItem value="/calendar/week">주 W</MenuItem>
                <MenuItem value="/calendar/month">월 M</MenuItem>
              </Select>
            </FormControl>
            <ShareButton
              tripPlan={selectedTripPlan}
              tripTitle={selectedTripPlan}
              tripPlanOptions={["여행일정 1", "여행일정 2", "여행일정 3"]}
              onTripPlanChange={handleTripPlanChange}
            />
          </Box>
        </Box>

        {/* ✅ context 전달 */}
        <Outlet
          context={{
            currentDate,
            setCurrentDate,
            selectedTripPlan,
            setSelectedTripPlan,
          }}
        />
      </Box>
    </Box>
  );
};

export default Calendar;
