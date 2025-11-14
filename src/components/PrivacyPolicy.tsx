import React from "react";
import { Box, Typography, Divider } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        선샤워 개인정보 처리방침
      </Typography>

      <Divider sx={{ marginBottom: 3 }} />

      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 3 }}>
        선샤워(이하 "회사")는 이용자의 개인정보를 중요시하며, "개인정보 보호법" 및 "정보통신망
        이용촉진 및 정보보호 등에 관한 법률" 등 관련 법령을 준수하고 있습니다. 회사는 본
        개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고
        있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제1조 (개인정보의 수집 항목 및 방법)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        1. 회사는 회원가입, 원활한 고객상담, 각종 서비스 제공을 위해 최초 회원가입 시 아래와
        같은 개인정보를 수집하고 있습니다:
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1, paddingLeft: 2 }}>
        <strong>[필수 수집 항목]</strong>
        <br />
        • 이메일 주소
        <br />
        • 비밀번호 (암호화 저장)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1, paddingLeft: 2 }}>
        <strong>[선택 수집 항목]</strong>
        <br />
        • 여행 일정 정보 (일정명, 날짜, 시간, 장소, 메모 등)
        <br />
        • 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        2. 개인정보 수집 방법:
        <br />
        &nbsp;&nbsp;• 회원가입 및 서비스 이용 과정에서 이용자가 직접 입력
        <br />
        &nbsp;&nbsp;• 서비스 이용 과정에서 자동으로 생성되어 수집
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제2조 (개인정보의 수집 및 이용 목적)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다:
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1, paddingLeft: 2 }}>
        <strong>1) 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산</strong>
        <br />
        &nbsp;&nbsp;• 여행 일정 관리 서비스 제공
        <br />
        &nbsp;&nbsp;• 날씨 정보, 교통 정보 제공
        <br />
        &nbsp;&nbsp;• 개인 맞춤 서비스 제공
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1, paddingLeft: 2 }}>
        <strong>2) 회원 관리</strong>
        <br />
        &nbsp;&nbsp;• 회원제 서비스 이용에 따른 본인확인
        <br />
        &nbsp;&nbsp;• 개인식별, 불량회원의 부정 이용 방지와 비인가 사용 방지
        <br />
        &nbsp;&nbsp;• 가입의사 확인, 연령확인
        <br />
        &nbsp;&nbsp;• 불만처리 등 민원처리, 고지사항 전달
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2, paddingLeft: 2 }}>
        <strong>3) 신규 서비스 개발 및 마케팅·광고에의 활용</strong>
        <br />
        &nbsp;&nbsp;• 신규 서비스 개발 및 맞춤 서비스 제공
        <br />
        &nbsp;&nbsp;• 통계학적 특성에 따른 서비스 제공 및 광고 게재
        <br />
        &nbsp;&nbsp;• 서비스의 유효성 확인, 이벤트 및 광고성 정보 제공 및 참여기회 제공
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제3조 (개인정보의 보유 및 이용기간)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        1. 회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
        단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1, paddingLeft: 2 }}>
        <strong>[회사 내부 방침에 의한 정보보유 사유]</strong>
        <br />
        • 부정이용기록 (부정가입, 징계기록 등의 비정상적 서비스 이용기록)
        <br />
        &nbsp;&nbsp;- 보존 이유: 부정 가입 및 이용 방지
        <br />
        &nbsp;&nbsp;- 보존 기간: 1년
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2, paddingLeft: 2 }}>
        <strong>[관련 법령에 의한 정보보유 사유]</strong>
        <br />
        • 계약 또는 청약철회 등에 관한 기록
        <br />
        &nbsp;&nbsp;- 보존 이유: 전자상거래 등에서의 소비자보호에 관한 법률
        <br />
        &nbsp;&nbsp;- 보존 기간: 5년
        <br />
        • 대금결제 및 재화 등의 공급에 관한 기록
        <br />
        &nbsp;&nbsp;- 보존 이유: 전자상거래 등에서의 소비자보호에 관한 법률
        <br />
        &nbsp;&nbsp;- 보존 기간: 5년
        <br />
        • 소비자의 불만 또는 분쟁처리에 관한 기록
        <br />
        &nbsp;&nbsp;- 보존 이유: 전자상거래 등에서의 소비자보호에 관한 법률
        <br />
        &nbsp;&nbsp;- 보존 기간: 3년
        <br />
        • 웹사이트 방문기록
        <br />
        &nbsp;&nbsp;- 보존 이유: 통신비밀보호법
        <br />
        &nbsp;&nbsp;- 보존 기간: 3개월
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제4조 (개인정보의 파기절차 및 방법)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이
        파기합니다. 파기절차 및 방법은 다음과 같습니다:
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1, paddingLeft: 2 }}>
        <strong>[파기절차]</strong>
        <br />
        • 이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져
        (종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라
        (보유 및 이용기간 참조) 일정 기간 저장된 후 파기됩니다.
        <br />• 동 개인정보는 법률에 의한 경우가 아니고서는 보유되는 이외의 다른 목적으로
        이용되지 않습니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2, paddingLeft: 2 }}>
        <strong>[파기방법]</strong>
        <br />
        • 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여
        삭제합니다.
        <br />• 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제5조 (개인정보의 제3자 제공)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는
        예외로 합니다:
        <br />
        &nbsp;&nbsp;• 이용자가 사전에 동의한 경우
        <br />
        &nbsp;&nbsp;• 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제6조 (개인정보 처리의 위탁)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        회사는 서비스 향상을 위해서 이용자의 개인정보를 외부에 위탁하여 처리할 수 있습니다.
        개인정보의 처리를 위탁하는 경우에는 사전에 그 사실을 이용자에게 고지하겠습니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제7조 (이용자 및 법정대리인의 권리와 그 행사방법)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        1. 이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며,
        가입해지를 요청할 수도 있습니다.
        <br />
        2. 이용자의 개인정보 조회 및 수정은 '마이페이지'에서, 가입해지(동의철회)는 고객센터를
        통해 가능합니다.
        <br />
        3. 이용자가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지
        당해 개인정보를 이용 또는 제공하지 않습니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제8조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        1. 회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로
        불러오는 '쿠키(cookie)'를 사용합니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        2. 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게
        보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        3. 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서, 이용자는 웹브라우저에서
        옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면
        모든 쿠키의 저장을 거부할 수도 있습니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제9조 (개인정보의 기술적·관리적 보호 대책)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1 }}>
        회사는 이용자의 개인정보를 처리함에 있어 개인정보가 분실, 도난, 유출, 변조 또는 훼손되지
        않도록 안전성 확보를 위하여 다음과 같은 기술적·관리적 대책을 강구하고 있습니다:
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 1, paddingLeft: 2 }}>
        <strong>[기술적 대책]</strong>
        <br />
        • 이용자의 개인정보는 비밀번호에 의해 보호되며, 파일 및 전송 데이터를 암호화하여
        중요한 데이터는 별도의 보안기능을 통해 보호되고 있습니다.
        <br />
        • 백신프로그램을 이용하여 컴퓨터 바이러스에 의한 피해를 방지하기 위한 조치를 취하고
        있습니다.
        <br />• 해킹 등 외부 침입에 대비하여 각 서버마다 침입차단시스템 및 취약점 분석
        시스템 등을 이용하여 보안에 만전을 기하고 있습니다.
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2, paddingLeft: 2 }}>
        <strong>[관리적 대책]</strong>
        <br />
        • 회사는 이용자의 개인정보에 대한 접근권한을 최소한의 인원으로 제한하고 있습니다.
        <br />
        • 개인정보를 처리하는 직원을 대상으로 새로운 보안 기술 습득 및 개인정보 보호 의무
        등에 관해 정기적인 사내 교육 및 외부 위탁교육을 실시하고 있습니다.
        <br />• 입사 시 개인정보 관련 처리자의 보안서약서를 통하여 사람에 의한 정보유출을
        사전에 방지하고 개인정보처리방침에 대한 이행사항 및 직원의 준수여부를 감사하기 위한
        내부절차를 마련하고 있습니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제10조 (개인정보 보호책임자 및 담당자의 연락처)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 2 }}>
        회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이
        관련 부서 및 개인정보 보호책임자를 지정하고 있습니다:
        <br />
        <br />
        <strong>개인정보 보호책임자</strong>
        <br />
        • 이름: 선샤워 개인정보보호팀
        <br />
        • 이메일: privacy@sunshower.com
        <br />
        • 전화: 1588-0000
        <br />
        <br />
        귀하께서는 회사의 서비스를 이용하시며 발생하는 모든 개인정보보호 관련 민원을 개인정보
        보호책임자 혹은 담당부서로 신고하실 수 있습니다. 회사는 이용자들의 신고사항에 대해
        신속하게 충분한 답변을 드릴 것입니다.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "600", marginTop: 3, marginBottom: 1 }}>
        제11조 (개인정보 처리방침의 변경)
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.8, marginBottom: 3 }}>
        이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제
        및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
      </Typography>

      <Divider sx={{ marginY: 3 }} />

      <Typography variant="body2" sx={{ textAlign: "center", color: "#999" }}>
        부칙
        <br />
        본 개인정보처리방침은 2025년 1월 1일부터 시행됩니다.
      </Typography>
    </Box>
  );
};

export default PrivacyPolicy;
