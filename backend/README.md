# Sun Shower Backend API

날씨 정보와 길찾기 기능을 제공하는 백엔드 서버입니다.

## 🚀 시작하기

### 1. 패키지 설치

```bash
cd backend
npm install
```

### 2. 환경 변수 설정

`env.example` 파일을 복사하여 `.env` 파일을 만들고, API 키를 입력하세요.

```bash
cp env.example .env
```

#### 필요한 API 키:

**날씨 API (OpenWeatherMap)**

1. https://openweathermap.org/api 접속
2. 무료 계정 생성
3. API Key 발급 (무료 플랜: 60 calls/minute)
4. `.env` 파일의 `OPENWEATHER_API_KEY`에 입력

**길찾기 API (Kakao)**

1. https://developers.kakao.com 접속
2. 로그인 후 "내 애플리케이션" 생성
3. "앱 키" > "REST API 키" 복사
4. `.env` 파일의 `KAKAO_REST_API_KEY`에 입력

**MongoDB**

- 로컬: `mongodb://localhost:27017/sun-shower`
- 클라우드: MongoDB Atlas (https://www.mongodb.com/cloud/atlas)

### 3. MongoDB 설치 및 실행

#### Mac (Homebrew)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Windows

MongoDB 공식 사이트에서 다운로드: https://www.mongodb.com/try/download/community

#### MongoDB Atlas (클라우드 - 추천)

1. https://www.mongodb.com/cloud/atlas 접속
2. 무료 클러스터 생성 (512MB 무료)
3. 연결 문자열 복사
4. `.env` 파일의 `MONGODB_URI`에 입력

### 4. 서버 실행

```bash
# 개발 모드 (nodemon - 자동 재시작)
npm run dev

# 프로덕션 모드
npm start
```

서버가 http://localhost:5000 에서 실행됩니다.

## 📡 API 엔드포인트

### 날씨 API

#### 현재 날씨 조회

```
GET /api/weather/current?city=Seoul
GET /api/weather/current?lat=37.5665&lon=126.9780
```

**응답 예시:**

```json
{
  "location": {
    "name": "Seoul",
    "country": "KR",
    "coordinates": { "lat": 37.5665, "lng": 126.978 }
  },
  "weather": {
    "main": "Clear",
    "description": "맑음",
    "icon": "01d",
    "iconUrl": "https://openweathermap.org/img/wn/01d@2x.png"
  },
  "temperature": {
    "current": 15,
    "feelsLike": 13,
    "min": 12,
    "max": 18
  }
}
```

#### 5일 예보

```
GET /api/weather/forecast?city=Seoul
```

#### 여러 도시 날씨

```
POST /api/weather/multiple
Content-Type: application/json

{
  "cities": ["Seoul", "Busan", "Incheon"]
}
```

### 길찾기 API

#### 경로 검색 (주소)

```
GET /api/transportation/directions?origin=서울역&destination=강남역&mode=transit
```

**mode 옵션:**

- `transit`: 대중교통 (기본값)
- `driving`: 자동차
- `walking`: 도보

#### 경로 검색 (좌표)

```
GET /api/transportation/directions/coordinates?startLat=37.5665&startLng=126.9780&endLat=37.4979&endLng=127.0276
```

#### 장소 검색

```
GET /api/transportation/search?query=강남역
```

**응답 예시:**

```json
{
  "success": true,
  "places": [
    {
      "name": "강남역",
      "address": "서울 강남구 역삼동",
      "roadAddress": "서울 강남구 강남대로 지하396",
      "coordinates": { "lat": 37.4979, "lng": 127.0276 },
      "category": "교통,수송 > 지하철,전철 > 수도권2호선",
      "phone": "",
      "url": "http://place.map.kakao.com/..."
    }
  ]
}
```

### 즐겨찾기 API

#### 모든 즐겨찾기 조회

```
GET /api/favorites
GET /api/favorites?type=location
GET /api/favorites?type=route
```

#### 즐겨찾기 추가

```
POST /api/favorites
Content-Type: application/json

{
  "type": "location",
  "name": "집",
  "address": "서울시 강남구...",
  "coordinates": { "lat": 37.5665, "lng": 126.978 },
  "category": "home"
}
```

#### 즐겨찾기 삭제

```
DELETE /api/favorites/:id
```

#### 즐겨찾기 수정

```
PUT /api/favorites/:id
Content-Type: application/json

{
  "name": "우리집"
}
```

## 📁 프로젝트 구조

```
backend/
├── config/
│   └── database.js          # MongoDB 연결 설정
├── models/
│   ├── Favorite.js          # 즐겨찾기 스키마
│   └── SearchHistory.js     # 검색 기록 스키마
├── routes/
│   ├── weather.js           # 날씨 라우트
│   ├── transportation.js    # 길찾기 라우트
│   └── favorites.js         # 즐겨찾기 라우트
├── services/
│   ├── weatherService.js    # 날씨 API 서비스
│   └── transportationService.js  # 길찾기 API 서비스
├── .env                     # 환경 변수 (직접 생성)
├── .gitignore
├── env.example              # 환경 변수 예시
├── package.json
├── README.md
└── server.js               # 메인 서버 파일
```

## 🔧 MongoDB 스키마

### Favorite (즐겨찾기)

```javascript
{
  type: 'location' | 'route',
  name: String,
  address: String,
  coordinates: { lat: Number, lng: Number },
  origin: { ... },      // route인 경우
  destination: { ... }, // route인 경우
  category: 'home' | 'work' | 'school' | 'favorite' | 'other',
  createdAt: Date
}
```

### SearchHistory (검색 기록)

```javascript
{
  type: 'weather' | 'transportation',
  location: { ... },  // weather인 경우
  route: { ... },     // transportation인 경우
  searchedAt: Date
}
```

## 🌐 프론트엔드 연동

React 앱에서 API 사용 예시:

```typescript
// 날씨 조회
const getWeather = async (city: string) => {
  const response = await fetch(
    `http://localhost:5000/api/weather/current?city=${city}`
  );
  return response.json();
};

// 길찾기
const getDirections = async (origin: string, destination: string) => {
  const response = await fetch(
    `http://localhost:5000/api/transportation/directions?origin=${origin}&destination=${destination}`
  );
  return response.json();
};
```

## 📝 TODO: 추가 구현 가능 기능

- [ ] 사용자 인증 (JWT)
- [ ] 실시간 교통 정보
- [ ] 날씨 알림 기능
- [ ] 경로 공유 기능
- [ ] 캐싱 (Redis)
- [ ] API 요청 제한 (Rate Limiting)

## 🐛 문제 해결

### MongoDB 연결 오류

- MongoDB가 실행 중인지 확인: `brew services list` (Mac) 또는 서비스 관리자 (Windows)
- MongoDB Atlas 사용시 IP 화이트리스트 확인

### API 키 오류

- `.env` 파일이 `backend` 폴더에 있는지 확인
- API 키가 올바르게 입력되었는지 확인
- OpenWeatherMap: 키 발급 후 10분 정도 대기 필요

### CORS 오류

- 프론트엔드 주소가 다른 경우 `server.js`의 CORS 설정 확인

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 등록해주세요!
