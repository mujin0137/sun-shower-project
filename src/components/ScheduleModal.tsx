import React, { useState } from "react";
import Modal from "./Modal";
import { Box, Button, TextField, Select, MenuItem } from "@mui/material";
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
}

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  initialDate?: string;
  schedule?: Schedule; // 수정할 일정 (있으면 수정 모드)
  onSave?: () => void; // 저장 성공 시 호출될 콜백
}

const API_BASE_URL = `http://${window.location.hostname}:5001`;

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  open,
  onClose,
  initialDate,
  schedule,
  onSave,
}) => {
  const [scheduleDate, setScheduleDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [scheduleContent, setScheduleContent] = useState("");
  const [scheduleName, setScheduleName] = useState(""); // 일정 제목 (title 필드)
  const [tripPlan, setTripPlan] = useState("여행일정 1"); // 여행일정 선택
  const [placeType, setPlaceType] = useState(""); // 장소 타입
  const [placeName, setPlaceName] = useState(""); // 장소 이름
  const [contact, setContact] = useState(""); // 연락처
  const [address, setAddress] = useState(""); // 상세 주소

  // 모달이 열릴 때 데이터 설정
  React.useEffect(() => {
    if (open) {
      if (schedule) {
        // 수정 모드: 기존 일정 데이터 채우기
        setScheduleName(schedule.scheduleName);
        setScheduleDate(schedule.scheduleDate);
        setStartTime(schedule.startTime);
        setEndTime(schedule.endTime || "");
        setScheduleContent(schedule.scheduleContent || "");
        setTripPlan(schedule.tripPlan);
        setPlaceType(schedule.placeType || "");
        setPlaceName(schedule.placeName || "");
        setContact(schedule.contact || "");
        setAddress(schedule.address || "");
      } else {
        // 생성 모드: 초기화 및 날짜 설정
        setScheduleName("");
        setScheduleDate(initialDate || "");
        setStartTime("");
        setEndTime("");
        setScheduleContent("");
        setTripPlan("여행일정 1");
        setPlaceType("");
        setPlaceName("");
        setContact("");
        setAddress("");
      }
    }
  }, [open, schedule, initialDate]);

  // 00:00부터 23:00까지 시간 옵션 생성
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const handleConfirm = async () => {
    // 필수 필드 검증
    if (!scheduleName || !scheduleDate || !startTime) {
      alert("일정 제목, 날짜, 시작 시간은 필수입니다.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const scheduleData = {
        tripPlan,
        scheduleName,
        scheduleDate,
        startTime,
        endTime,
        scheduleContent,
        placeType,
        placeName,
        contact,
        address,
      };

      const isEditMode = !!schedule;
      const url = isEditMode
        ? `${API_BASE_URL}/api/schedules/${schedule._id}`
        : `${API_BASE_URL}/api/schedules`;
      const method = isEditMode ? "PUT" : "POST";

      console.log(`일정 ${isEditMode ? "수정" : "저장"} 중:`, scheduleData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
      });

      const data = await response.json();

      if (data.success) {
        console.log(
          `✅ 일정 ${isEditMode ? "수정" : "저장"} 성공:`,
          data.schedule
        );
        alert(`일정이 ${isEditMode ? "수정" : "저장"}되었습니다.`);
        if (onSave) {
          onSave(); // 저장 성공 시 부모 컴포넌트에 알림
        }
        onClose();
      } else {
        console.error(
          `❌ 일정 ${isEditMode ? "수정" : "저장"} 실패:`,
          data.message
        );
        alert(
          data.message || `일정 ${isEditMode ? "수정" : "저장"}에 실패했습니다.`
        );
      }
    } catch (error) {
      console.error("❌ 일정 저장/수정 오류:", error);
      alert("일정 저장/수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!schedule) {
      alert("삭제할 일정이 없습니다.");
      return;
    }

    if (!window.confirm("정말 이 일정을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      console.log("일정 삭제 중:", schedule._id);

      const response = await fetch(
        `${API_BASE_URL}/api/schedules/${schedule._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("✅ 일정 삭제 성공");
        alert("일정이 삭제되었습니다.");
        if (onSave) {
          onSave(); // 삭제 성공 시 부모 컴포넌트에 알림
        }
        onClose();
      } else {
        console.error("❌ 일정 삭제 실패:", data.message);
        alert(data.message || "일정 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 일정 삭제 오류:", error);
      alert("일정 삭제 중 오류가 발생했습니다.");
    }
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
            value={scheduleContent}
            onChange={(e) => setScheduleContent(e.target.value)}
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
              <Select
                value={placeType}
                onChange={(e) => setPlaceType(e.target.value)}
                displayEmpty
                size="small"
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: "#999" }}>선택</span>;
                  }
                  const icons = {
                    식당: <RestaurantRounded sx={{ fontSize: "18px" }} />,
                    카페: <LocalCafeRounded sx={{ fontSize: "18px" }} />,
                    숙소: <HotelRounded sx={{ fontSize: "18px" }} />,
                    상가: <LocalMallRounded sx={{ fontSize: "18px" }} />,
                    아케이드: (
                      <LocalActivityRounded sx={{ fontSize: "18px" }} />
                    ),
                    교통: <TrainRounded sx={{ fontSize: "18px" }} />,
                  };
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        paddingLeft: "7px",
                        // backgroundColor: "red",
                        height: "100%",
                      }}
                    >
                      {icons[selected as keyof typeof icons]}
                    </Box>
                  );
                }}
                sx={{
                  width: "20%",
                  backgroundColor: "white",
                  borderRadius: "3px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-select": {
                    padding: "8px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <span style={{ color: "#999" }}>선택</span>
                </MenuItem>
                <MenuItem value="식당">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <RestaurantRounded sx={{ fontSize: "18px" }} />
                    <span>식당</span>
                  </Box>
                </MenuItem>
                <MenuItem value="카페">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalCafeRounded sx={{ fontSize: "18px" }} />
                    <span>카페</span>
                  </Box>
                </MenuItem>
                <MenuItem value="숙소">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HotelRounded sx={{ fontSize: "18px" }} />
                    <span>숙소</span>
                  </Box>
                </MenuItem>
                <MenuItem value="상가">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalMallRounded sx={{ fontSize: "18px" }} />
                    <span>상가</span>
                  </Box>
                </MenuItem>
                <MenuItem value="아케이드">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalActivityRounded sx={{ fontSize: "18px" }} />
                    <span>아케이드</span>
                  </Box>
                </MenuItem>
                <MenuItem value="교통">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TrainRounded sx={{ fontSize: "18px" }} />
                    <span>교통</span>
                  </Box>
                </MenuItem>
              </Select>

              <TextField
                placeholder="장소 이름"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
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
              value={contact}
              onChange={(e) => setContact(e.target.value)}
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
          {/* 수정 모드일 때만 삭제 버튼 표시 */}
          {schedule && (
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
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ScheduleModal;
