import React from "react";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../CSS/modal.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  titleEditable?: boolean;
  onTitleChange?: (value: string) => void;
  tag?: string;
  tagOptions?: string[];
  onTagChange?: (value: string) => void;
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  titleEditable = false,
  onTitleChange,
  tag,
  tagOptions = [],
  onTagChange,
  children,
  width = 345,
  height = 361,
}) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose} />

      {/* Modal Content */}
      <Box
        className="modal-container"
        sx={{
          width: width,
          height: height,
          backgroundColor: "#DEF4FF",
          borderRadius: "10px",
          padding: "28px",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          zIndex: 1300,
        }}
      >
        {/* Close Button - 항상 오른쪽 최상단 */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 18,
            right: 18,
            backgroundColor: "white",
            width: 20,
            height: 20,
            zIndex: 1,
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>

        {/* Tag - X 버튼 왼쪽에 위치 (드롭다운 또는 텍스트) */}
        {(tag || tagOptions.length > 0) && (
          <Box
            sx={{
              position: "absolute",
              top: 22,
              right: 50,
              zIndex: 1,
            }}
          >
            {tagOptions.length > 0 ? (
              <Select
                value={tag || ""}
                onChange={(e) => onTagChange?.(e.target.value)}
                size="small"
                sx={{
                  backgroundColor:
                    tag === "여행일정 2"
                      ? "#FF9B4E"
                      : tag === "여행일정 3"
                      ? "#63A465"
                      : "#555396",
                  color: "white",
                  borderRadius: "11px",
                  fontSize: "12px",
                  fontWeight: "500",
                  marginTop: "17px",
                  transition: "background-color 0.2s ease",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-select": {
                    padding: "4px 16px",
                    paddingRight: "32px !important",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "white",
                  },
                }}
              >
                {tagOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Box
                sx={{
                  backgroundColor: "#555396",
                  color: "white",
                  borderRadius: "11px",
                  padding: "4px 16px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {tag}
              </Box>
            )}
          </Box>
        )}

        {/* Title (텍스트 필드 또는 일반 텍스트) */}
        {title !== undefined &&
          (titleEditable ? (
            <TextField
              value={title}
              onChange={(e) => onTitleChange?.(e.target.value)}
              placeholder="일정 제목 추가"
              size="small"
              sx={{
                mb: 3,
                // backgroundColor: "white",
                borderBottom: "1px solid #000",
                // border: "none",
                // borderRadius: "3px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                  fontSize: "16px",
                  fontWeight: "bold",
                },
                "& input": {
                  padding: "8px 0px",
                },
              }}
            />
          ) : (
            <Typography
              variant="h6"
              sx={{
                // fontWeight: "bold",
                mb: 3,
                fontSize: "16px",
                fontFamily: "RG",
                color: "#000",
              }}
            >
              {title}
            </Typography>
          ))}

        {/* Content */}
        <Box sx={{ width: "100%" }}>{children}</Box>
      </Box>
    </>
  );
};

export default Modal;
