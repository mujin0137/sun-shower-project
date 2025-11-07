import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../CSS/modal.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  tag?: string;
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  tag,
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

        {/* Tag - X 버튼 왼쪽에 위치 */}
        {tag && (
          <Box
            sx={{
              position: "absolute",
              top: 28,
              right: 50,
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

        {/* Title */}
        {title && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 3,
              fontSize: "16px",
              fontFamily: "RG",
              color: "#000",
            }}
          >
            {title}
          </Typography>
        )}

        {/* Content */}
        <Box sx={{ width: "100%" }}>{children}</Box>
      </Box>
    </>
  );
};

export default Modal;
