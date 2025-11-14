import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

interface ChecklistItem {
  text: string;
  isChecked: boolean;
}

const Checklist = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { text: "", isChecked: false },
  ]);

  // 체크 상태 토글
  const handleChecklistToggle = (index: number) => {
    const updated = [...checklistItems];
    updated[index].isChecked = !updated[index].isChecked;
    setChecklistItems(updated);
    localStorage.setItem("checklistItems", JSON.stringify(updated));
  };

  // 텍스트 변경
  const handleChecklistTextChange = (index: number, value: string) => {
    const updated = [...checklistItems];
    updated[index].text = value;
    setChecklistItems(updated);
    localStorage.setItem("checklistItems", JSON.stringify(updated));
  };

  // 항목 추가
  const handleAddChecklistItem = () => {
    const updated = [...checklistItems, { text: "", isChecked: false }];
    setChecklistItems(updated);
    localStorage.setItem("checklistItems", JSON.stringify(updated));
  };

  // 항목 삭제
  const handleDeleteChecklistItem = (index: number) => {
    const updatedItems = checklistItems.filter((_, idx) => idx !== index);
    const finalItems = updatedItems.length === 0
      ? [{ text: "", isChecked: false }]
      : updatedItems;
    setChecklistItems(finalItems);
    localStorage.setItem("checklistItems", JSON.stringify(finalItems));
  };

  // 페이지 로드 시 저장된 데이터 불러오기
  useEffect(() => {
    const savedChecklistItems = localStorage.getItem("checklistItems");
    if (savedChecklistItems) {
      try {
        setChecklistItems(JSON.parse(savedChecklistItems));
      } catch (error) {
        console.error("체크리스트 불러오기 오류:", error);
      }
    }
  }, []);

  return (
    <Box
      sx={{
        flex: 1,
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#ffffffff",
        borderRadius: "10px",
        flexDirection: "column",
        p: "12px",
        boxSizing: "border-box",
      }}
    >
      {/* 헤더 */}
      <Typography
        variant="subtitle1"
        sx={{
          color: "black",
          fontWeight: 500,
          textAlign: "center",
          mb: "19px",
          mt: "19px",
          fontSize: 16,
          flexShrink: 0,
          fontFamily: "RG",
        }}
      >
        체크리스트
      </Typography>

      {/* 리스트 영역 */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          pb: "60px",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255,255,255,0.3)",
            borderRadius: "3px",
          },
        }}
      >
        {checklistItems.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "11px",

              px: 5,
              flexShrink: 0,
              position: "relative",
            }}
          >
            {/* 체크박스 */}
            <Box
              onClick={() => handleChecklistToggle(idx)}
              sx={{
                width: "20px",
                height: "20px",
                backgroundColor: item.isChecked ? "#555396" : "#ddd",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "0.2s",
                flexShrink: 0,
                marginLeft: "9px",
              }}
            >
              {item.isChecked && (
                <Box
                  component="span"
                  sx={{
                    width: "6px",
                    height: "10px",
                    borderRight: "2px solid white",
                    borderBottom: "2px solid white",
                    transform: "rotate(45deg) translate(-1px, -1.5px)",
                  }}
                />
              )}
            </Box>

            {/* 입력창 */}
            <input
              type="text"
              value={item.text}
              onChange={(e) => handleChecklistTextChange(idx, e.target.value)}
              placeholder="체크리스트"
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                fontWeight: 600,
                fontSize: "13px",
                color: "black",
                textAlign: window.innerWidth < 900 ? "center" : "left",
              }}
            />

            {/* 삭제버튼 */}
            <Box
              onClick={() => handleDeleteChecklistItem(idx)}
              sx={{
                width: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ccc",
                borderRadius: "50%",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                flexShrink: 0,
                "&:hover": {
                  backgroundColor: "#b71c1c",
                  color: "white",
                },
              }}
            >
              ×
            </Box>
          </Box>
        ))}
      </Box>

      {/* 하단 버튼들 */}
      <Box
        sx={{
          flexShrink: 0,
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          alignContent: "center",
          flexDirection: "row",
          px: 5,
        }}
      >
        <Box
          onClick={handleAddChecklistItem}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            fontSize: "28px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "0.2s",
            "&:hover": {
              transform: "scale(1.2)",
            },
          }}
        >
          +
        </Box>
      </Box>
    </Box>
  );
};

export default Checklist;
