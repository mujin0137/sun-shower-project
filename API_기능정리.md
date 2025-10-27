# 🗺️ Sun-Shower 프로젝트 API 기능 정리

## 📋 현재 사용 중인 API 목록

### 1️⃣ **OpenWeather API** ☀️

**API 키:** `OPENWEATHER_API_KEY`  
**발급처:** https://openweathermap.org/api

#### ✅ 구현된 기능:

- 현재 날씨 조회 (온도, 습도, 풍속 등)
- 도시별 날씨 조회 (한국 주요 도시 50개)
- 날씨 예보 조회
- 좌표 기반 날씨 조회

#### 🎯 활용:

- Weather 페이지에서 전국 주요 도시 날씨 표시
- 실시간 기온, 날씨 상태, 아이콘 표시

---

### 2️⃣ **Kakao REST API** 🗺️

**API 키:** `KAKAO_REST_API_KEY`  
**발급처:** https://developers.kakao.com

#### ✅ 구현된 기능:

- **Geocoding** (주소/장소명 → 좌표 변환)
  - 키워드 검색 (`/v2/local/search/keyword.json`)
  - 정확한 주소 검색 (`/v2/local/search/address.json`)
- **장소 검색** (키워드로 장소 찾기)
- **Kakao Maps SDK** (프론트엔드)
  - 지도 표시 (Dynamic Map) ✅
  - 마커 표시 ✅
  - Polyline 그리기 (경로 시각화) ✅
  - InfoWindow (정보창) ✅

#### 🎯 활용:

- Transportation 페이지에서 출발지/도착지 좌표 변환
- 지도에 경로 표시
- 마커로 출발지/도착지 표시

#### ⚠️ 현재 사용 **불가능**한 Kakao API 기능:

- **자동차 길찾기** (Kakao Mobility API 필요 - REST API와는 별도)
- **도보 길찾기** (Kakao Mobility API 필요)

---

### 3️⃣ **ODsay API** 🚇🚌

**API 키:** `ODSAY_API_KEY`  
**발급처:** https://lab.odsay.com

#### ✅ 구현된 기능:

- **대중교통 경로 검색**

  - 지하철만 이용 🚇
  - 버스만 이용 🚌
  - 지하철+버스 조합 🚇🚌
  - 기차 경로 (KTX, SRT, ITX, 무궁화) 🚄
  - 고속버스/시외버스 (코드 있지만 현재 비활성화)

- **경로 옵션**

  - 최적 경로 (OPT=0)
  - 최소 시간 (OPT=1)
  - 최소 환승 (OPT=2)
  - 최소 도보 (OPT=3)

- **경로 상세 정보**
  - 소요 시간
  - 요금
  - 환승 횟수
  - 도보 거리
  - 정류장 개수
  - 지하철 노선 정보 (색상 포함)
  - 버스 노선 정보 (번호, 종류)
  - 경로 좌표 (mapObj 파싱) - 지도에 빨간선 그리기용

#### 🎯 활용:

- Transportation 페이지 "대중교통" 탭
- 최대 3개 경로 추천
- 지도에 경로 시각화

---

### 4️⃣ **Naver Maps API** ⚠️ (설정되지 않음)

**API 키:** `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`  
**발급처:** https://www.ncloud.com

#### 🚫 **현재 상태:**

- env.example에 항목만 있고 실제 API 키가 설정되지 않음
- `getDrivingRoute()` 함수에 Naver API 코드가 구현되어 있지만 동작하지 않음

#### ⚠️ 사용 가능하려면:

1. Naver Cloud Platform에서 API 키 발급
2. `.env` 파일에 키 추가
3. 또는 Kakao Mobility API로 교체 (별도 발급 필요)

---

## 📊 기능별 API 매핑

| 기능          | 사용 API                    | 상태         |
| ------------- | --------------------------- | ------------ |
| 날씨 조회     | OpenWeather                 | ✅ 작동      |
| 장소 검색     | Kakao REST                  | ✅ 작동      |
| 좌표 변환     | Kakao REST                  | ✅ 작동      |
| 지도 표시     | Kakao Maps SDK              | ✅ 작동      |
| 대중교통 경로 | ODsay                       | ✅ 작동      |
| 자동차 경로   | Naver (또는 Kakao Mobility) | ❌ 미설정    |
| 도보 경로     | 직선 거리 계산 (Haversine)  | ✅ 간이 구현 |

---

## 🔧 개선 방안

### 자동차/도보 경로를 제대로 구현하려면:

#### 옵션 1: Kakao Mobility API 사용 (추천)

- **장점:** 이미 Kakao REST API 키가 있음, 통합 관리 용이
- **단점:** Kakao Mobility API는 별도 승인 필요
- **URL:** https://apis-navi.kakaomobility.com/v1/directions
- **필요 항목:** Authorization: `KakaoAK {REST_API_KEY}`

#### 옵션 2: Naver Directions API 사용

- **장점:** 정확한 자동차 경로, 실시간 교통 정보
- **단점:** 별도 Naver Cloud 가입 및 API 키 발급 필요
- **URL:** https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving

#### 옵션 3: TMAP API 사용

- **장점:** 무료, 정확한 자동차/도보 경로
- **단점:** 별도 가입 필요, 일일 호출 제한
- **URL:** https://apis.openapi.sk.com/

---

## 🎯 현재 프로젝트에서 100% 작동하는 기능

✅ **Weather 페이지**

- 전국 50개 주요 도시 날씨 조회
- 실시간 기온, 날씨 상태
- 도시 클릭 시 상세 정보

✅ **Transportation 페이지 - 대중교통**

- 지하철, 버스, 지하철+버스 경로 검색
- 최대 3개 경로 추천
- 지도에 경로 시각화 (빨간선)
- 출발지/도착지 마커 표시

❌ **Transportation 페이지 - 자동차/도보**

- API 키 미설정으로 현재 작동하지 않음
- Kakao Mobility API 또는 Naver API 설정 필요

---

## 📝 첨부하신 Kakao Maps API 표와 비교

### ✅ **현재 사용 가능:**

- Dynamic Map (지도 표시)
- Static Map (스크린샷용 - 구현 안 함)
- Geocoding (주소 → 좌표)
- Reverse Geocoding (좌표 → 주소)
- Map Style Editor (CSS 스타일링)

### ❌ **현재 사용 불가 (Kakao Mobility API 필요):**

- Directions (길찾기) - 자동차, 도보 경로
  - 이 기능은 Kakao REST API가 아닌 **Kakao Mobility API** 필요
  - REST API 키로는 지오코딩과 장소 검색만 가능

---

## 💡 결론

**현재 사용 가능한 API:**

1. ✅ OpenWeather (날씨)
2. ✅ Kakao REST (지오코딩, 장소 검색, 지도)
3. ✅ ODsay (대중교통 경로)

**추가 필요한 API:** 4. ❌ Kakao Mobility 또는 Naver Directions (자동차/도보 경로)

**자동차/도보 탭을 작동시키려면:**

- Kakao Mobility API 승인 신청 (추천)
- 또는 Naver Cloud API 키 발급
- 또는 TMAP API 가입
