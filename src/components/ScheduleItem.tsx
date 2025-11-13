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
        gap: { xs: "2px", sm: "4px" },
        backgroundColor: getBackgroundColor(),
        borderRadius: "10px",
        padding: { xs: "3px 6px", sm: "4px 8px" },
        marginBottom: { xs: "3px", sm: "4px" },
        cursor: onClick ? "pointer" : "default",
        fontSize: { xs: "0.62rem", sm: "0.7rem", md: "0.75rem" },
        color: "#fff",
        fontWeight: "500",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
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
        }}
      >
        {startTime}
      </Box>

      {/* 일정 제목 */}

      {/* 종료 시간 (있는 경우) */}
      {endTime && (
        <Box
          component="span"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          ~{endTime}
        </Box>
      )}
      <Box
        component="span"
        sx={{
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
