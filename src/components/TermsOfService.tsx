import React from "react";
import { Box, Typography, Divider } from "@mui/material";

const TermsOfService = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        선샤워 서비스 이용약관
      </Typography>

      <Divider sx={{ marginBottom: 3 }} />

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제1조 (목적)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        본 약관은 선샤워(이하 "회사")가 제공하는 여행 일정 관리 서비스(이하 "서비스")의 이용과
        관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로
        합니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제2조 (정의)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        1. "서비스"란 회사가 제공하는 여행 일정 관리, 날씨 정보 조회, 교통 정보 조회 등의
        온라인 플랫폼 서비스를 의미합니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을
        말합니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        3. "회원"이란 회사와 서비스 이용계약을 체결하고 회원 아이디를 부여받은 자를 의미합니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제3조 (약관의 효력 및 변경)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수
        있으며, 약관이 변경되는 경우 적용일자 및 개정사유를 명시하여 공지합니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        3. 이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제4조 (회원가입)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는
        의사표시를 함으로써 회원가입을 신청합니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지
        않는 한 회원으로 등록합니다:
        <br />
        &nbsp;&nbsp;• 등록 내용에 허위, 기재누락, 오기가 있는 경우
        <br />
        &nbsp;&nbsp;• 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        3. 회원가입계약의 성립 시기는 회사의 승낙이 회원에게 도달한 시점으로 합니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제5조 (서비스의 제공 및 변경)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        1. 회사는 다음과 같은 서비스를 제공합니다:
        <br />
        &nbsp;&nbsp;• 여행 일정 생성, 수정, 삭제 및 관리
        <br />
        &nbsp;&nbsp;• 캘린더 기반 일정 조회 (일간, 주간, 월간)
        <br />
        &nbsp;&nbsp;• 여행지 날씨 정보 조회
        <br />
        &nbsp;&nbsp;• 교통 정보 조회
        <br />
        &nbsp;&nbsp;• 여행 일정 공유 기능
        <br />
        &nbsp;&nbsp;• 기타 회사가 추가 개발하거나 제휴계약 등을 통해 회원에게 제공하는 서비스
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        2. 회사는 필요한 경우 서비스의 내용을 변경할 수 있으며, 변경사항은 서비스 화면에
        공지합니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제6조 (서비스의 중단)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        1. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가
        발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        2. 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는
        제3자가 입은 손해에 대하여 배상하지 않습니다. 단, 회사의 고의 또는 중대한 과실이 있는
        경우에는 그러하지 아니합니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제7조 (회원의 의무)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        1. 회원은 다음 행위를 하여서는 안 됩니다:
        <br />
        &nbsp;&nbsp;• 신청 또는 변경 시 허위 내용의 등록
        <br />
        &nbsp;&nbsp;• 타인의 정보 도용
        <br />
        &nbsp;&nbsp;• 회사가 게시한 정보의 변경
        <br />
        &nbsp;&nbsp;• 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
        <br />
        &nbsp;&nbsp;• 회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해
        <br />
        &nbsp;&nbsp;• 회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
        <br />
        &nbsp;&nbsp;• 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        2. 회원은 관계법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항,
        회사가 통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는
        안 됩니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제8조 (개인정보 보호)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다.
        개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제9조 (회원 탈퇴 및 자격 상실)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        1. 회원은 회사에 언제든지 탈퇴를 요청할 수 있으며, 회사는 즉시 회원탈퇴를 처리합니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        2. 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수
        있습니다:
        <br />
        &nbsp;&nbsp;• 가입 신청 시에 허위 내용을 등록한 경우
        <br />
        &nbsp;&nbsp;• 다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우
        <br />
        &nbsp;&nbsp;• 서비스를 이용하여 법령 또는 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제10조 (면책조항)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
        서비스 제공에 관한 책임이 면제됩니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        2. 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        3. 회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지
        않으며, 그 밖에 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제11조 (준거법 및 재판관할)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        1. 본 약관의 해석 및 회사와 회원 간의 분쟁에 대하여는 대한민국의 법률을 적용합니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 3 }}>
        2. 서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 회사의 본사 소재지를
        관할하는 법원을 관할법원으로 합니다.
      </Typography>

      <Divider sx={{ marginY: 3 }} />

      <Typography variant="body2" sx={{ textAlign: "center", color: "#999" }}>
        부칙
        <br />
        본 약관은 2025년 1월 1일부터 시행됩니다.
      </Typography>
    </Box>
  );
};

export default TermsOfService;
