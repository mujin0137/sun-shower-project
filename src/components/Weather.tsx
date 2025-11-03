import React, { useEffect, useState, useMemo } from "react";
import { ReactComponent as MyIcon } from "../images/weatherMap.svg";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  createTheme,
  ThemeProvider,
  IconButton,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { WbSunny, WbCloudy } from "@mui/icons-material";
import "../CSS/weather.css";

interface CityWeather {
  city: string;
  name: string;
  x: number;
  y: number;
  temperature?: number;
  weather?: string;
  description?: string;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
  iconUrl?: string;
}

interface WeatherDetail {
  location: {
    name: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  weather: {
    main: string;
    description: string;
    icon: string;
    iconUrl: string;
  };
  temperature: {
    current: number;
    feelsLike: number;
    min: number;
    max: number;
  };
  details: {
    humidity: number;
    pressure: number;
    visibility: number;
    windSpeed: number;
    windDeg: number;
    clouds: number;
  };
}

interface HourlyForecast {
  timestamp: string;
  weather: {
    main: string;
    description: string;
    icon: string;
    iconUrl: string;
  };
  temperature: {
    current: number;
  };
  details: {
    pop: number;
  };
}

interface DailyForecast {
  date: string;
  weather: {
    icon: string;
    iconUrl: string;
  };
  temperature: {
    min: number;
    max: number;
  };
  pop: number;
}

const theme = createTheme({
  typography: {
    fontFamily: "'Pretendard', 'RomanticGumi', sans-serif",
  },
});

const Weather = () => {
  const [loading, setLoading] = useState(true);
  const [citiesWeather, setCitiesWeather] = useState<CityWeather[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("Seoul");
  const [currentWeather, setCurrentWeather] = useState<WeatherDetail | null>(
    null
  );
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);

  // 주요 도시 목록 (이미지 상의 좌표)
  const majorCities = useMemo<CityWeather[]>(
    () => [
      { city: "Seoul", name: "서울", x: 52, y: 25 },
      { city: "Busan", name: "부산", x: 78, y: 70 },
      { city: "Incheon", name: "인천", x: 45, y: 28 },
      { city: "Daegu", name: "대구", x: 70, y: 55 },
      { city: "Daejeon", name: "대전", x: 55, y: 45 },
      { city: "Gwangju", name: "광주", x: 45, y: 65 },
      { city: "Ulsan", name: "울산", x: 78, y: 60 },
      { city: "Suwon", name: "수원", x: 50, y: 32 },
      { city: "Changwon", name: "창원", x: 72, y: 68 },
      { city: "Jeju", name: "제주", x: 45, y: 95 },
      { city: "Chuncheon", name: "춘천", x: 60, y: 18 },
      { city: "Gangneung", name: "강릉", x: 72, y: 25 },
      { city: "Jeonju", name: "전주", x: 50, y: 55 },
      { city: "Pohang", name: "포항", x: 75, y: 48 },
    ],
    []
  );

  // 지도 위 도시 날씨 데이터 가져오기
  useEffect(() => {
    const fetchCitiesWeather = async () => {
      try {
        const promises = majorCities.map((city) =>
          fetch(`http://localhost:5001/api/weather/current?city=${city.city}`)
            .then((res) => res.json())
            .then((data) => ({
              ...city,
              temperature: data.temperature?.current,
              weather: data.weather?.main,
              description: data.weather?.description,
              humidity: data.details?.humidity,
              windSpeed: data.details?.windSpeed,
              icon: data.weather?.icon,
              iconUrl: data.weather?.iconUrl,
            }))
            .catch((err) => {
              console.error(`${city.name} 날씨 가져오기 실패:`, err);
              return city;
            })
        );

        const results = await Promise.all(promises);
        setCitiesWeather(results);
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchCitiesWeather();
    const interval = setInterval(fetchCitiesWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [majorCities]);

  // 선택된 도시의 상세 날씨 + 예보 가져오기
  useEffect(() => {
    const fetchSelectedCityWeather = async () => {
      try {
        setLoading(true);

        // 현재 날씨
        const currentRes = await fetch(
          `http://localhost:5001/api/weather/current?city=${selectedCity}`
        );
        const currentData = await currentRes.json();
        setCurrentWeather(currentData);

        // 예보
        const forecastRes = await fetch(
          `http://localhost:5001/api/weather/forecast?city=${selectedCity}`
        );
        const forecastData = await forecastRes.json();

        // 시간별 예보 (6개)
        setHourlyForecast(forecastData.forecasts.slice(0, 6));

        // 일별 예보 (7일)
        const daily = processDailyForecast(forecastData.forecasts);
        setDailyForecast(daily);
      } catch (err: any) {
        console.error("날씨 정보 가져오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedCityWeather();
  }, [selectedCity]);

  // 시간별 예보를 일별로 그룹화
  const processDailyForecast = (forecasts: any[]): DailyForecast[] => {
    const dailyMap = new Map<string, any[]>();

    forecasts.forEach((item) => {
      const date = new Date(item.timestamp).toLocaleDateString("ko-KR");
      if (!dailyMap.has(date)) {
        dailyMap.set(date, []);
      }
      dailyMap.get(date)?.push(item);
    });

    const daily: DailyForecast[] = [];
    let count = 0;

    Array.from(dailyMap.entries()).forEach(([date, items]) => {
      if (count >= 7) return;

      const temps = items.map((i: any) => i.temperature.current);
      const pops = items.map((i: any) => i.details.pop);

      daily.push({
        date,
        weather: {
          icon: items[0].weather.icon,
          iconUrl: items[0].weather.iconUrl,
        },
        temperature: {
          min: Math.round(Math.min(...temps)),
          max: Math.round(Math.max(...temps)),
        },
        pop: Math.round(Math.max(...pops)),
      });

      count++;
    });

    return daily;
  };

  // 도시 변경 핸들러
  const handleCityChange = (event: SelectChangeEvent) => {
    setSelectedCity(event.target.value);
  };

  // 날짜 포맷팅
  const getDayLabel = (index: number) => {
    const labels = ["오늘", "내일", "모레", "3일뒤", "4일뒤", "5일뒤", "6일뒤"];

    return labels[index] || `${index}일뒤`;
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(true);
  const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);

  if (loading && !currentWeather) {
    return (
      <Box
        className="weather"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      className="weather"
      sx={{
        minHeight: "600px",
        mt: "25px",
        backgroundColor: { xs: "transparent", lg: "#fff" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column-reverse", lg: "row" },
          padding: "2.8% 5%",
        }}
      >
        {/* 왼쪽 영역 - 상세 정보 */}
        {/* ✅ 모바일: 드래그 가능한 바텀시트로 감싸기 */}
        {isMobile ? (
          <SwipeableDrawer
            anchor="bottom"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onOpen={() => setDrawerOpen(true)}
            PaperProps={{
              sx: {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                minHeight: "95vh",
                backgroundColor: "#fff",
              },
            }}
          >
            {/* 상단 드래그 바 */}
            <Box
              sx={{
                width: 40,
                height: 5,
                bgcolor: "#ccc",
                borderRadius: 2,
                mx: "auto",
                my: 1,
              }}
            />

            {/* 스크롤 가능한 영역 */}
            <Box sx={{ maxHeight: "100vh", overflowY: "hidden" }}>
              {/* 🔻 여기에 당신이 올린 Paper 코드 전체를 그대로 넣기 🔻 */}
              <Paper
                elevation={3}
                sx={{
                  flex: { xs: 1, lg: 1 },
                  minWidth: 0,
                  width: "100%",
                  backgroundColor: "#fff",
                  alignContent: "center",
                  borderRadius: "0px",
                  boxShadow: {
                    xs: "0px -4px 4px rgba(0, 0, 0, 0.25)",
                    lg: "none",
                  },
                }}
              >
                {/* 상세 정보 박스 시작 */}
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    mb: 2,
                    background: "transparent",
                    color: "balck",
                    boxShadow: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* 상단 오늘의 날씨 현황 */}
                  {currentWeather && (
                    <Paper
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 3,
                        alignItems: "center",
                        justifyContent: "center",
                        p: 5,
                        width: "100%",
                        backgroundColor: "transparent",
                        boxShadow: "none",
                        boxSizing: "border-box",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          alignItems: "center",
                          width: "100%",
                          alignContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          {/* 오늘의 날씨 아이콘 */}
                          <Box sx={{ display: "flex" }}>
                            <img
                              src={currentWeather.weather.iconUrl}
                              alt={currentWeather.weather.description}
                              style={{
                                width: 130,
                                height: 130,
                                marginRight: 6,
                              }}
                            />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignContent: "center",
                            }}
                          >
                            {/*도시 선택*/}
                            <Select
                              value={selectedCity}
                              onChange={handleCityChange}
                              sx={{
                                color: "black",
                                fontSize: "0.8rem",
                                textAlign: "center",
                                "& .MuiSelect-icon": {
                                  color: "Black",
                                  fontSize: 12,
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none",
                                },
                              }}
                              fullWidth
                            >
                              {majorCities.map((city) => (
                                <MenuItem key={city.city} value={city.city}>
                                  {city.name}
                                </MenuItem>
                              ))}
                            </Select>
                            <Typography
                              variant="h2"
                              sx={{
                                fontWeight: "bold",
                                mb: 1,
                                fontSize: "150%",
                                textAlign: "center",
                                fontFamily: "RomanticGumi",
                              }}
                            >
                              {currentWeather.temperature.current}°
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                mb: 2,
                                opacity: 0.9,
                                fontSize: 12,
                                textAlign: "center",
                              }}
                            >
                              습도 {currentWeather.details.humidity}%
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          sx={{
                            backgroundColor: "#555396",
                            color: "#ffffff",
                            width: "70%",
                            padding: "2%",
                            fontSize: "75%",
                            alignContent: "center",
                            textAlign: "center",
                            borderRadius: "20px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          대기정체에 주의하세요.
                        </Typography>
                        {/*최고/최저온도*/}
                        <Typography
                          variant="body2"
                          sx={{ opacity: 0.8, fontSize: "75%" }}
                        >
                          최고 {currentWeather.temperature.max}° / 최저{" "}
                          {currentWeather.temperature.min}°
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: "70%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                          p: 1,
                          fontFamily: "Pretendard",
                        }}
                      >
                        {/* 초미세먼지 */}
                        <Box
                          sx={{
                            display: "flex", // flex 컨테이너 설정
                            flexDirection: "column", // 위아래로 정렬
                            alignItems: "center", // 수평 중앙
                            justifyContent: "center", // 수직 중앙
                            py: 1,
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "75%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            초미세먼지
                          </Typography>
                          <Box
                            sx={{
                              backgroundColor: "#FFBB4E",
                              width: "80%",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mt: 0.5,
                              borderRadius: 10,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "75%" }}
                              fontWeight="bold"
                            >
                              보통
                            </Typography>
                          </Box>
                        </Box>

                        {/* 미세먼지 */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            py: 1,
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "75%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            미세먼지
                          </Typography>
                          <Box
                            sx={{
                              backgroundColor: "#63A465",
                              width: "100%",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mt: 0.5,
                              borderRadius: 10,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "75%" }}
                              fontWeight="bold"
                            >
                              좋음
                            </Typography>
                          </Box>
                        </Box>

                        {/* 자외선 */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            py: 1,
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "75%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            자외선
                          </Typography>
                          <Box
                            sx={{
                              backgroundColor: "#FF7A00",
                              width: "135%",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mt: 0.5,
                              borderRadius: 10,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "75%" }}
                              fontWeight="bold"
                            >
                              주의
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  )}
                  {/* 시간별 예보 */}
                  <Paper
                    elevation={3}
                    sx={{
                      p: 1,
                      mt: 3,
                      mb: 5,
                      backgroundColor: "#D9D9D9",
                      position: "relative",
                      width: "100%",
                      boxShadow: "none",
                    }}
                  >
                    {/* 클릭 버튼 */}
                    <IconButton
                      sx={{
                        position: "absolute",
                        backgroundColor: "#ABABAB",
                        width: "1.8rem",
                        height: "1.8rem",
                        textAlign: "center",
                        left: "96%",
                        top: "40%",
                        display: { xs: "none", sm: "flex" },

                        "&:hover": {
                          backgroundColor: "#ABABAB",
                        },
                        "&:active": {
                          backgroundColor: "#ABABAB",
                        },
                        "&:focusVisible": {
                          backgroundColor: "#ABABAB",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          textDecoration: "none",
                          color: "Black",
                          fontFamily: "RomanticGumi",
                          fontSize: "75%",
                        }}
                      >
                        {">"}
                      </Typography>
                    </IconButton>

                    {/* 24시간 날씨 */}
                    <Box
                      sx={{
                        display: "flex",
                        // backgroundColor: "red",
                        overflowX: "auto",
                        gap: 2,
                        "&::-webkit-scrollbar": { display: "none" },
                        scrollbarWidth: "none",
                        flexDirection: "row",
                      }}
                    >
                      {hourlyForecast.map((item, index) => {
                        const hour = new Date(item.timestamp).getHours();
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              justifyContent: "space-between",
                            }}
                          >
                            <Box
                              key={index}
                              sx={{
                                minWidth: 60,
                                textAlign: "center",
                                borderRadius: 2,
                                p: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "block",
                                  fontFamily: "Pretendard",
                                  fontSize: "80%",
                                }}
                              >
                                {hour}시
                              </Typography>
                              <img
                                src={item.weather.iconUrl}
                                alt={item.weather.description}
                                style={{ width: 40, height: 40 }}
                              />
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                sx={{
                                  fontFamily: "Pretendard",
                                  fontSize: "80%",
                                }}
                              >
                                {Math.round(item.temperature.current)}°
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </Paper>

                  {/* 주간 예보 */}
                  {dailyForecast.map((day, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        textAlign: "center",
                        flexDirection: "",
                        width: "100%",
                        p: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 3,
                          justifyContent: "space-between",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ width: 60, fontWeight: "bold" }}
                        >
                          {getDayLabel(index)}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textAlign: "center" }}
                        >
                          {day.pop}%
                        </Typography>

                        <WbSunny sx={{ fontSize: 20, color: "#FFA500" }} />
                        <WbCloudy sx={{ fontSize: 20, color: "#808080" }} />

                        <Typography variant="body2" fontWeight="bold">
                          {day.temperature.max}°
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          {day.temperature.min}°
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </Paper>
            </Box>
          </SwipeableDrawer>
        ) : (
          // ✅ PC: 기존 코드 그대로 보여주기
          <Paper
            elevation={3}
            sx={{
              flex: { xs: 1, lg: 1 },
              minWidth: 0,
              width: "100%",
              backgroundColor: "#fff",
              alignContent: "center",
              borderRadius: "10px",
              boxShadow: { xs: "0px -4px 4px rgba(0, 0, 0, 0.25)", lg: "none" },
              padding: "0 30px",
            }}
          >
            {/* 상단 오늘의 날씨 현황 */}
            {currentWeather && (
              <Paper
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 3,
                  alignItems: "center",
                  justifyContent: "center",
                  p: 5,
                  width: "100%",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  boxSizing: "border-box",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: "center",
                    width: "100%",
                    alignContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    {/* 오늘의 날씨 아이콘 */}
                    <Box sx={{ display: "flex" }}>
                      <img
                        src={currentWeather.weather.iconUrl}
                        alt={currentWeather.weather.description}
                        style={{ width: 130, height: 130, marginRight: 6 }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignContent: "center",
                      }}
                    >
                      {/*도시 선택*/}
                      <Select
                        value={selectedCity}
                        onChange={handleCityChange}
                        sx={{
                          color: "black",
                          fontSize: "0.8rem",
                          textAlign: "center",
                          "& .MuiSelect-icon": { color: "Black", fontSize: 12 },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                        fullWidth
                      >
                        {majorCities.map((city) => (
                          <MenuItem key={city.city} value={city.city}>
                            {city.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: "bold",
                          mb: 1,
                          fontSize: "150%",
                          textAlign: "center",
                          fontFamily: "RomanticGumi",
                        }}
                      >
                        {currentWeather.temperature.current}°
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 2,
                          opacity: 0.9,
                          fontSize: 12,
                          textAlign: "center",
                        }}
                      >
                        습도 {currentWeather.details.humidity}%
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      backgroundColor: "#555396",
                      color: "#ffffff",
                      width: "70%",
                      padding: "2%",
                      fontSize: "75%",
                      alignContent: "center",
                      textAlign: "center",
                      borderRadius: "20px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    대기정체에 주의하세요.
                  </Typography>
                  {/*최고/최저온도*/}
                  <Typography
                    variant="body2"
                    sx={{ opacity: 0.8, fontSize: "75%" }}
                  >
                    최고 {currentWeather.temperature.max}° / 최저{" "}
                    {currentWeather.temperature.min}°
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "70%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                    fontFamily: "Pretendard",
                  }}
                >
                  {/* 초미세먼지 */}
                  <Box
                    sx={{
                      display: "flex", // flex 컨테이너 설정
                      flexDirection: "column", // 위아래로 정렬
                      alignItems: "center", // 수평 중앙
                      justifyContent: "center", // 수직 중앙
                      py: 1,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "75%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      초미세먼지
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "#FFBB4E",
                        width: "80%",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 0.5,
                        borderRadius: 10,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "75%" }}
                        fontWeight="bold"
                      >
                        보통
                      </Typography>
                    </Box>
                  </Box>

                  {/* 미세먼지 */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 1,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "75%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      미세먼지
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "#63A465",
                        width: "100%",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 0.5,
                        borderRadius: 10,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "75%" }}
                        fontWeight="bold"
                      >
                        좋음
                      </Typography>
                    </Box>
                  </Box>

                  {/* 자외선 */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 1,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "75%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      자외선
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "#FF7A00",
                        width: "135%",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 0.5,
                        borderRadius: 10,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "75%" }}
                        fontWeight="bold"
                      >
                        주의
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            )}
            {/* 시간별 예보 */}
            <Paper
              elevation={3}
              sx={{
                p: 1,
                mt: 3,
                mb: 5,
                backgroundColor: "#D9D9D9",
                position: "relative",
                width: "100%",
                boxShadow: "none",
              }}
            >
              {/* 클릭 버튼 */}
              <IconButton
                sx={{
                  position: "absolute",
                  backgroundColor: "#ABABAB",
                  width: "1.8rem",
                  height: "1.8rem",
                  textAlign: "center",
                  left: "96%",
                  top: "40%",
                  display: { xs: "none", sm: "flex" },

                  "&:hover": {
                    backgroundColor: "#ABABAB",
                  },
                  "&:active": {
                    backgroundColor: "#ABABAB",
                  },
                  "&:focusVisible": {
                    backgroundColor: "#ABABAB",
                  },
                }}
              >
                <Typography
                  sx={{
                    textDecoration: "none",
                    color: "Black",
                    fontFamily: "RomanticGumi",
                    fontSize: "75%",
                  }}
                >
                  {">"}
                </Typography>
              </IconButton>

              {/* 24시간 날씨 */}
              <Box
                sx={{
                  display: "flex",
                  // backgroundColor: "red",
                  overflowX: "auto",
                  gap: 2,
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                  flexDirection: "row",
                }}
              >
                {hourlyForecast.map((item, index) => {
                  const hour = new Date(item.timestamp).getHours();
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        key={index}
                        sx={{
                          minWidth: 60,
                          textAlign: "center",
                          borderRadius: 2,
                          p: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            fontFamily: "Pretendard",
                            fontSize: "80%",
                          }}
                        >
                          {hour}시
                        </Typography>
                        <img
                          src={item.weather.iconUrl}
                          alt={item.weather.description}
                          style={{ width: 40, height: 40 }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{ fontFamily: "Pretendard", fontSize: "80%" }}
                        >
                          {Math.round(item.temperature.current)}°
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Paper>

            {/* 주간 예보 */}
            {dailyForecast.map((day, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textAlign: "center",
                  flexDirection: "",
                  width: "100%",
                  p: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    justifyContent: "space-between",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ width: 60, fontWeight: "bold" }}
                  >
                    {getDayLabel(index)}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
                    {day.pop}%
                  </Typography>

                  <WbSunny sx={{ fontSize: 20, color: "#FFA500" }} />
                  <WbCloudy sx={{ fontSize: 20, color: "#808080" }} />

                  <Typography variant="body2" fontWeight="bold">
                    {day.temperature.max}°
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    {day.temperature.min}°
                  </Typography>
                </Box>
              </Box>
            ))}

            {/* 🔻 여기에 당신이 올린 Paper 코드 전체 그대로 🔻 */}
          </Paper>
        )}

        {/* 오른쪽 영역 - 지도 */}
        <Box sx={{ flex: { xs: 1, lg: 2 } }}>
          <Paper
            elevation={3}
            sx={{
              height: { xs: 700, lg: "100%" },
              minHeight: 700,
              position: "relative",
              overflow: "hidden",
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            {/* 한국 지도 영역 */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              <svg
                width="395"
                height="613"
                viewBox="0 0 395 613"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M49.5 269.836C46.7308 270.856 55 274.862 55.25 271.126C55.5 267.679 51.2308 269.181 49.5 269.836Z"
                  fill="#D6D6D6"
                  stroke="#D6D6D6"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M46.2885 272.224C48.5192 272.07 47.6154 276.21 45.8269 276.037C44.0192 275.844 44.7885 272.339 46.2885 272.224Z"
                  fill="#D6D6D6"
                  stroke="#D6D6D6"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M172.538 309.234C170.692 307.674 169.673 303.862 168.5 301.609C166.635 298.008 168.346 296.256 167.538 292.616C166.846 289.477 165.173 290.613 163.558 288.726C162.423 287.398 162.5 285.549 161.212 284.336C160.173 283.354 158.538 283.469 157.404 282.622C157.154 283.739 152.673 291.403 151.558 291.442C148.154 291.576 147.231 284.009 145.231 281.216C141.385 283.45 144.481 289.381 141.923 292.404C136.712 289.574 136.692 282.603 133.846 278.097C133.865 277.75 133.885 277.404 133.904 277.057C134.308 275.728 133.635 275.112 131.865 275.17C131.135 274.092 130.404 273.918 129.788 272.667C128.173 269.355 130.019 265.33 128.135 261.787C126.596 258.918 124.096 257.994 123.615 254.547C123.173 251.427 125.058 247.73 125.135 244.495C125.231 240.528 119.942 228.936 126.288 228.07C128.231 227.8 132.096 231.266 133.75 231.959C139.615 234.386 137.962 231.844 141.096 227.935C142.923 225.643 142.712 225.99 145.308 225.932C146.462 225.913 146.692 227.665 148.154 226.856C149.596 226.067 149.115 224.084 148.827 222.774C147.808 218.095 141.212 215.784 138.577 212.395C137.288 210.739 136.423 209.391 135.288 208.139C132.769 205.328 131.327 205.829 128.538 204.307C126.865 203.383 125.75 201.034 123.904 200.475C121.692 199.802 119.25 201.458 117.25 202.17C110.808 204.5 104.808 205.54 98.6346 208.178C94.4038 209.988 96.3846 211.798 94.5385 214.282C93.5962 215.553 93.2692 216.15 92.2885 214.205C89.5577 208.775 93.5577 201.169 85.7885 198.088C84.3846 197.529 80.7692 196.22 79.6154 196.085C78.5769 195.97 77.3077 196.489 76.25 196.355C71.9423 195.796 72.8077 194.776 69.25 192.735C68.6154 192.369 67.2692 192.311 66.7885 191.964C67.0192 192.138 62.7885 189.114 63.1923 189.268C61.2885 188.575 59.7692 188.19 58.3269 190.019C55.7308 193.331 59.3462 194.622 59.6154 197.491C59.8077 199.513 60.6346 199.782 58.25 199.359C57.9808 199.301 56.7308 196.489 56.2115 196.066C54.2115 194.468 52.3077 194.082 49.7308 194.14C47.4808 194.179 43.6154 194.429 43.6346 197.298C43.6346 196.913 48.3462 203.383 48.5962 203.633C50.1538 205.135 53.5577 203.537 53.5 206.849C53.4423 209.815 49.6346 208.756 47.9423 209.969C47.0577 210.585 48 211.625 47.3462 212.434C46.5 213.454 45.2308 213.589 44.3269 214.436C42.9615 215.726 43.4231 217.96 41.3077 216.92C38.6154 215.592 42.6538 210.874 42.8462 209.295C43.25 205.944 41.0962 201.92 41.0385 198.473C39.2115 197.414 38.3077 210.989 36.7115 211.625C32.75 213.185 34.25 206.888 31.7115 206.58C27.9231 206.137 31.8654 217.363 31.6731 217.69C30.4423 219.674 28.6346 216.227 27.9615 216.362C24.2115 217.171 28.0385 216.497 25.8462 219.096C24.5385 220.637 23.2308 222.582 22.8462 224.488C22.9615 223.929 23.6538 228.705 23.2885 227.954C23.6154 228.609 21.8462 231.17 24.5385 230.13C26.1538 229.494 25.1731 226.779 26.5192 226.086C28.3654 225.123 31.25 226.51 31.2885 228.666C31.3077 230.149 23.3846 232.229 27.4231 234.251C31.3654 236.234 32.9615 228.686 35.6731 228.898C38.1154 229.071 36.0769 230.111 36.75 231.439C36.4231 232.19 36.3269 232.98 36.4808 233.808C36.7885 234.617 37.3654 235.04 38.2308 235.079C39.2308 237.12 40.3269 235.907 40.3654 238.776C40.4038 240.836 38.25 241.607 39.1538 243.783C39.6923 245.073 41.9808 245.535 42.7308 247.249C43.6923 249.463 42.9231 253.411 43.3077 255.856C43.9808 260.035 44.6346 266.177 49.8846 266.524C56.0577 266.909 54 260.805 52.5 256.684C50.9038 252.294 49.6538 247.769 48.0769 243.417C47.6538 242.261 42.2885 230.284 44.9423 230.9C46.6154 231.285 46.1731 235.579 46.5192 236.696C47.3269 239.334 47.75 240.066 50.0192 241.356C55.5 244.437 53.4231 240.278 54.3269 236.542C56.0385 229.398 56.9615 239.007 56.6731 241.78C56.0769 247.46 58.0192 251.446 58.7885 256.761C59.0385 258.591 60.1154 260.612 60.2692 262.268C60.4615 264.348 58.6731 267.082 59.3269 269.008C59.9615 270.857 62.4615 270.549 63.2885 271.858C65.1731 274.9 63.5962 272.378 62.7692 274.361C61.8462 276.595 60.0192 274.9 61.0769 278.501C61.5769 280.234 64.4808 280.716 64.5 282.969C64.5192 284.644 62.3269 285.068 62.2885 286.55C62.25 288.553 64.3654 288.996 64.1154 290.883C63.9231 292.385 58.8077 295.678 59.6346 297.257C60.6154 299.125 62.5 297.141 64 297.469C65.5 297.796 66.6923 298.778 68 299.722C69.9808 301.127 72.0769 302.244 73.2115 304.998C74.6346 308.425 74.0577 313.779 79.6731 313.567C81.9808 313.49 82.5577 312.2 84.5 311.352C86.3461 310.544 88.6346 310.775 90.2115 310.158C94.75 308.368 95.9423 303.168 98.4808 299.645C102.346 294.272 105.692 296.949 111.135 297.218C112.615 297.295 115.288 296.313 116.635 297.045C118.538 298.085 118.635 301.204 120.75 302.514C124.788 305.017 131.981 303.477 135.904 301.878C138.846 300.684 138.404 299.259 140.635 301.455C141.058 301.878 140.635 303.65 141 304.285C141.865 305.73 142.731 305.941 143.962 307.077C148.038 310.852 150.558 315.338 156.712 315.569C158.481 315.646 173.808 310.332 172.577 309.292L172.538 309.234Z"
                  fill="#D6D6D6"
                  stroke="#D6D6D6"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M53.0769 187.035C55.0385 187.42 57.1731 190.982 53.9808 190.809C51.8077 190.693 51.1923 186.65 53.0769 187.035Z"
                  fill="#D6D6D6"
                  stroke="#D6D6D6"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M393.269 90.2727C388.827 97.4552 375.308 89.3291 381.981 83.5523C387.615 78.6612 398.385 81.9926 393.269 90.2727Z"
                  fill="#808080"
                  stroke="#808080"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M37.25 365C35.25 366.136 35.9808 360.206 38.8269 359.301C44.7885 357.413 39.4615 363.749 37.25 365Z"
                  fill="#B8B8B8"
                  stroke="#B8B8B8"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M105.635 577.491C106.769 580.669 103.135 580.149 102.308 578.242C101.385 576.105 104.769 575.065 105.635 577.491Z"
                  fill="#808080"
                  stroke="#808080"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M88.4039 571.561C82.0385 572.215 76.7692 573.236 70.8077 575.335C65.7885 577.106 61.2115 575.951 56.0769 578.031C48.3269 581.169 41.4039 582.46 35.3846 588.699C32.4615 591.722 28 594.899 27.5385 599.155C26.9615 604.412 31.2308 608.263 35.1154 611.017C41.4039 615.465 38.3846 609.245 43.4808 607.839C43.8846 607.724 47.8846 608.378 48.3846 608.417C49.8654 608.532 50.9615 608.321 52.7115 608.648C53.4039 608.783 54.8077 608.552 55.5962 608.59C56.1154 609.283 56.7885 609.688 57.6154 609.823C58.5 609.264 59.4231 608.802 60.4039 608.436C64.25 608.051 67.6731 609.784 71.3077 608.051C72.1346 607.127 72.9423 606.164 73.7308 605.201C74.7115 604.373 75.7692 604.277 76.8846 604.893C78.2308 604.431 80.2308 603.892 81.8462 603.41C82.5 603.218 84.8654 602.852 85.3654 602.736C85.5192 601.523 86.25 601.003 87.5577 601.196C88.6923 601.716 89.8462 601.754 91 601.331C94.1731 599.983 94.7308 596.363 96.4423 593.975C98.9615 590.47 101.788 589.661 101.173 584.905C100.731 581.362 99.3654 577.357 96.4231 575.508C96.0192 575.258 93.1539 574.661 92.4231 574.314C90.6346 573.467 91.1539 571.214 88.4039 571.503V571.561Z"
                  fill="#808080"
                  stroke="#808080"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M187.827 495.576C188.654 497.425 186.404 501.392 185.558 498.445C185.212 497.29 186.788 493.227 187.827 495.576Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M22.8462 422.268C23.7115 427.409 13.6346 425.041 16.9231 420.015C17.4423 419.206 23.2115 413.699 24.4038 415.163C25.1154 416.048 22.5769 420.651 22.8462 422.268Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M27.6154 427.044C26.6346 426.524 20.5962 425.888 26.0192 424.406C30.1923 423.27 31.2115 428.969 27.6154 427.044Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M23.5769 431.126C19.9808 430.721 24.4423 426.658 27.3462 429.72C28.4038 430.837 29.5 431.973 27.6154 433.109C25.9808 434.091 25.1923 431.318 23.5769 431.126Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M37.25 430.991C38.7885 431.434 38.4808 433.34 37 433.591C34.2885 434.053 35.2692 430.413 37.25 430.991Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M9 458.489C7.86539 459.201 6.26923 458.72 5.28846 459.664C4.5 460.434 5.75 462.244 4.61539 463.11C1.67308 465.421 -0.442307 460.415 1.65385 458.162C2.55769 457.18 3.92308 457.988 4.82692 457.391C5.30769 457.064 6.63462 455.639 7.11539 455.447C8.57692 454.869 9.21154 452.385 10.4808 454.445C11.0385 455.35 9.75 458.008 9.01923 458.47L9 458.489Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M6.88461 465.575C5.90384 466.48 4.57692 465.71 3.84615 467.058C2.5 469.542 4.94231 470.351 6.76923 470.293C11.9423 470.12 11.5577 461.339 6.88461 465.575Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M14.5962 481.269C11.6731 481.673 10.9615 474.009 14.3269 474.298C13.5577 474.24 15.6154 477.957 15.5577 477.61C15.7692 478.727 18.0962 480.787 14.5962 481.269Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M18.7115 478.4C19.0385 480.711 13.2308 487.874 19.3654 483.041C21.0769 481.693 22.5577 480.595 21.6346 477.841C21.7692 478.265 17.7692 474.106 18.1538 474.26C15.2115 473.027 18.75 478.65 18.7308 478.4H18.7115Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M24.8462 471.448C23.8846 472.97 22.1923 473.701 24.2885 475.338C23.7885 474.953 28.3077 474.837 27.9038 475.184C30.5192 473.047 26.8846 468.194 24.8462 471.448Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M18.6731 445.549C18.1923 447.474 15.9423 447.802 14.5 446.569C12.3462 444.74 14.8462 442.41 15.4808 441.62C19.6154 436.421 19.7692 441.216 18.6731 445.549Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M26.3654 445.164C27.9808 445.934 24.3462 450.267 22.7115 446.955C21.3462 444.182 24.8654 444.451 26.3654 445.164Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M21.1731 448.996C20.5192 449.188 15.1923 448.668 17.9615 451.73C20.7885 454.869 24.2885 448.033 21.1731 448.996Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M22.9423 457.103C18.7885 458.547 24.3269 453.251 25.7692 453.559C27.2115 453.887 27.9231 454.772 27.4808 456.448C26.6923 459.355 24.5962 456.544 22.9615 457.103H22.9423Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M19.75 462.667C20.4423 464.381 21.7115 463.072 22.7308 463.495C21.8654 463.149 26.4423 464.978 25.6731 465.036C27.1538 464.92 28.8269 465.344 28.1346 462.302C27.3269 458.797 17.7308 457.622 19.7692 462.687L19.75 462.667Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M35.4231 439.445C37.4038 441.101 33.6538 442.006 32.5769 441.101C32.3462 440.908 30.1154 437.557 32.1154 437.904C32.1923 437.904 35.3654 439.406 35.4231 439.445Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M39.4231 436.633C38.1731 432.108 36.0192 439.04 38.8462 439.175C39.5962 438.54 39.7885 437.673 39.4231 436.633Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M41.1923 441.389C40.4231 441.601 38.6154 445.26 37.5 446.126C35.9615 447.301 30.8269 448.63 35.7692 449.65C37.2692 449.958 42.3654 447.725 43.1923 446.685C44.6346 444.894 44.75 440.407 41.2115 441.389H41.1923Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M46.3654 450.729C46.7885 448.302 46.6346 444.355 44.2308 448.148C42.3269 451.152 45.3846 456.294 46.3654 450.729Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M40.9615 457.468C41.1731 455.831 43.9231 456.39 43.6346 457.911C43.3846 459.259 40.7692 458.97 40.9615 457.468Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M40.1731 425.176C39.4615 425.465 36.4423 426.023 36.2885 426.061C35.4038 426.273 36.2115 427.987 34.4808 427.814C33.9038 427.756 33.8654 425.426 33.4231 425.06C32.1923 424.059 30.5 424.656 29.0577 423.385C26.8654 421.459 27.0577 419.572 30.0962 418.879C31.3077 418.609 33.2692 420.419 34.25 419.919C35.3462 419.341 34.8269 417.916 35.4038 417.415C36.9808 416.01 34.0769 416.241 37.6731 414.739C38.5192 414.373 39.1731 414.797 39.9808 414.739C42.0962 414.566 43.4808 414.604 44.5769 416.222C46.0385 418.398 44.0769 420.381 43.7308 421.074C43.9231 420.689 42.3462 421.209 42.1154 421.479C40.9423 422.807 42.7115 424.155 40.1923 425.233L40.1731 425.176Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M10.8654 508.478C9.30769 509.999 13.8654 510.211 14.3654 510.711C16.1346 512.521 13.2885 514.274 17.0385 514.794C19.6346 515.159 21.8077 513.253 20.5385 511.135C19.8077 509.922 11.7692 507.611 10.8846 508.478H10.8654Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M40.5192 482.463C39.9615 480.672 36.9808 479.093 35.4808 480.768C34.6923 481.635 36.4615 483.483 35.7692 484.735C35.2308 485.717 31.7692 486.969 30.6731 487.874C29.0769 489.164 27.3846 490.839 25.6154 492.226C22.2692 494.864 17.9615 499.293 22.3462 503.086C22.6731 503.356 26.75 505.243 27.0192 505.281C29.5962 505.705 29.2885 504.858 31.5577 504.415C32.8269 504.165 34.1731 503.645 35.7115 503.683C35.2115 503.683 39.9615 504.011 38.8846 504.222C41.5385 503.683 42.5577 501.738 44.6731 499.235C45.4038 498.369 46.6346 497.309 47.1154 496.193C47.3462 495.653 48.1731 489.857 48.0577 489.357C47.3846 486.314 44.25 483.792 40.5192 482.463Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M68.9808 525.038C70.3846 523.94 71.7115 525.847 71.4808 522.592C71.3077 520.185 67.3654 519.473 65.8654 520.898C63.0192 523.594 65.75 527.522 68.9808 525.038Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M64.0577 532.74C59.2692 533.53 59.8269 528.619 63.2115 527.83C66.3269 527.117 68.75 531.97 64.0577 532.74Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M75.2692 525.789C73.1154 527.098 71.5 535.648 75.9231 533.973C77.0577 533.549 79.0385 523.497 75.2692 525.789Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M87.3846 525C86.9231 525.366 85.75 526.906 85.5385 527.022C84.3462 527.696 83.9615 523.671 84.9423 522.804C86.1731 521.707 88.6538 523.998 87.3846 525Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M99.2115 522.901C97.3846 522.246 96.1346 522.901 95.1154 524.249C92.5385 527.676 94.75 527.695 96.5 528.658C101.462 531.393 103.808 524.557 99.2115 522.901Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M102.077 547.548C103.904 548.357 102.481 551.65 100.827 550.976C98.3462 549.955 99.3269 546.335 102.077 547.548Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M136.288 543.813C134.538 540.289 136.5 540.462 138.365 540.828C143.577 541.887 138.096 547.452 136.288 543.813Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M134.423 519.993C133.654 520.59 130.75 524.923 130.5 520.917C130.212 516.334 136.231 518.626 134.423 519.993Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M79.2115 512.002C70.4038 507.65 75 495.48 81.3654 501.43C82.9038 502.874 82.0577 504.28 82.6346 506.051C83.1154 507.515 84.6731 509.094 85 510.538C86.0962 515.352 82.1346 513.446 79.2115 512.002Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M86.1538 508.497C85.3269 510.114 89.0192 509.941 89.4423 510.114C90.2115 510.114 90.9615 509.999 91.7115 509.826C92.7115 509.999 93.1154 510.5 92.9615 511.366C94.2308 511.636 93.5962 512.579 95.8846 511.616C95.4423 511.809 97.7308 508.612 97.4808 509.479C97.75 508.574 98.1923 506.128 95.0962 506.032C93.3462 505.974 93.1346 507.804 91.6346 508.131C90.0385 508.497 87.25 506.359 86.1538 508.497Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M91.8461 503.798C82.75 505.108 83.75 499.215 90.4038 497.251C93.1346 496.443 93.9808 496.943 94.0769 499.986C94.1154 501.064 95.2692 503.298 91.8461 503.779V503.798Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M96.25 503.491C97.1154 505.532 102.288 506.899 103.5 504.53C105.423 500.718 94.5962 499.582 96.25 503.491Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M110.154 510.23C109.462 507.341 104.019 507.245 104.788 510.673C105.288 512.907 110.558 511.924 110.154 510.23Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M116.096 506.899C115.865 505.493 108.442 502.663 109.788 506.244C110.288 507.554 116.615 510.269 116.096 506.899Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M114.538 494.363C116.885 495.307 116.058 499.004 113.75 498.233C111.038 497.328 111.269 493.054 114.538 494.363Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M128.885 497.251C126.327 498.022 120.538 498.214 119.058 495.48C117.519 492.63 119.75 491.34 122.365 490.608C122.692 490.512 125.692 490.55 126.327 490.55C127.808 490.55 128.442 489.51 130 490.666C132.212 492.303 131.519 496.5 128.885 497.271V497.251Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M158.038 493.978C165.077 495.595 160.673 503.067 156 499.87C156.25 500.044 154.288 495.095 154.212 495.672C154.442 493.862 154.808 493.227 158.038 493.978Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M152.865 485.332C153.212 485.197 153.538 485.043 153.885 484.908C155.269 485.544 153.481 488.047 154.308 489.029C154.865 489.684 157.058 488.162 157.904 489.607C158.519 490.647 147.5 491.763 152.846 485.351L152.865 485.332Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M179.923 488.105C178.154 486.93 177.25 484.119 179.635 482.944C182.385 481.596 181.346 483.946 182.481 485.12C185.731 488.471 184.904 491.417 179.923 488.105Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M178.654 443.084C182.827 443.007 178.25 445.972 178.25 445.838C178.25 445.491 175.385 443.161 178.654 443.084Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M178.25 439.676C178.077 440.581 182.327 442.737 183.25 441.543C184.269 440.195 178.846 436.556 178.25 439.676Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M182.635 467.924C182.269 471.737 175.962 471.429 178.75 476.994C178.25 476.012 181.692 478.4 181.346 478.227C183.077 479.151 183.712 482.155 185.885 479.536C186.519 478.766 187.096 471.545 186.885 470.851C186.827 470.64 182.462 467.385 182.923 466.808C182.827 467.173 182.731 467.559 182.635 467.924Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M182.769 464.554C183.596 464.651 188.288 467.597 185.231 463.842C182.365 460.337 181.442 464.381 182.769 464.554Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M183.962 426.1C183.077 424.02 181.135 423.635 179.615 422.23C177.731 420.477 177.673 418.975 176.288 416.973C174.308 414.142 171.288 413.68 168.942 411.369C163 405.496 167.115 393.249 157.846 389.648C156.154 388.994 153.827 388.82 152.096 389.513C149.808 390.418 149.846 392.556 148.038 393.519C146.173 394.52 145.827 393.153 144.231 393.48C143.115 393.711 141.962 394.636 140.942 394.905C138.404 395.56 137.885 395.252 135.212 394.905C132.692 394.559 130.846 395.618 128.75 395.464C127.635 395.387 127.269 394.077 126.808 394.019C125.077 393.827 124.385 394.231 122.308 394.597C119.558 395.078 114.5 395.945 114.173 392.075C114.115 391.304 115.923 390.38 115.885 389.244C115.769 386.606 114.365 387.742 113.269 386.221C112.212 384.757 112.115 385.104 111.538 383.294C110.942 381.368 114.135 379.982 111.096 378.133C106.692 375.437 106.769 382.601 104.327 383.66C98.7692 386.086 95.2308 369.044 86.4231 378.018C84.2692 380.213 83.0962 384.738 81.5769 387.492C80.8462 388.243 80.4039 389.109 80.2308 390.11C80.2308 391.381 79.5577 391.555 78.25 390.63C76.7885 391.94 75.4423 392.075 74.2115 394.096C73.5192 392.652 72.25 390.496 70.3462 391.381C68.4808 392.248 69.8846 394.289 68.6923 395.521C64.1731 400.201 62.1923 392.286 61.0769 389.59C60.2115 387.511 56.7308 379.077 53.0385 380.636C49.6346 382.081 49.3654 392.344 47.4615 394.982C45.5 397.697 42.1154 398.756 41.6346 402.685C41.0769 407.345 43.4808 407.865 46.5385 410.599C49.0192 412.813 51.0385 416.472 53.1154 419.014C55.4039 421.806 54.7115 429.046 50.6923 425.946C49.1923 424.791 50.3654 420.034 46.2885 421.883C44.5192 422.673 44.5385 424.232 45.4808 425.599C46.4038 426.928 48 424.81 48.8462 426.524C49.8846 428.661 47.8846 428.738 47.3654 429.508C46.3846 430.914 41.8077 433.957 41.5 435.979C41.1154 438.617 44 440.273 46.1346 438.655C47.9615 437.269 46.1923 433.822 48.8654 433.552C50.5577 433.379 49.8077 445.318 49.6731 447.07C49.3077 451.769 43.5192 456.64 51.3462 455.658C52.3077 455.543 63.4808 453.136 61.3654 457.449C60.6346 458.951 51.3462 456.583 48.9808 458.951C44.4615 463.496 55.1923 463.053 57.7115 464.208C62.4423 466.384 63.2115 473.316 57.5577 470.1C54.1538 468.156 53.2692 459.875 48.8654 466.557C43.9423 474.048 53.0385 472.931 55.0962 478.053C47.6731 480.672 45.6923 469.677 44 465.113C42.8846 462.109 42.1538 456.737 38.3654 462.244C36.3269 465.209 37.25 469.927 38.2115 473.047C39.5769 477.495 41 480.152 44.9231 481.962C48.3269 483.541 52.3846 483.965 55.0385 487.142C57.7115 490.358 55.1538 494.267 57.5 496.943C59.7692 499.582 61.3269 495.807 60.4808 499.793C60.2692 500.775 57.5 503.336 57.6346 504.684C58.1538 509.768 59.8269 504.107 62.0577 505.435C64.3462 506.803 60.0385 510.75 61.6923 512.425C63.3269 514.062 63.6731 511.443 64.6154 511.232C64.9231 510.423 65.4808 509.864 66.2692 509.537C66.6923 509.749 67.1154 509.961 67.5192 510.172C71.2885 508.266 70.6923 508.613 71.6923 503.933C72.8269 498.696 75.7885 499.389 79.5 496.308C82.25 494.036 84.9808 490.127 85.9423 486.718C86.2115 485.736 85.9615 476.089 87.1538 476.224C88.75 476.416 88 486.641 88.0769 487.758C88.2692 490.936 88.1731 491.86 90.3462 493.94C90.8077 494.382 94.5385 496.847 95.2308 496.828C97.3269 496.77 96.7692 495.191 98.4038 494.69C99.2308 494.44 100.173 496.115 101.212 495.673C102.231 495.23 102 493.169 102.769 492.38C104.173 490.936 105.423 491.552 106.385 489.222C106.846 488.086 105.769 486.969 106.077 485.929C106.346 484.985 107.481 484.215 107.731 483.349C108.25 481.5 107.942 478.939 108.615 477.167C109.981 473.528 115.769 471.429 118.769 468.907C122.462 465.806 121.25 468.233 125.769 466.808C129.827 465.537 129.404 459.952 132.596 460.087C132.904 460.087 134.25 462.436 135.923 462.379C136.923 462.34 138.115 460.665 138.173 460.665C141.462 460.703 142.712 467.924 139.173 469.234C135.481 470.601 137.038 464.401 134.019 464.882C131.154 465.344 132.481 472.546 130.038 473.855C129.154 474.337 128.135 472.43 126.885 473.085C125.192 473.952 126.212 475.03 125.423 476.089C125.038 476.609 124.404 477.822 123.942 478.438C123.019 479.709 120.519 480.268 120.288 482.347C119.904 486.102 123.596 486.969 126.288 487.104C130.865 487.335 132.308 486.102 135.346 489.665C135.731 490.108 138.173 494.71 138.865 494.69C140.615 494.633 139.75 492.515 140.577 491.995C142.019 491.09 143.269 491.398 144.788 490.627C146.885 489.568 151.192 486.083 150.038 483.522C149.962 483.368 147 481.885 146.962 481.885C146.923 481.885 145.731 480.768 145.269 480.576C144.923 480.422 143.462 482.001 143.135 481.77C138.808 478.804 146.519 478.458 148.481 479.055C151.385 479.96 150.673 479.786 153.288 479.305C164.981 477.225 147.885 468.252 146.269 463.553C145.308 460.761 147.288 457.815 146.615 455.1C146.538 454.753 145.058 451.711 145.019 451.769C146.481 449.535 145.769 451.865 147.538 451.152C149.327 450.44 153.923 450.69 155.846 449.477C158.692 447.667 156.75 444.663 159.192 449.188C160.038 450.748 160.154 452.52 161.269 454.041C162.327 455.485 164.173 456.043 165.019 457.757C167.692 463.149 160.712 464.689 162.173 469.561C162.596 471.005 167.231 474.626 168.75 474.664C174.5 474.799 168.481 468.483 169.173 465.845C169.192 465.749 174.442 459.779 173.923 459.875C176.596 459.433 175.019 466.538 180.135 461.994C182.423 459.952 182.615 457.083 183.365 454.503C184.385 450.979 184.269 446.396 178.577 447.59C174.135 448.534 172.231 454.195 168.192 448.245C167.173 446.743 164.846 441.37 167.462 440.85C169.481 440.446 170.769 443.585 173.404 442.564C175.731 441.659 175.269 439.137 176.942 437.866C177.962 437.095 178.769 437.558 179.788 437.038C182.577 435.555 181.269 437.115 182.731 434.65C183.865 432.743 184.904 428.161 184 426.081L183.962 426.1Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M15.6154 390.111C17.8846 392.883 12.8077 391.747 13.0192 391.651C12.5 391.901 12.4231 386.24 15.6154 390.111Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M41.7885 102.751C41.6346 102.885 34.5577 105.408 34.5385 105.389C31.4615 105.004 31.2692 102.269 33.0769 99.92C35.4231 96.8582 47.75 97.2626 41.8077 102.731L41.7885 102.751Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M31.3269 116.192C30.9038 116.5 27.1154 115.884 26.9038 115.229C25.8846 112.032 35.1538 113.38 31.3269 116.192Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M37.0385 120.216C38.0962 117.462 32.9038 116.75 33.0769 118.733C33.1538 119.523 36.5962 121.41 37.0385 120.216Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M43.8077 111.762C45.2885 113.207 49.8846 113.611 46.8846 116.961C43.9808 120.216 43.9808 116.172 42.7885 114.959C41.25 113.418 39.5769 112.995 39.3461 110.414C39.2692 109.683 40.5192 104.021 42.5192 105.196C44.3269 106.255 42.2692 110.28 43.8077 111.762Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M50.0577 132.771C49.9423 131.558 42.2115 127.437 41.7692 130.711C41.8654 129.998 44.9615 134.812 44.5385 134.62C45.3462 134.966 50.1923 134.042 50.0769 132.771H50.0577Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M57.2885 132.097C57.4038 130.46 54.1346 130.672 53.5962 131.019C52.6346 131.616 53.25 132.925 53.0192 133.214C52.9808 133.252 52.1346 135.813 51.6923 136.487C50.9038 137.681 47.8462 138.394 47.4231 139.857C46.3462 143.497 50.4231 144.344 53.4423 145.056C55.0962 145.461 55.8846 146.732 57.6346 145.692C59.4423 144.613 58.0192 141.898 59.2115 140.878C61.1538 139.222 62.2308 140.762 64.4808 139.626C65.4423 139.145 67.75 136.718 66.8462 135.178C65.6731 133.137 64.25 134.87 62.8654 134.619C61.6154 134.388 60.9231 132.886 59.4615 133.483C58.3269 133.946 58.4423 135.448 57.8077 135.736C52.6731 138.182 57.1346 134.273 57.2885 132.097Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M51.7885 151.931C53.4808 154.319 55.4423 149.023 52.3846 147.406C49.0385 145.634 50.6538 150.333 51.7885 151.931Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M39.4423 163.061C35.4615 165.083 44.1538 168.125 45.1154 167.471C48.3462 165.275 40.4231 162.56 39.4423 163.061Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M54.1538 162.734C55.9808 160.442 61.7885 162.04 58.3269 166.161C55.0577 170.032 51.2308 166.411 54.1538 162.734Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M23.6731 166.084C21.1923 162.656 18.8846 164.293 20.4038 168.01C22.3269 172.747 24.0769 169.666 26.4231 169.55C26.7885 169.55 31.3077 173.613 29.5385 169.146C28.7692 167.182 24.5577 167.297 23.6923 166.103L23.6731 166.084Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M22.1731 173.536C23.5 174.865 23.3462 177.734 20.7885 176.174C18.5577 174.807 20.0577 171.418 22.1731 173.536Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M63.0769 117.424C63.75 118.772 63.4231 123.798 62.0769 124.741C60.5962 125.762 55.6154 124.279 53.7115 124.144C51.8077 124.009 48.9615 124.683 47.9808 122.353C46.6731 119.234 49.5 120.64 49.9615 118.733C50.9231 114.689 49.3462 114.555 47.0192 111.647C43.5577 107.295 43.9231 99.5733 50.2885 97.7633C54.1538 96.6657 58.8462 99.169 60.9231 102.828C63.4808 107.314 60.6538 112.706 63.0769 117.443V117.424Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M39.2692 175.77C38 173.151 32.9231 173.748 35.1538 176.521C35.9038 177.445 40.4231 178.177 39.2692 175.77Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M87.7115 141.436C88.9615 137.431 85.4808 135.64 85.2115 131.827C84.9615 128.188 87.0577 125.723 82.75 124.009C78.75 122.43 75.0577 125.646 72.1346 127.668C68.7692 129.998 69.6731 128.881 68.9423 132.501C68.5577 134.388 68.7308 137.315 68.9808 139.183C69.4423 142.649 71.7692 142.63 72.6731 145.307C73.4231 147.56 69.6731 150.775 74.1346 151.353C75.5 151.526 75.4423 149.678 76.5 149.678C77.2692 149.678 79.1154 150.159 79.5769 150.044C84.4808 148.908 86.0962 146.616 87.7308 141.436H87.7115Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M17.7692 184.358C17.5577 182.143 20.3077 181.835 21.3654 183.241C22.4038 184.608 18 186.996 17.7692 184.358Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M118.481 201.631C124.942 198.685 128.942 205.155 134.673 207.331C138.365 208.737 135.038 208.274 137.692 206.734C138.769 206.118 139.558 204.52 141.019 203.73C142.192 203.095 143.75 203.518 144.885 202.517C146.365 201.188 145.346 199.417 146.269 198.415C147.923 196.605 150.673 196.528 152.942 194.718C154.346 193.601 154.327 191.733 156.327 190.925C157.885 190.289 159.635 191.329 161.212 190.559C162.577 189.904 162.596 188.364 163.942 187.478C165.577 186.399 167.577 187.382 169.173 185.899C171.635 183.627 169.346 177.831 171.096 176.81C175.423 180.623 178.019 178.716 179.5 174.018C179.788 173.093 181.077 166.835 179.769 167.451C183.788 165.545 183.615 161.386 183.365 157.689C182.962 151.989 184.462 152.335 186.596 147.637C188.596 143.227 185.538 141.379 184.75 137.508C183.596 131.77 189.288 134.196 190 130.249C190.846 125.569 183.423 126.436 180.885 125.993C176.692 125.28 175.981 123.509 172.769 121.025C168.846 117.982 167.423 119.85 163.519 120.178C160.019 120.486 160.577 119.985 161.404 116.577C162 114.17 163.962 112.321 162.308 109.953C161.038 108.162 159.5 111.397 158.538 108.797C158.115 107.661 159.865 106.198 160.058 105.235C160.308 104.022 161.462 103.078 161.538 101.711C161.654 99.5928 159.385 97.4746 160.173 95.2987C161.385 91.9866 168.615 92.1407 169.423 87.5962C170.327 82.6089 164.885 82.8977 162.846 80.5292C161.962 79.5086 163.596 77.9104 162.962 76.9091C161.25 74.2132 160.212 76.2544 157.904 75.5034C153.654 74.0977 152.923 73.52 152.654 68.5519C152.442 64.6429 151.942 60.368 147.269 64.9317C146.462 58.3076 143.558 64.6044 141.481 64.7777C140.712 64.8547 137.192 62.6018 136.808 61.87C135.75 59.8289 136.962 57.5759 137.635 55.3614C134.981 54.0135 133.25 59.4245 130.365 58.5772C128.327 57.9803 128.462 54.5142 126.135 54.2061C124.269 56.4205 127.981 66.6263 120.788 61.1768C119.192 59.9637 117.231 56.9019 115.846 55.4C113.673 53.0507 113.423 49.6231 111.115 47.2354C108.942 49.0647 106.058 50.7592 105.231 53.4551C104.808 54.8223 106.173 57.056 105.481 58.4617C104.673 60.0407 100.404 61.9085 99.1346 63.295C96.1154 66.607 96.0577 71.2285 93.3077 74.7524C89.8654 79.162 85.8269 78.9887 81.1923 81.0299C77.8846 82.4933 78.9808 81.1454 78.3462 85.2085C78.0962 86.8837 77.9038 89.7722 78.3269 91.486C78.4808 92.1407 80.5 94.8943 80.4423 95.472C80.3654 96.2807 78.4038 96.2615 78.1154 97.3398C77.1154 100.979 77.7885 106.467 77.9038 110.222C78.0577 114.632 77.5192 113.188 79.9231 115.864C81.5769 117.713 83.8269 117.963 85.1154 120.601C78.6346 119.754 77 115.229 76.2885 109.876C75.2308 102.135 75.6539 104.503 70.0577 105.524C68.8077 105.755 65.9808 104.388 64.8846 105.331C63.2115 106.795 63.6923 112.417 63.8077 114.382C64.1346 120.158 67.9231 124.279 68.75 129.825C72.8654 128.689 74.6538 124.491 79.2885 123.913C84.3462 123.297 85.3269 125.011 85.7115 129.286C85.8846 131.346 85.1923 132.733 85.9615 134.909C86.4231 136.237 87.9231 137.065 88.1731 138.529C89.0192 143.439 84.5192 148.792 80.4231 150.352C82.1923 151.97 76.8462 153.471 77.25 155.744C77.7885 158.825 86.4808 157.092 86.2885 160.423C86.0577 164.332 78.4423 160.981 77.8462 161.116C73.0385 162.156 77.0385 164.621 74.3462 167.702C73.0192 167.451 73.5 164.293 72.6346 163.331C73.1539 163.908 68.5962 161.501 69.4423 161.636C65.2692 161.02 66.4039 161.886 65.0385 165.256C64.9423 165.507 63.6346 170.417 63.6346 170.455C65.2115 174.904 69.5962 168.742 71.1731 168.953C75.0769 169.435 73.4423 172.689 75.2308 175.096C75.1154 176.271 75.5769 177.06 76.6539 177.426C77.2885 176.906 78.0192 176.656 78.8462 176.656C79.6539 177.349 75.1539 188.325 81.25 180.16C82.25 178.813 83.2692 175.789 85.3462 175.366C87.75 174.884 90.5192 175.963 89.3846 178.967C88.7308 180.719 86.2692 180.738 85.5 182.972C85.0577 184.224 86.1154 186.65 85.9038 188.133C85.5 190.963 82 190.559 85.6154 192.754C87 193.601 89.9808 191.483 90.8077 193.89C87.6731 195.951 87.4423 194.718 89.6731 196.759C89.9808 197.029 91.5192 196.99 92.0962 197.433C93.0192 198.146 93.3077 200.187 94.0769 201.111C95.6346 202.998 99.3077 205.713 101.904 205.136C105.519 204.308 104.077 200.11 106.635 199.205C107.385 200.899 107.096 203.152 106.096 204.674C110.5 203.884 114.404 203.422 118.538 201.554L118.481 201.631Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M184.75 179.313C187.558 180.526 196.596 178.658 198.788 176.309C201.308 173.613 200 164.159 206.173 166.797C208.192 167.663 208.635 170.783 210.212 172.054C213.635 174.826 213.365 172.67 216.212 171.322C216.788 170.32 217.596 169.55 218.673 169.011C220.038 168.818 221.058 169.281 221.769 170.417C223.788 169.743 223.288 167.548 225.827 167.605C228.712 167.682 229.692 171.033 232.788 170.898C234.904 170.802 238.327 167.567 237.192 171.842C236.462 174.615 230.077 176.694 235.942 178.793C238.135 179.583 240.25 177.465 242.423 177.869C245.308 178.408 244.058 179.929 246.135 180.854C250.442 182.741 253.712 180.777 258.423 183.241C262.615 185.437 267.442 185.745 271.346 188.19C274.5 190.174 276.5 195.065 280 190.828C282.865 187.343 278.346 180.199 284.481 179.91C290.827 179.621 288.519 187.439 292.577 188.691C294.019 189.134 296.154 186.765 297.385 186.438C299.942 185.764 301.731 186.515 304.192 186.746C309.615 187.266 313.288 182.895 318.154 185.61C322.077 187.786 323.038 193.351 327.846 188.306C331.558 184.435 331.769 179.833 337.75 177.792C334.615 173.401 337.827 167.008 334.442 161.963C332.615 159.229 330.25 157.669 328.981 154.55C328.308 152.932 329.25 151.719 328.077 149.986C327.212 148.715 325.115 148.523 324.058 147.406C322.346 145.596 322.212 143.189 320.904 141.186C319.365 138.798 316.769 137.508 315.692 134.639C314.577 131.712 315.577 128.766 313.923 126.089C312.058 123.085 309.423 122.43 308.462 118.714C307.673 115.672 308.962 115.402 306.25 112.205C304.019 109.567 301.365 107.642 299.058 105.119C293.788 99.4001 290.288 92.6604 286.635 86.2481C282.827 79.5277 275.596 75.0026 272.288 67.82C270.885 64.7775 270.019 63.5644 267.942 60.9456C265.25 57.5757 266 54.514 264.731 50.6628C262.481 43.8654 258.077 36.2014 254.673 29.8276C251.154 23.242 248.846 16.5216 246.25 9.60869C245.327 7.16316 242.519 -0.288968 239.365 0.866401C236.019 2.09879 237.558 7.66382 237.346 9.99381C237.058 13.4984 236.173 17.7926 234.692 21.0468C231.404 28.1909 224.481 31.657 218.019 35.0653C215.654 36.317 213.981 37.5494 211.385 38.1463C206.481 39.2631 201.577 36.7599 196.731 37.2798C193.577 37.6071 191.519 39.1861 188.25 38.5699C184.808 37.9345 182.769 36.8561 178.885 36.9332C174.981 37.0102 171.154 36.548 167.231 36.3747C165.712 36.317 164.269 35.9511 162.75 36.3362C161.308 36.7021 160.077 38.4351 158.769 38.6277C155.25 39.1476 151.904 35.9318 148.077 35.8356C143.923 35.72 140.404 37.0294 136.269 36.7021C132.308 36.394 130.192 38.5507 126.462 38.9358C121.481 39.4557 119.712 39.9949 115.538 43.461C114.731 44.135 111.25 46.5612 111.096 47.2159C111.269 46.4649 113.827 53.7823 113.692 53.5897C115.058 55.5346 117.885 57.6143 119.558 59.4436C120.904 60.9071 123.596 64.3154 125.635 61.5233C127.173 59.4243 124.288 56.3433 126.115 54.1867C128.404 54.4948 128.346 57.9609 130.346 58.5578C133.25 59.4051 134.923 53.9941 137.615 55.342C137.135 56.9018 135.692 59.6361 136.269 61.3885C136.577 62.2935 140.654 64.8546 141.462 64.7775C143.462 64.6042 146.442 58.269 147.25 64.9316C150.673 61.5618 152.462 63.083 152.769 67.146C153.192 72.7303 152.635 73.8472 157.885 75.5032C159.442 75.9846 160.942 74.4634 162.346 76.2542C163.404 77.5829 162.019 78.9116 162.596 79.9514C164.231 82.8976 169.192 81.8963 169.365 86.5562C169.558 92.3716 161.846 91.4088 160.154 95.3178C159.096 97.7633 161.462 101.46 160.5 104.503C160.231 105.369 158.058 107.68 158.538 108.816C159.385 110.838 160.577 108.566 161.769 109.798C164.096 112.205 162.058 113.688 161.423 116.596C159.769 124.144 166.769 117.096 171.962 120.447C175.596 122.796 176.404 125.184 180.904 126.012C183.365 126.474 189.712 125.415 190.135 129.459C190.538 133.291 184.519 131.943 184.596 136.487C184.654 140.705 188.788 142.842 186.615 147.656C184.846 151.584 182.788 151.738 183.115 156.552C183.385 160.596 184.538 165.218 179.788 167.471C179.442 167.644 182.558 178.35 184.769 179.313H184.75Z"
                  fill="#939393"
                  stroke="#939393"
                  stroke-width="0.84"
                />
                <path
                  d="M169.808 393.673C171.269 390.938 169.25 388.262 170.308 385.566C171.481 382.6 173.923 384.449 173.327 380.232C173.327 380.328 171.096 378.537 170.904 377.94C170.173 375.649 171.769 373.223 170.404 370.508C168.346 366.425 166.654 366.714 167.654 361.65C168.173 358.973 169.538 356.162 170.481 353.639C171.404 351.155 173.481 348.209 173.962 345.667C174.308 343.78 173.25 341.72 174.635 340.102C175.288 339.351 178.75 337.83 179.75 337.079C181.5 335.789 183.577 334.479 185.346 333.151C187.288 331.687 188.308 330.917 190.231 329.704C191.519 329.896 192.615 329.531 193.538 328.625C193.692 327.239 193.731 325.833 193.654 324.428C194.538 321.847 197.154 321.886 196.846 318.458C196.673 316.436 195.077 314.646 193.673 313.375C189.192 309.312 188.423 313.201 184 312.97C184.038 312.97 179.692 310.737 179.558 310.679C178.404 311.295 177.365 311.179 176.442 310.351C176.365 309.677 176.231 309.023 176.038 308.368C171.327 308.175 166.615 313.991 161.365 315.069C155.538 316.263 151.769 315.223 147.904 310.987C145.962 308.849 142.846 307.328 141.212 305.171C139.712 303.227 141.731 300.704 139.077 300.069C137.904 299.78 134.135 302.707 132.731 303.073C130.288 303.708 126.808 303.939 124.288 303.477C119.096 302.514 119.154 297.931 115.096 296.834C113.115 296.294 108.654 296.371 106.404 296.179C104.038 295.967 102.308 295.832 100.25 297.334C95.7885 300.589 95.5192 307.02 90.2308 310.14C92.4231 311.353 87.6731 311.834 88.1346 311.507C88.2308 311.449 83.8462 314.549 84.25 314.357C79.9615 316.533 74.0385 316.552 69.3077 317.091C66.7692 317.38 60.5769 317.341 65.4231 320.268C66.8846 321.154 69.1923 320.268 70.2692 321.327C71.8846 322.964 69.9423 325.545 71.5577 327.278C73.5 329.376 78.4808 326.527 81 326.623C82.7308 326.681 83.7308 327.566 85.5769 327.162C87.1346 326.815 89.1731 323.118 91.0577 324.543C92.0385 325.275 87.5962 330.301 86.6346 330.647C84 331.61 77.1538 328.645 80.4808 334.345C81.1154 335.442 89.8462 338.234 87.1731 340.295C86.1923 341.046 79.4038 338.119 76.9038 338.465C71.5769 339.216 73.7115 340.699 71.8846 344.589C70.75 346.996 69.5962 347.034 67.5 348.421C65.3269 349.846 63.9423 351.502 61.9231 353.177C60.8077 354.121 56.2308 355.892 55.8269 356.99C53.75 362.728 61.3846 363.036 64.8077 362.536C66.5962 362.266 71.9615 361.091 73.6923 362.401C76.3269 364.384 74.4615 363.113 73.5385 364.48C71.2115 367.947 65.5385 367.6 62.0769 369.025C57.0192 371.105 55.0577 375.976 53.1731 380.675C61.5385 381.753 58.5385 391.94 63.6346 395.714C69.8269 400.297 70.1538 385.393 74.3462 394.135C75.2308 392.691 76.2692 391.978 77.5385 390.996C78.0962 390.611 78.6731 390.572 79.2692 390.881C80.3846 391.458 80.8462 390.919 80.6346 389.225C82.8077 387.049 83.3462 384.237 84.5962 381.657C88.3077 374.051 94.4808 374.648 99.5385 380.617C107.058 389.513 105.019 374.301 111.231 378.172C114.288 380.078 110.596 383.39 112.038 385.566C112.788 386.683 114.904 386.086 115.615 387.183C116.558 388.666 115.25 389.533 115.365 390.727C115.615 393.057 112.519 392.845 116.75 394.847C120.25 396.503 122.904 393.018 125.923 393.442C127.096 393.596 127.019 395.387 127.75 395.444C128.615 395.521 129.404 394.847 130.058 394.905C133.596 395.252 137.846 395.521 141.077 394.944C141.846 394.809 142.596 393.403 143.615 393.191C145.058 392.883 145.788 394.481 147.385 394C150.135 393.172 150.442 389.571 154.096 389.128C157.519 388.705 160.577 390.784 162.442 393.461C162.846 394.019 163.731 396.889 164.212 397.081C165.635 397.678 169.346 394.732 169.904 393.692L169.808 393.673Z"
                  fill="#B8B8B8"
                  stroke="#B8B8B8"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M197.904 309.003C202.673 307.405 205.269 300.858 205.942 295.601C206.308 292.732 204.827 292.693 207.135 290.999C207.615 290.633 209.635 291.538 210.462 290.941C212.788 289.227 210.904 289.612 210.519 287.86C210.308 286.897 209.558 284.278 208.692 283.72C206.981 282.564 206.673 283.835 205.269 283.585C204.173 283.392 203.596 284.259 202.212 283.797C201.212 283.45 200.731 281.794 199.846 281.274C194.481 278.078 189.596 284.837 193.019 275.112C194.192 271.781 194.192 268.816 194.519 265.215C194.846 261.479 196.442 257.474 196.442 253.815C196.442 248.558 191.308 248 188.327 244.803C184.154 240.336 192.327 240.913 194.154 237.736C195.635 235.156 194.231 234.54 196.692 232.826C198.865 231.305 202.231 232.691 202.365 228.397C202.712 229.726 213.077 230.226 213.038 230.284C214.096 228.705 208.135 223.698 210.942 219.924C213.135 216.978 217.558 217.883 220.5 217.421C224.25 216.824 227.558 213.185 231.115 213.146C236.231 213.088 235.577 218.884 239.558 219.751C244.019 220.714 249 216.862 249.173 212.78C249.462 206.503 247.212 205.367 253.346 201.477C257.154 199.07 259.308 198.454 261.635 194.622C262.923 192.503 262.288 192.022 264.365 190.482C266.269 189.057 268.808 189.692 270.654 187.689C268.538 186.149 266.058 186.611 263.673 185.976C260.635 185.167 258.885 182.683 256.077 181.681C253.154 180.642 250.885 182.702 248.212 182.009C245.904 181.393 245.519 178.986 243.327 178.196C239.538 176.829 231.096 181.566 234.942 174.191C235.5 173.112 239.288 170.86 236.673 169.338C236.481 169.223 232.538 171.264 231.442 171.071C229.596 170.725 228.712 168.395 226.865 168.087C224.692 167.721 222.596 169.396 221.212 169.877C220.75 170.032 218.904 169.3 217.788 169.743C216.308 170.32 216.192 172.342 214.731 172.939C209.038 175.231 206.346 161.347 201.365 168.703C199.846 170.956 200.827 174.229 198.827 176.348C197.115 178.158 193.019 178.716 190.635 179.178C182.288 180.757 183.558 176.213 180.365 170.474C179.462 175.943 177.135 182.144 171.135 176.848C169.365 177.869 171.481 181.219 171.077 182.721C170.115 186.418 168.135 185.475 165.712 187.131C164.25 188.132 162.019 190.443 160.462 191.001C157.327 192.118 156.731 191.001 153.904 193.216C153.365 194.256 152.692 195.238 151.904 196.124C151.058 196.855 150.077 197.144 148.981 196.99C147.981 196.778 147.135 197.029 146.404 197.722C146.154 198.742 146.115 199.782 146.269 200.822C144 203.942 136.538 203.653 136.442 208.794C136.346 213.108 144.327 216.708 146.865 219.385C147.962 220.56 150.558 224.834 148.808 226.452C146.519 228.57 145.769 224.912 143.192 225.528C140.827 226.086 139.173 231.998 138.385 233.75C136.596 237.794 136.769 238.121 137.385 241.818C137.538 242.781 138.577 247.441 139.231 248.192C140.673 249.848 144.269 248.52 145.096 250.792C142.173 251.774 145.327 256.376 146 257.493C147.423 259.919 146.212 259.515 148.673 260.227C150.365 260.709 149.923 258.533 152.404 259.996C153.654 260.728 153.519 262.634 154.231 263.636C155.808 265.812 155.942 266.717 158.577 265.658C159.731 265.195 159.596 260.208 161.365 264.56C162.538 267.41 160.019 270.221 158.981 272.647C158.308 274.246 156.462 278.405 156.75 280.331C157.269 283.701 158.904 282.276 161.212 284.394C162.288 285.376 162.154 286.743 163.077 287.821C163.731 288.592 164.846 288.88 165.423 289.535C167.942 292.501 166.615 293.04 166.808 296.987C166.923 299.491 171.288 308.445 172.827 309.196C173.365 309.465 174.269 307.617 175.308 308.194C175.673 308.406 176.327 309.831 176.327 309.831C178.038 310.39 180.423 310.775 182.5 311.449C185.288 312.354 183.865 312.854 187.038 312.296C190.673 311.66 190.192 310.216 193.75 313.451C194.596 312.257 196.346 309.523 197.885 309.022L197.904 309.003Z"
                  fill="#808080"
                  stroke="#808080"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M142.019 263.27C139.135 265.523 137.327 263.944 135.404 267.66C134.365 269.663 133.269 275.671 133.788 277.866C134.385 280.389 135.981 282.584 136.808 285.145C137.808 288.206 138.846 290.748 141.865 292.385C144.462 289.323 141.269 283.469 145.173 281.197C146.327 282.796 148.404 290.479 149.577 290.999C151.885 292.019 152.827 289.42 154.269 287.552C157.846 282.93 156.75 277.558 159.442 271.627C160.058 270.298 163.885 263.039 159.923 262.673C158.327 262.519 159.327 266.736 156.192 266.158C154.231 265.792 154.385 262.769 153.519 261.633C152.173 259.881 151.75 260.189 149.885 259.63C148.808 259.322 148.25 261.229 146.904 260.227C146.212 259.707 145.615 256.607 145.308 256.145C143.942 258.128 143.865 261.787 141.962 263.27H142.019Z"
                  fill="#B8B8B8"
                  stroke="#B8B8B8"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M126.288 228.07C120.692 227.993 124.269 236.754 124.731 239.392C125.596 244.38 123.538 248.539 123.769 253.315C124 258.186 127.788 259.611 129.077 264.117C130.519 269.182 127.481 273.899 133.962 276.018C134.327 273.63 134.308 269.856 135.423 267.68C137.346 263.963 139.404 265.696 142.038 263.289C143.096 262.326 145.231 257.551 145.385 256.165C145.5 254.951 141.942 251.813 145.115 250.754C144.327 248.616 141.846 250.022 140.673 248.982C138.481 246.999 139.442 246.517 138.481 243.918C136.673 239.065 136.135 238.603 138.558 233.327C134.442 232.634 130.077 228.128 126.308 228.07H126.288Z"
                  fill="#A8A8A8"
                  stroke="#A8A8A8"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M232.481 475.607C236.077 474.741 230.077 470.177 228.288 471.506C224.885 474.028 230.577 476.07 232.481 475.607Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M225.385 464.362C227.885 465.729 224.923 467.231 223.269 466.615C221.173 465.845 223.596 463.38 225.385 464.362Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M223.885 447.012C227.115 446.011 225.692 452.346 222.769 450.228C221.269 449.15 222.577 447.417 223.885 447.012Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M226.558 451.383C226.308 454.888 231.865 456.082 231.462 452.558C231.423 452.211 226.75 448.784 226.558 451.383Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M208.231 442.757C209.577 438.424 202.904 442.699 202.423 445.684C202.077 447.782 202.885 450.401 205.231 450.998C205.75 451.133 210.808 450.806 210.904 450.786C212.769 450.401 213.173 451.942 214.077 449.458C214.635 447.937 212.192 448.553 211.904 447.84C211.577 447.012 212.731 444.952 211.673 444.259C209.135 442.603 209.615 445.972 207.981 446.473C206.173 447.031 208.327 442.506 208.25 442.737L208.231 442.757Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M197.25 444.567C201.654 441.563 196.846 434.727 192.288 440.003C191.365 441.081 191.385 442.795 190.577 443.874C189.846 444.875 188.308 445.26 187.635 446.415C185.712 449.727 187.865 451.518 189.327 454.233C189.827 455.158 190.885 455.697 191.192 456.775C191.423 457.603 190.25 458.951 190.481 459.856C191.212 462.629 193.788 464.632 196.327 462.244C197.558 461.089 196.058 458.97 197.846 458.316C201.519 456.968 199.5 461.223 200.442 462.745C202.288 465.749 203.346 463.784 206.019 464.266C207.731 464.574 208.692 467.751 210.577 465.325C211.231 464.478 210.288 462.417 210.558 461.377C211.173 459.067 213.404 457.719 212.269 454.715C209.769 447.994 203.962 455.601 200.231 453.887C200.788 454.137 197.692 449.959 197.769 450.132C196.981 448.591 194.519 446.415 197.231 444.567H197.25Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M240.519 450.209C244.519 451.518 238.5 453.29 238.942 452.481C239.096 452.211 237.558 449.246 240.519 450.209Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M243.327 449.573C244.865 452.019 243.423 450.671 243.5 452.231C243.596 453.848 240.558 455.004 244.288 457.622C246.904 459.452 245.846 458.778 247.385 456.313C247.846 455.581 248.712 453.617 248.904 452.674C249.077 451.865 248.058 450.247 248.135 449.978C248.423 448.861 253.885 442.853 250.212 442.968C249.731 442.968 243.5 449.881 243.327 449.593V449.573Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M254.135 453.944C253.558 452.616 251.077 456.486 251.327 455.831C250.904 456.91 250.519 456.871 250.5 458.354C250.5 457.372 253.231 462.379 252.231 461.685C253.962 462.879 252.615 463.091 254.231 462.321C252.846 462.975 255.385 457.468 255.385 458.932C255.385 457.41 254.981 455.87 254.154 453.944H254.135Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M255.231 435.747C255.923 431.338 257.462 435.343 257.673 436.19C258.962 441.563 254.981 437.269 255.231 435.747Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M285.962 431.453C286.135 429.797 282.212 420.747 288.019 423.943C289.442 424.733 288.538 428.083 288.154 429.162C288.5 428.199 285.635 434.611 285.962 431.453Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M274.269 430.991C276.269 429.046 275.173 426.119 272.423 427.39C271 428.045 270.596 432.859 268.885 434.38C267.615 435.497 264.846 435.42 264.019 436.614C262.173 439.291 268.692 439.714 266.058 442.487C262.596 438.617 263.712 442.699 261.135 442.737C259.192 442.757 259.962 440.677 257.423 441.004C256.327 441.158 254.827 442.737 254.154 443.527C250.885 447.32 252.442 448.553 254.904 450.902C257.423 453.328 256.115 452.635 258.423 451.576C259.538 451.056 261.308 447.744 263.096 449.304C266.519 452.288 261.5 453.386 260.692 454.445C256.846 459.452 261.923 456.332 262.673 457.237C263.904 458.681 262.577 459.644 262.577 461.531C262.577 461.493 264.308 462.937 264.365 463.149C264.673 464.189 261.635 463.938 263.115 465.71C265.327 468.367 267.288 465.229 268.346 463.11C269.442 460.877 269.615 458.778 270.769 456.544C271.154 455.812 271 454.503 271.673 453.964C272.481 453.309 274.462 454.85 275.212 454.156C277.154 452.346 274.731 451.634 275.269 449.612C275.577 448.456 278.192 449.381 278.115 447.186C278.077 446.069 276.635 445.799 276.519 445.491C276.404 445.221 274.846 446.646 274.231 445.645C273.231 444.028 275.538 442.911 275.846 441.409C276.365 438.925 272.596 432.666 274.288 431.03L274.269 430.991Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M284.808 415.817C284.615 413.391 288.635 415.124 289.558 414.527C291.75 413.121 290.346 410.695 291.788 409.097C293.962 406.651 295.577 408.346 298.404 407.845C301.981 407.21 301.519 405.284 303.731 403.282C307.058 400.258 312.5 399.931 314.519 395.675C315.577 393.442 314.077 391.651 316.212 389.783C317.846 388.358 321.231 390.207 323.269 387.78C328.25 381.869 319.942 379.885 316.731 377.305C314.231 375.302 313.135 373.877 310.058 372.549C308.462 371.875 304.481 371.028 303.923 368.986C303.231 366.483 307.077 365.193 306.5 362.131C305.769 358.203 303.115 359.301 300.25 358.742C297.615 358.222 294.942 356.585 292.269 357.702C291.308 358.607 290.538 359.647 289.942 360.822C289.135 361.977 288.038 362.42 286.635 362.15C285.788 362.651 281.481 365.212 280.462 365.405C278.058 365.828 275 363.383 272.673 362.882C270.635 362.459 264.5 364.076 263.269 363.421C261.423 362.439 261.192 358.184 259.288 356.778C254.731 353.447 250.269 356.412 246 357.837C242.058 359.166 243.788 358.954 239.846 357.529C236.885 356.451 235 356.297 231.808 356.297C229.769 356.297 225.442 356.913 224.115 354.66C223.288 353.293 223.981 347.208 223.077 344.897C221.981 342.066 219.827 340.68 218.654 338.966C217.538 339.101 216.942 338.581 216.846 337.406C217.154 336.251 217.038 335.134 216.538 334.056C214.808 332.766 211.615 334.961 209.673 334.845C205.885 334.614 206.423 332.804 204.058 331.071C203.808 330.07 203.212 329.377 202.269 328.991C201.154 329.03 200.135 329.338 199.192 329.935C197.038 329.415 196.058 327.72 193.788 327.124C194.096 330.089 191.692 328.857 190.269 329.704C188.462 330.763 187.135 331.899 185.385 333.151C182.423 335.288 180.25 336.944 177.404 339.37C175.962 340.622 174.865 339.524 173.904 341.662C173.327 342.933 173.904 345.417 173.423 346.996C171.942 351.906 168.692 356.508 167.673 361.688C166.481 367.792 171.115 369.025 171.5 374.802C171.596 376.111 170.596 377.632 171.058 378.942C171.538 380.328 173.885 379.828 174.038 381.772C174.269 384.507 170.923 384.083 170.346 385.624C169.538 387.703 170.731 389.263 170.423 391.304C169.904 394.828 168.365 394.424 166.404 396.407C164.077 396.33 163.5 397.158 164.673 398.891C164.923 399.873 165.135 400.855 165.288 401.857C166.538 407.21 166.904 409.694 171.385 413.006C175.385 415.952 175.712 418.186 178.885 421.69C182.827 426.042 184.577 424.848 183.673 431.473C183.058 436.017 182.192 437.712 187.462 438.058C189.173 438.174 195 437.192 196.25 436.075C197.827 434.688 197.538 428.738 200.019 429.605C201.654 430.182 200.538 436.017 205.404 433.514C211.154 430.568 204.154 427.949 204.385 426.659C204.615 425.407 207.269 426.389 207.212 427.679C209.058 427.101 208.654 423.558 209.962 423.385C212.115 423.115 210.385 429.547 210.25 430.529C210.019 432.05 208.788 434.842 209.096 436.344C209.769 439.56 210.673 438.154 213.173 439.406C216.077 440.85 220.442 446.512 225 442.198C226.731 440.561 224.058 439.04 227.712 438.54C231.173 438.058 230.058 440.793 232.327 441.235C236.019 441.967 235.731 432.57 238.596 437.326C241.154 441.601 232.212 444.316 238.404 446.512C244.019 448.495 246.942 443.681 247.712 439.483C247.865 438.694 249.077 435.17 248.788 434.496C248.423 433.629 246.212 433.514 245.981 432.763C246.904 430.298 255.019 434.65 253.654 428.372C252.231 421.844 246.827 428.276 244.385 428.603C239.654 429.239 243.673 424.174 247.385 424.078C252.385 423.943 256.25 424.329 248.865 420.054C250.577 417.647 252.231 420.131 254.019 420.169C254.481 420.169 257.327 419.014 257.231 419.014C258.596 419.245 259.615 418.975 260.596 420.612C261.442 422.037 259.885 421.806 260.058 422.422C260.769 424.964 258.596 425.099 262.615 424.906C266.231 424.733 268.308 422.672 266.327 418.686C265.808 417.647 259.135 412.043 263.885 411.619C267.058 411.331 265.058 414.2 267.058 415.028C268.827 415.76 270.865 413.949 272.442 414.893C274.096 415.894 273.308 418.34 274.808 419.495C276.462 420.766 277.442 420.343 279.365 420.516C280.192 420.593 281.962 420.208 282.75 420.246C284.385 420.323 285.904 421.248 287.981 421.113C287.308 420.054 284.942 417.358 284.827 415.914L284.808 415.817Z"
                  fill="#6C6C6C"
                  stroke="#6C6C6C"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M358.212 305.075C356.769 301.686 349.654 315.011 346.327 314.472C345.577 314.356 342.154 310.447 341.885 309.927C340.346 307.116 341.173 309.08 343.596 305.383C345.846 301.936 344.25 301.878 342.904 298.586C341.885 296.082 341.5 293.926 340.981 291.172C339.692 284.586 338.923 275.921 342.5 269.759C345.788 264.098 347.808 258.629 346.577 251.562C345.519 245.496 342.038 241.857 345.846 235.714C347.481 233.095 349.327 232.537 349.788 229.129C350.212 226.028 349.538 222.1 348.481 219.212C345.577 211.297 343.596 205.29 343.827 196.432C343.923 193.177 344.538 190.019 343.308 187.17C342.635 185.61 340.635 184.358 339.731 182.702C339.269 181.836 339.615 179.91 338.769 179.275C332.808 174.807 330.442 187.593 326.538 189.808C321.346 192.754 319.769 184.589 315.212 184.243C312.212 184.012 309.635 187.015 306.519 187.17C302.404 187.362 299.923 186.207 295.769 187.401C292.519 188.325 293.038 189.249 290.577 186.861C288.442 184.801 290.212 181.027 285.519 180.257C276.808 178.832 284.981 191.483 277.865 192.677C274.558 193.235 274 189.23 271.5 188.498C270.673 188.248 265.769 189.615 264.385 190.539C261.5 192.446 262.808 193.871 261.096 196.393C259.115 199.32 256.231 199.84 253.365 201.535C250.635 203.171 248.75 204.327 248.365 207.677C247.904 211.606 250.769 213.974 247.442 217.228C245.865 218.769 239.962 220.752 237.827 219.52C235.404 218.114 235.923 213.801 232.019 213.165C228.558 212.607 227.058 215.803 224.231 216.843C221.346 217.902 218.423 217.055 215.442 217.845C212.615 218.596 210.865 219.385 210.231 222.273C209.846 224.026 213.423 229.783 213.077 230.323C213.115 230.265 202.75 229.764 202.404 228.435C202.231 233.866 197.75 230.939 195.769 232.903C193.788 234.867 195.038 237.582 192.846 239.565C191.5 240.779 187.75 239.854 187.038 242.05C186.346 244.206 191.173 246.671 192.673 248C194.981 250.041 196.481 250.445 196.481 253.873C196.481 258.051 194.731 262.538 194.423 266.794C194.269 268.835 194.519 271.069 193.962 273.052C193.519 274.631 191.192 276.903 191.25 278.424C191.462 283.951 194.154 279.387 196.808 279.715C200.019 280.119 200.731 283.681 203.731 284.297C205.288 284.625 206.019 282.699 207.827 283.315C209.519 283.893 210.231 286.281 210.577 287.879C211 289.843 213.731 288.611 210.519 290.96C209.038 292.058 207.712 290.305 206.615 291.095C205.288 292.058 205.5 297.199 204.865 299.202C203.731 302.745 202.654 306.5 199.865 308.811C198.635 309.831 193.75 310.544 193.827 313.432C193.865 314.626 196.75 316.571 196.904 318.419C197.058 320.075 196.538 320.653 195.865 322.174C194.404 325.486 192.077 325.121 195.942 328.259C198.942 330.705 199.712 327.893 202.269 328.952C204.923 330.05 204.462 333.497 207.673 334.595C210.135 335.442 214.058 332.746 215.885 333.844C217.712 334.941 215.923 336.174 216.846 337.387C218.288 339.235 218.538 337.81 219.885 339.12C222.212 341.43 224.173 346.572 224.5 349.749C224.942 354.101 223.442 355.391 228.654 356.296C231.731 356.816 235.019 355.507 238.077 356.624C243.385 358.549 241.442 359.878 246.731 357.24C252.327 354.448 257.885 354.371 261.442 359.897C261.635 360.186 262.731 363.113 263.288 363.421C263.942 363.768 269.173 362.477 270.327 362.554C273.5 362.786 277.519 366.021 280.481 365.404C282.115 365.058 282.596 363.344 284.019 362.728C285.385 362.131 287.308 362.67 288.558 361.996C291.692 360.321 291 357.702 295.115 357.394C297.981 357.182 301.731 359.685 304.615 359.146C310.577 358.029 308.827 354.563 311.058 350.616C312.942 347.284 317.462 347.073 320.808 347.342C322.327 347.458 324 347.496 325.404 348.189C327.846 349.422 327.365 351.039 328.885 352.561C332.212 355.911 332.769 354.544 337.154 353.581C339.712 353.023 341.596 353.6 344.077 353.735C347.577 353.928 346.173 354.833 348.173 352.464C350.596 349.576 351.115 342.663 352.135 338.946C353.423 334.344 353.808 330.397 354.481 325.814C355.519 318.901 361.212 312.046 358.25 305.056L358.212 305.075Z"
                  fill="#A8A8A8"
                  stroke="#A8A8A8"
                  stroke-width="0.84"
                />
                <path
                  d="M328.962 386.606C324.788 383.197 323.462 387.992 320.038 389.61C318.115 390.534 316.712 388.878 315.154 390.707C314.154 391.882 315.096 394.327 314.519 395.656C313.077 399.007 310.077 399.161 307.212 400.759C304.231 402.434 303.269 405.881 300.423 407.306C295.827 409.617 294.423 406.054 291.365 410.599C290.269 412.216 291.5 413.256 289.558 414.508C288.423 415.24 286.462 413.622 285.442 414.739C283.673 416.645 287.942 421.96 290.154 421.69C290.673 421.633 292.25 419.688 291.769 419.591C292.096 419.668 293.577 420.939 293.442 420.92C293.519 420.939 293.75 422.769 294.615 423C295.615 423.289 296.096 420.516 297.808 420.901C299 421.17 298.692 425.079 299.885 425.927C302.442 427.718 303.173 425.734 304.788 424.367C306.288 423.077 304.654 422.345 307.25 421.96C308 421.844 308.808 425.311 310.173 424.213C312.923 422.018 306.135 419.996 308.538 418.051C309.962 416.896 310.519 419.36 311.827 419.495C315.154 419.823 314.096 419.187 316.019 417.627C316.212 417.473 317.673 415.49 318.442 414.777C319.846 413.507 321.365 413.121 322.692 412.062C326.192 409.251 327.269 406.709 327.981 401.895C328.365 399.276 326.923 393.788 330.731 394.289C330.404 391.843 331.212 388.397 328.981 386.567L328.962 386.606Z"
                  fill="#B8B8B8"
                  stroke="#B8B8B8"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M348.231 359.897C346.5 358.299 346.288 356.874 347.25 354.621C344.423 353.697 341.538 353.062 338.558 353.408C336.481 353.658 334.173 355.488 332.115 355.103C328.058 354.313 328.769 349.576 324.5 347.882C321.25 346.591 315.096 346.688 312.423 349.018C310.019 351.117 311.5 352.83 310.442 354.91C308.962 357.779 306.769 356.893 304.577 359.185C309.712 362.459 302.981 366.29 304.269 369.448C305.385 372.164 312.865 373.473 315.25 375.456C318.5 378.172 321.865 380.136 324.481 383.197C323.808 385.354 324.615 386.201 326.885 385.739C327.577 386.028 328.269 386.336 328.962 386.625C331.173 388.57 330.365 391.805 330.712 394.347C333.327 394.693 333.981 392.017 335.442 390.572C338.346 387.703 338.404 389.937 338.038 384.141C337.942 382.754 340.365 371.682 341.231 371.798C343.75 372.164 340.308 376.843 343.673 376.612C346.154 376.458 345.538 373.165 345.846 371.624C346.212 369.699 349.404 360.995 348.231 359.917V359.897Z"
                  fill="#D6D6D6"
                  stroke="#D6D6D6"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M92.9808 123.971C85.9808 123.201 90.7885 130.557 92.4039 133.06C94.9615 137.046 96.8269 142.649 102.692 142.823C106.288 142.919 105.173 140.82 107.519 139.915C110.231 138.875 109.5 140.127 111.692 140.782C114.942 141.725 114.519 143.15 118.462 141.802C120.654 141.051 123.981 138.817 125.077 136.776C126.327 134.427 126.577 131.962 124.827 129.69C123.231 127.63 120.25 128.188 118.923 126.493C116.596 123.509 119.942 116.634 117.269 113.399C114.404 109.933 109.538 113.63 107.5 115.864C103.154 120.62 100.5 124.799 93.0192 123.99L92.9808 123.971Z"
                  fill="#D6D6D6"
                  stroke="#D6D6D6"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M261.788 316.282C260.981 316.725 258.096 317.9 257.346 319.094C256.462 320.499 257.288 322.348 256.615 323.542C253.75 328.626 251.404 321.25 247.712 322.098C244.673 322.791 243.231 328.51 245.154 330.763C246.846 332.766 251.077 330.859 251.096 334.306C251.096 336.906 246.481 337.06 245.288 338.677C242.788 342.009 246.577 343.78 246 347.111C245.365 350.789 241.885 347.882 241.519 352.657C241.154 357.471 245.154 358.761 249.038 358.338C252.712 357.953 255.038 356.701 256.538 353.254C257.731 350.501 257.577 344.127 262.308 344.724C265.096 345.07 265.558 349.114 269.154 347.805C270.654 347.246 270.692 345.59 271.577 344.858C272.096 344.416 274.808 343.588 275.269 342.856C276.635 340.699 276.385 335.5 277.423 332.612C279 328.24 281.192 325.005 278.231 321.039C276.962 319.344 274.673 315.416 273.058 314.241C269.654 311.776 264.923 314.569 261.788 316.282Z"
                  fill="#808080"
                  stroke="#808080"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M95.9231 402.858C93.7692 403.551 92.1923 405.631 89.8654 405.881C87.8461 406.093 86.2115 404.302 84.2885 404.379C79.9423 404.572 76.3654 408.423 75.1154 412.524C72.8269 420.034 78.7885 416.588 82.8462 418.609C86.9808 420.67 84.75 425.407 90.0192 425.214C91.9808 425.137 93.8269 422.961 95.75 422.422C98.0192 421.806 100.212 422.345 102.5 422.114C107.442 421.575 108.077 421.209 108.885 416.626C109.827 411.311 108.808 412.351 105.808 409.482C102.827 406.632 101.385 401.125 95.9231 402.858Z"
                  fill="#D6D6D6"
                  stroke="#D6D6D6"
                  stroke-width="0.42"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              {/* 도시 마커 */}
              {citiesWeather.map((city) => (
                <Box
                  key={city.city}
                  onClick={() => setSelectedCity(city.city)}
                  sx={{
                    position: "absolute",
                    left: `${city.x}%`,
                    top: `${city.y}%`,
                    lineHeight: 1.3,
                    transform: {
                      xs: "translate(-180%, -128%)",
                      lg: "translate(-300%, -178%)",
                    },
                    backgroundColor: "rgba(50, 50, 50, 0.8)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border:
                      selectedCity === city.city
                        ? "2px solid white"
                        : "1px solid rgba(255,255,255,0.3)",
                    "&:hover": {
                      backgroundColor: "rgba(70, 70, 70, 0.9)",
                      transform: {
                        xs: "translate(-190%, -129%) scale(1.1)",
                        lg: "translate(-310%, -179%) scale(1.1)",
                      },
                    },
                  }}
                >
                  {city.name} {city.temperature}°
                </Box>
              ))}

              {/* 범례 */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                  p: 1,
                  rowGap: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "#63A465",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontFamily: "Pretendard" }}
                  >
                    기온
                  </Typography>
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "#31BCA0",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontFamily: "Pretendard" }}
                  >
                    체감
                  </Typography>
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "#3BB6F7",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontFamily: "Pretendard" }}
                  >
                    강수
                  </Typography>
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "#D9D9D9",
                    color: "black",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontFamily: "Pretendard" }}
                  >
                    적설
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Weather;
