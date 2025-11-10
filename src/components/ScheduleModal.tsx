import React, { useState } from "react";
import Modal from "./Modal";
import { Box, Button, TextField, Select, MenuItem } from "@mui/material";

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ open, onClose }) => {
  const [scheduleDate, setScheduleDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleContent, setScheduleContent] = useState("");
  const [scheduleName, setScheduleName] = useState(""); // 일정 제목 (title 필드)
  const [tripPlan, setTripPlan] = useState("여행일정 1"); // 여행일정 선택

  // 00:00부터 23:00까지 시간 옵션 생성
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const handleConfirm = () => {
    console.log("일정 추가:", {
      tripPlan,
      scheduleName,
      scheduleDate,
      startTime,
      endTime,
      scheduleTitle,
      scheduleContent,
    });
    // TODO: 일정 저장 로직 추가
    onClose();
    // 입력값 초기화
    setScheduleDate("");
    setStartTime("");
    setEndTime("");
    setScheduleTitle("");
    setScheduleContent("");
    setScheduleName("");
    setTripPlan("여행일정 1");
  };

  const handleDelete = () => {
    console.log("일정 삭제");
    // TODO: 일정 삭제 로직 추가
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={scheduleName}
      titleEditable={true}
      onTitleChange={setScheduleName}
      tag={tripPlan}
      tagOptions={["여행일정 1", "여행일정 2", "여행일정 3"]}
      onTagChange={setTripPlan}
      width={345}
      height="450px"
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {/* 날짜 및 시간 */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              size="small"
              sx={{
                flex: "0 0 auto",
                width: "115px",
                backgroundColor: "white",
                marginRight: "61px",
                borderRadius: "3px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                  fontSize: "12px",
                },
                "& input": {
                  padding: "11px",
                },
              }}
            />{" "}
            <Select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                flex: "0 0 auto",
                width: "77px",
                backgroundColor: "white",
                borderRadius: "3px",
                marginRight: "15px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiSelect-select": {
                  padding: "8px",
                  fontSize: "12px",
                },
              }}
            >
              <MenuItem value="" disabled>
                <span style={{ color: "#999" }}>시작</span>
              </MenuItem>
              {timeOptions.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>{" "}
            <Select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                flex: "0 0 auto",
                width: "77px",
                backgroundColor: "white",
                borderRadius: "3px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiSelect-select": {
                  padding: "8px",
                  fontSize: "12px",
                },
              }}
            >
              <MenuItem value="" disabled>
                <span style={{ color: "#999" }}>종료</span>
              </MenuItem>
              {timeOptions.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <TextField
            placeholder="일정 상세 내용 (메모)"
            size="small"
            sx={{
              width: "100%",
              backgroundColor: "white",
              borderRadius: "3px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" },
                fontSize: "14px",
              },
              "& input": {
                padding: "8px",
              },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              paddingTop: "45px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                width: "100%",
              }}
            >
              <TextField
                placeholder="이름"
                size="small"
                sx={{
                  width: "20%",
                  backgroundColor: "white",
                  borderRadius: "3px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" },
                    fontSize: "14px",
                  },
                  "& input": {
                    padding: "8px",
                  },
                }}
              />

              <TextField
                placeholder="장소 이름"
                size="small"
                sx={{
                  width: "25%",
                  backgroundColor: "white",
                  borderRadius: "3px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" },
                    fontSize: "14px",
                  },
                  "& input": {
                    padding: "8px",
                  },
                }}
              />
            </Box>
            <TextField
              placeholder="연락처"
              size="small"
              sx={{
                width: "50%",
                backgroundColor: "white",
                borderRadius: "3px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                  fontSize: "14px",
                },
                "& input": {
                  padding: "8px",
                },
              }}
            />
          </Box>
          {/* 일정 내용 입력 */}
          <TextField
            placeholder="상세 주소"
            size="small"
            multiline
            sx={{
              backgroundColor: "white",
              borderRadius: "3px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" },
                fontSize: "14px",
              },
            }}
          />
        </Box>
        {/* 버튼 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            paddingTop: "34px",
          }}
        >
          <Button
            onClick={handleConfirm}
            sx={{
              backgroundColor: "white",
              border: "1px solid #555396",
              borderRadius: "13.5px",
              padding: "6px 24px",
              color: "#555396",
              minWidth: "109px",
              fontSize: "14px",
              fontWeight: "500",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            저장
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              backgroundColor: "white",
              border: "1px solid #FF6B6B",
              borderRadius: "13.5px",
              padding: "6px 24px",
              color: "#FF6B6B",
              minWidth: "109px",
              fontSize: "14px",
              fontWeight: "500",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            삭제
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ScheduleModal;
