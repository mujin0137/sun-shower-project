import React from "react";
import { Box } from "@mui/material";

interface ScheduleItemProps {
  id: string;
  scheduleName: string;
  startTime: string;
  endTime?: string;
  placeType?: string;
  tripPlan: string;
  onClick?: (e: React.MouseEvent) => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  scheduleName,
  startTime,
  endTime,
  placeType,
  tripPlan,
  onClick,
}) => {
  // 여행일정에 따른 배경색 설정
  const getBackgroundColor = () => {
    switch (tripPlan) {
      case "여행일정 1":
        return "#555396";
      case "여행일정 2":
        return "#FF9B4E";
      case "여행일정 3":
        return "#63A465";
      default:
        return "#555396";
    }
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: "3px", sm: "4px" },
        backgroundColor: getBackgroundColor(),
        borderRadius: "10px",
        padding: { xs: "6px 8px", sm: "4px 10px" },
        marginBottom: { xs: "4px", sm: "5px" },
        minHeight: { xs: "24px", sm: "26px" },
        cursor: onClick ? "pointer" : "default",
        fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
        color: "#fff",
        fontWeight: "500",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        "&:hover": {
          opacity: onClick ? 0.9 : 1,
        },
      }}
    >
      {/* 아이콘 */}
      {/* {placeType && getIcon()} */}

      {/* 시작 시간 */}
      <Box
        component="span"
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flexShrink: 1,
          minWidth: 0,
          fontSize: { xs: "11px", sm: "11.5px" },
        }}
      >
        {startTime}
      </Box>

      {/* 일정 제목 */}

      {/* 종료 시간 (있는 경우) */}
      {/* {endTime && (
        <Box
          component="span"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flexShrink: 1,
            minWidth: 0,
            fontSize: "10px",
          }}
        >
          ~{endTime}
        </Box>
      )} */}
      <Box
        component="span"
        sx={{
          textAlign: "center",
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {scheduleName}
      </Box>
    </Box>
  );
};

export default ScheduleItem;
