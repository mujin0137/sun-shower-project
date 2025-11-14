import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import {
  ExpandMore,
  EmailOutlined,
  PhoneOutlined,
  HelpOutline,
  FeedbackOutlined,
  BugReportOutlined,
} from "@mui/icons-material";
import "../CSS/support.css";

interface FAQ {
  question: string;
  answer: string;
}

const Support = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // FAQ 데이터
  const faqs: FAQ[] = [
    {
      question: "여행 일정은 어떻게 추가하나요?",
      answer:
        "캘린더 페이지에서 원하는 날짜를 클릭하면 일정 추가 모달이 열립니다. 일정 이름, 시간, 장소 등을 입력하고 저장하시면 됩니다.",
    },
    {
      question: "여행 플랜은 몇 개까지 만들 수 있나요?",
      answer:
        "현재 최대 3개의 여행 플랜(여행일정 1, 2, 3)을 동시에 관리할 수 있습니다. 각 플랜은 서로 다른 색상으로 구분됩니다.",
    },
    {
      question: "날씨 정보는 어떻게 확인하나요?",
      answer:
        "날씨 페이지에서 여행지를 검색하면 실시간 날씨 정보와 5일간의 예보를 확인할 수 있습니다. 메인 페이지에서도 요약된 날씨 정보를 볼 수 있습니다.",
    },
    {
      question: "일정을 수정하거나 삭제하려면?",
      answer:
        "캘린더에서 해당 일정을 클릭하면 상세 정보를 수정하거나 삭제할 수 있는 모달이 열립니다.",
    },
    {
      question: "교통 정보는 어떻게 조회하나요?",
      answer:
        "교통 페이지에서 출발지와 도착지를 입력하면 대중교통 경로와 소요 시간을 확인할 수 있습니다.",
    },
    {
      question: "여행 일정을 다른 사람과 공유할 수 있나요?",
      answer:
        "캘린더 상단의 공유 버튼을 클릭하면 현재 여행 플랜을 다른 사용자와 공유할 수 있는 링크가 생성됩니다.",
    },
    {
      question: "모바일에서도 사용할 수 있나요?",
      answer:
        "네, 선샤워는 반응형 디자인으로 제작되어 PC, 태블릿, 모바일 등 모든 기기에서 편리하게 사용하실 수 있습니다.",
    },
  ];

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: 실제 API 연결
    try {
      // const response = await fetch(`http://${window.location.hostname}:5001/api/support`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(contactForm),
      // });

      // 임시로 성공 처리
      setSubmitted(true);
      setContactForm({ name: "", email: "", subject: "", message: "" });

      // 3초 후 메시지 숨기기
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("문의 전송 오류:", error);
    }
  };

  return (
    <Box className="page support-page">
      <Box className="support-container">
        {/* 헤더 섹션 */}
        <Box className="support-header">
          <HelpOutline className="support-header-icon" />
          <Typography variant="h4" className="support-title">
            고객센터
          </Typography>
          <Typography className="support-subtitle">
            무엇을 도와드릴까요?
          </Typography>
        </Box>

        {/* 빠른 도움말 카드 */}
        <Box className="quick-help-section">
          <Typography variant="h6" className="section-title">
            빠른 도움말
          </Typography>
          <Box className="quick-help-cards">
            <Card className="help-card">
              <CardContent className="help-card-content">
                <FeedbackOutlined className="help-card-icon" />
                <Typography variant="h6" className="help-card-title">
                  이용 가이드
                </Typography>
                <Typography className="help-card-description">
                  선샤워 사용법을 단계별로 안내해드립니다
                </Typography>
              </CardContent>
            </Card>

            <Card className="help-card">
              <CardContent className="help-card-content">
                <BugReportOutlined className="help-card-icon" />
                <Typography variant="h6" className="help-card-title">
                  버그 신고
                </Typography>
                <Typography className="help-card-description">
                  문제가 발생했나요? 저희에게 알려주세요
                </Typography>
              </CardContent>
            </Card>

            <Card className="help-card">
              <CardContent className="help-card-content">
                <EmailOutlined className="help-card-icon" />
                <Typography variant="h6" className="help-card-title">
                  문의하기
                </Typography>
                <Typography className="help-card-description">
                  궁금한 점이 있으시면 언제든 연락주세요
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* FAQ 섹션 */}
        <Box className="faq-section">
          <Typography variant="h6" className="section-title">
            자주 묻는 질문
          </Typography>
          <Box className="faq-list">
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleAccordionChange(`panel${index}`)}
                className="faq-accordion"
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  className="faq-summary"
                >
                  <Typography className="faq-question">
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="faq-details">
                  <Typography className="faq-answer">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* 문의하기 섹션 */}
        <Box className="contact-section">
          <Typography variant="h6" className="section-title">
            1:1 문의하기
          </Typography>
          <Card className="contact-card">
            <CardContent>
              {submitted ? (
                <Box className="success-message">
                  <Typography variant="h6" className="success-text">
                    문의가 성공적으로 전송되었습니다!
                  </Typography>
                  <Typography className="success-subtext">
                    빠른 시일 내에 답변드리겠습니다.
                  </Typography>
                </Box>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <TextField
                    fullWidth
                    label="이름"
                    name="name"
                    value={contactForm.name}
                    onChange={handleFormChange}
                    required
                    className="form-field"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="이메일"
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={handleFormChange}
                    required
                    className="form-field"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="제목"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleFormChange}
                    required
                    className="form-field"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="문의 내용"
                    name="message"
                    value={contactForm.message}
                    onChange={handleFormChange}
                    required
                    multiline
                    rows={6}
                    className="form-field"
                    margin="normal"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    className="submit-button"
                  >
                    문의 전송
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ margin: "40px 0" }} />

        {/* 연락처 정보 */}
        <Box className="contact-info-section">
          <Typography variant="h6" className="section-title">
            연락처 정보
          </Typography>
          <Box className="contact-info-cards">
            <Box className="info-item">
              <EmailOutlined className="info-icon" />
              <Box>
                <Typography className="info-label">이메일</Typography>
                <Typography className="info-value">
                  support@sunshower.com
                </Typography>
              </Box>
            </Box>
            <Box className="info-item">
              <PhoneOutlined className="info-icon" />
              <Box>
                <Typography className="info-label">전화</Typography>
                <Typography className="info-value">1588-0000</Typography>
              </Box>
            </Box>
          </Box>
          <Typography className="business-hours">
            운영 시간: 평일 09:00 - 18:00 (주말 및 공휴일 제외)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Support;
