import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import type { AlertColor } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import {
  // ShareRounded,
  ContentCopyRounded,
  CloseRounded,
} from "@mui/icons-material";

interface ShareButtonProps {
  tripPlan: string; // 여행일정 1, 여행일정 2, 여행일정 3
  tripTitle?: string;
  tripPlanOptions?: string[];
  onTripPlanChange?: (event: SelectChangeEvent<string>) => void;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  tripPlan,
  tripTitle,
  tripPlanOptions = ["여행일정 1", "여행일정 2", "여행일정 3"],
  onTripPlanChange,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");
  const [selectedTripPlan, setSelectedTripPlan] = useState(tripPlan);

  React.useEffect(() => {
    setSelectedTripPlan(tripPlan);
  }, [tripPlan]);

  const handleTripPlanSelect = (event: SelectChangeEvent<string>) => {
    setSelectedTripPlan(event.target.value);
    onTripPlanChange?.(event);
  };

  const handleCreateLink = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbarMessage("로그인이 필요합니다");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const response = await fetch(
        `http://${window.location.hostname}:5001/api/share/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tripPlan: selectedTripPlan,
            tripTitle: tripTitle || selectedTripPlan,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const frontendUrl = `${window.location.origin}/shared/${data.shareLink.shareCode}`;
        setShareUrl(frontendUrl);
        setSnackbarMessage("공유 링크가 생성되었습니다");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("공유 링크 생성 실패");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("공유 링크 생성 오류:", error);
      setSnackbarMessage("공유 링크 생성 중 오류가 발생했습니다");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setShareUrl("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShareUrl("");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setSnackbarMessage("링크가 복사되었습니다!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <>
      <button
        // startIcon={<ShareRounded />}
        onClick={handleOpen}
        style={{
          backgroundColor: "#A3D8F4",
          border: "none",
          width: "60px",
          height: "25px",
          color: "#000",
          fontFamily: "Pretendard",
          fontSize: "14px",
          fontWeight: "600",
          textTransform: "none",
          borderRadius: "8px",
          // padding: "8px 16px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          // "&:hover": {
          //   backgroundColor: "#80C2E8",
          // },
        }}
      >
        공유
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "RG",
            fontWeight: "700",
            fontSize: "20px",
          }}
        >
          일정 공유
          <IconButton onClick={handleClose} size="small">
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "150px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <FormControl
                className="share-button-form-control"
                size="small"
                fullWidth
                sx={{
                  backgroundColor: "#f1f1f1",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "& .MuiSelect-select": {
                    padding: "8px 12px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  },
                  marginBottom: "16px",
                }}
              >
                <Select
                  value={selectedTripPlan}
                  onChange={handleTripPlanSelect}
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
                  {tripPlanOptions.map((plan) => (
                    <MenuItem key={plan} value={plan}>
                      {plan}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography
                sx={{
                  fontFamily: "Pretendard",
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "16px",
                }}
              >
                {tripTitle || selectedTripPlan}의 모든 일정을 공유합니다
              </Typography>

              <TextField
                fullWidth
                value={shareUrl}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <IconButton onClick={handleCopyLink} edge="end">
                      <ContentCopyRounded />
                    </IconButton>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    fontFamily: "Pretendard",
                    fontSize: "13px",
                  },
                }}
              />

              <Typography
                sx={{
                  fontFamily: "Pretendard",
                  fontSize: "12px",
                  color: "#999",
                  marginTop: "12px",
                }}
              >
                이 링크를 받은 사람은 일정을 읽기 전용으로 볼 수 있습니다
              </Typography>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ padding: "16px" }}>
          <Button
            onClick={handleClose}
            sx={{
              fontFamily: "Pretendard",
              color: "#666",
              textTransform: "none",
            }}
          >
            닫기
          </Button>
          <Button
            onClick={handleCreateLink}
            variant="contained"
            disabled={loading}
            sx={{
              fontFamily: "Pretendard",
              backgroundColor: "#63a465",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#558757",
              },
            }}
          >
            링크 생성
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="outlined"
            disabled={!shareUrl}
            sx={{
              fontFamily: "Pretendard",
              textTransform: "none",
            }}
          >
            링크 복사
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ fontFamily: "Pretendard" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareButton;
