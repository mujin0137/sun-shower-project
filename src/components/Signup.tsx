import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import TermsOfService from "./TermsOfService";
import PrivacyPolicy from "./PrivacyPolicy";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 약관 동의 상태
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // 모달 상태
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // 전체 동의 처리
  const handleAgreeAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAgreeAll(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
  };

  // 개별 약관 동의 처리
  const handleAgreeTerms = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeTerms(e.target.checked);
    if (!e.target.checked) {
      setAgreeAll(false);
    } else if (agreePrivacy) {
      setAgreeAll(true);
    }
  };

  const handleAgreePrivacy = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreePrivacy(e.target.checked);
    if (!e.target.checked) {
      setAgreeAll(false);
    } else if (agreeTerms) {
      setAgreeAll(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 약관 동의 확인
    if (!agreeTerms || !agreePrivacy) {
      setError("필수 약관에 모두 동의해주세요.");
      return;
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호 길이 확인
    if (password.length < 4) {
      setError("비밀번호는 최소 4자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
        padding: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 450,
          backgroundColor: "white",
          borderRadius: 2,
          padding: 4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            marginBottom: 3,
            textAlign: "center",
            fontWeight: "bold",
            color: "#A3D8F4",
          }}
        >
          <svg
            width="104"
            height="49"
            viewBox="0 0 104 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.18881 20.6553C9.18881 27.5266 10.5305 29.1529 12.5635 29.1529C14.637 29.1529 16.0601 27.5266 16.0601 20.6553C16.0601 13.784 14.637 12.1577 12.5635 12.1577C11.4657 12.1577 10.6932 12.5236 10.002 14.0686C9.35144 15.4917 7.7251 15.4104 5.69218 14.8412C4.06584 14.5972 2.92741 13.4588 3.41531 11.7511C4.63506 7.31935 8.00971 4.83918 12.6041 4.83918C19.2721 4.83918 23.3379 10.2874 23.3379 20.6553C23.3379 31.0232 19.2721 36.4714 12.6041 36.4714C5.93613 36.4714 1.87029 31.0232 1.87029 20.6553C1.87029 16.9554 2.68346 15.6543 5.48889 15.8983C8.7009 16.3862 9.18881 17.4433 9.18881 20.6553ZM36.308 39.4802C36.43 42.0823 34.6816 42.3263 32.5267 42.3263C30.3718 42.3263 28.8675 42.2856 28.7455 39.6835C28.6235 37.0813 28.5422 33.8693 28.5016 30.4133H26.3873C24.517 30.4133 24.1105 29.1529 24.1105 26.998C24.1105 24.8431 24.517 23.5827 26.3873 23.5827H28.4609V16.9961H26.3873C24.517 16.9961 24.1105 15.7356 24.1105 13.5807C24.1105 11.4258 24.517 10.1654 26.3873 10.1654H28.5829L28.7455 5.44906C28.8675 2.84692 30.3718 2.39968 32.5267 2.39968C34.6816 2.39968 36.43 2.72494 36.308 5.32708C35.9014 14.2719 35.9014 30.5353 36.308 39.4802Z"
              fill="#A3D8F4"
            />
            <path
              d="M55.9875 19.8758C55.896 21.7969 55.1947 22.0713 53.5175 22.0104C50.2242 21.8884 48.547 22.9252 48.547 24.2669C48.547 25.4867 49.3094 26.7369 54.0359 26.7369C58.7625 26.7369 59.4943 25.4562 59.5248 24.4804C59.5553 23.4741 59.0064 22.8947 57.8781 22.4983C56.6584 22.0713 56.5669 21.126 56.9023 19.5099C57.1768 18.0462 57.5732 17.3753 59.7383 17.7717C62.6352 18.2901 65.3796 20.4552 65.3796 24.7243C65.3796 28.9934 61.9338 31.8599 54.0359 31.8599C46.138 31.8599 42.6922 29.0544 42.6922 24.5108C42.6922 19.6623 46.2295 16.7044 53.8529 17.0704C55.6826 17.1618 56.0485 17.9547 55.9875 19.8758ZM56.8109 44.5758C56.8109 45.9785 55.6826 46.192 53.9749 46.192C52.2673 46.192 51.139 46.009 51.139 44.5758V39.3918C48.3031 39.2699 45.6501 39.3918 42.7227 39.8187C40.8931 40.0932 40.0697 39.2699 40.0697 37.4707C40.0697 36.0985 40.1612 35.0312 41.9299 34.6958C43.729 34.3604 46.4734 34.0554 50.8341 34.2689C52.6027 34.3604 55.3471 34.6348 57.1158 34.7263C60.6531 34.9397 62.8791 35.0312 65.4406 34.6348C67.1178 34.3604 67.7886 35.1837 67.8801 36.9828C67.9411 38.355 67.8801 39.3918 66.4164 39.6968C64.0379 40.1847 61.5984 40.2762 56.8109 39.8797V44.5758Z"
              fill="#A3D8F4"
            />
            <path
              d="M88.8217 33.5198C88.9964 35.756 87.5288 36.3151 85.677 36.3151C84.5239 36.3151 83.6155 36.2452 83.0564 35.6512C80.2961 36.3151 78.1996 36.4898 75.2995 36.2102C72.2248 35.9307 71.3163 34.0788 71.0717 31.1438C70.7572 27.5798 70.7572 20.0326 71.0368 12.6252C71.1066 10.8082 72.1199 10.1793 74.2863 10.1094C76.802 10.0395 77.6056 10.6335 77.5358 12.4505C77.2213 19.0193 77.2213 25.5882 77.5358 28.8377C77.6406 29.7811 77.8153 30.3751 78.7238 30.3402C79.5973 30.3052 80.5407 30.1655 82.2528 29.8161L82.1829 24.7496H79.9117C78.3045 24.7496 77.9551 23.6665 77.9551 21.8146C77.9551 19.9627 78.3045 18.8796 79.9117 18.8796H82.2178C82.2528 16.6783 82.3227 14.512 82.4275 12.4854C82.5323 10.2492 83.8251 10.0395 85.677 10.0395C87.5288 10.0395 88.9964 10.5986 88.8217 12.8348C88.3674 19.1242 88.2277 26.0774 88.8217 33.5198ZM100.177 39.4947C100.282 41.7309 98.7798 41.9405 96.9279 41.9405C95.0761 41.9405 93.7833 41.9056 93.6784 39.6694C93.329 31.9824 93.329 17.9362 93.6784 10.2492C93.7833 8.01298 95.0761 7.62863 96.9279 7.62863C98.7798 7.62863 100.282 7.90815 100.177 10.1444C99.828 17.8314 99.828 31.8077 100.177 39.4947Z"
              fill="#A3D8F4"
            />
          </svg>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            autoComplete="email"
          />

          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            autoComplete="new-password"
            helperText="최소 4자 이상"
          />

          <TextField
            fullWidth
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            margin="normal"
            autoComplete="new-password"
          />

          {/* 약관 동의 섹션 */}
          <Box
            sx={{
              marginTop: 3,
              padding: 2,
              backgroundColor: "#FAFAFA",
              borderRadius: 1,
              border: "1px solid #E0E0E0",
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeAll}
                    onChange={handleAgreeAll}
                    sx={{
                      color: "#A3D8F4",
                      "&.Mui-checked": { color: "#A3D8F4" },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: "600", fontSize: "15px" }}>
                    전체 동의
                  </Typography>
                }
              />

              <Box sx={{ marginLeft: 2, marginTop: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeTerms}
                      onChange={handleAgreeTerms}
                      sx={{
                        color: "#A3D8F4",
                        "&.Mui-checked": { color: "#A3D8F4" },
                      }}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Typography sx={{ fontSize: "14px" }}>
                        [필수] 서비스 이용약관 동의
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => setTermsModalOpen(true)}
                        sx={{
                          minWidth: "auto",
                          padding: "2px 6px",
                          fontSize: "12px",
                          color: "#666",
                          textDecoration: "underline",
                        }}
                      >
                        보기
                      </Button>
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreePrivacy}
                      onChange={handleAgreePrivacy}
                      sx={{
                        color: "#A3D8F4",
                        "&.Mui-checked": { color: "#A3D8F4" },
                      }}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Typography sx={{ fontSize: "14px" }}>
                        [필수] 개인정보 처리방침 동의
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => setPrivacyModalOpen(true)}
                        sx={{
                          minWidth: "auto",
                          padding: "2px 6px",
                          fontSize: "12px",
                          color: "#666",
                          textDecoration: "underline",
                        }}
                      >
                        보기
                      </Button>
                    </Box>
                  }
                />
              </Box>
            </FormGroup>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              marginTop: 3,
              marginBottom: 2,
              padding: 1.5,
              backgroundColor: "#A3D8F4",
              "&:hover": {
                backgroundColor: "#8BC9E8",
              },
            }}
          >
            {loading ? "가입 중..." : "회원가입"}
          </Button>
        </form>

        <Box sx={{ textAlign: "center", marginTop: 2 }}>
          <Typography variant="body2" color="textSecondary">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/login"
              style={{
                color: "#A3D8F4",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              로그인
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* 이용약관 모달 */}
      <Dialog
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#A3D8F4",
            color: "white",
            fontWeight: "bold",
          }}
        >
          서비스 이용약관
        </DialogTitle>
        <DialogContent
          sx={{
            paddingTop: "0 !important",
            overflowY: "auto",
          }}
        >
          <TermsOfService />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTermsModalOpen(false)} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      {/* 개인정보처리방침 모달 */}
      <Dialog
        open={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#A3D8F4",
            color: "white",
            fontWeight: "bold",
          }}
        >
          개인정보 처리방침
        </DialogTitle>
        <DialogContent
          sx={{
            paddingTop: "0 !important",
            overflowY: "auto",
          }}
        >
          <PrivacyPolicy />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrivacyModalOpen(false)} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Signup;
