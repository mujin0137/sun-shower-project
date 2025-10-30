import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
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
          fetch(`http://localhost:5000/api/weather/current?city=${city.city}`)
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
          `http://localhost:5000/api/weather/current?city=${selectedCity}`
        );
        const currentData = await currentRes.json();
        setCurrentWeather(currentData);

        // 예보
        const forecastRes = await fetch(
          `http://localhost:5000/api/weather/forecast?city=${selectedCity}`
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
    <Box className="weather" sx={{ minHeight: "100vh", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {/* 왼쪽 영역 - 상세 정보 */}
        <Box sx={{ flex: { xs: 1, lg: 1 }, minWidth: 0, width:"25.7vw" }}>
          {/* 상세 정보 박스 */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 2,
              background: "#ffafafff",
              color: "balck",
              boxShadow: "none",
            }}
          >

            {/* 상단 오늘의 날씨 현황 */}
            {currentWeather && (
              <Paper
                sx={{display: "flex", flexDirection:"row", gap:3, alignItems: "center", justifyContent:"space-between", }}
                >
                <Box
                  sx={{display: "flex", flexDirection:"column", gap:1, alignItems:"center"}}
                  >
                    <Box
                      sx={{display:"flex", flexDirection:"row"}}
                      >
                        {/* 오늘의 날씨 아이콘 */}
                        <Box>
                             <img
                            src={currentWeather.weather.iconUrl}
                            alt={currentWeather.weather.description}
                            style={{ width: 130, height: 130, marginRight: 8 }}
                               />
                        </Box>

                      <Box
                        sx={{display: "flex", flexDirection:"column"}}
                        >
                          {/*도시 선택*/}
                        <Select
                          value={selectedCity}
                          onChange={handleCityChange}
                          sx={{
                            color: "black",
                            fontSize: "0.8rem",
                            "& .MuiSelect-icon": { color: "Black", fontSize: "1rem"  },
                            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                          }}
                          fullWidth
                        >
                          {majorCities.map((city) => (
                            <MenuItem key={city.city} value={city.city}>
                              {city.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <Typography variant="h2" sx={{ fontWeight: "bold", mb: 1, fontSize:"2rem", textAlign:"center" }}>
                          {currentWeather.temperature.current}°
                        </Typography>
                        <Typography variant="body1" 
                          sx={{ 
                            mb: 2,
                            opacity: 0.9,
                            fontSize:"0.75rem"
                            }}>
                          습도 {currentWeather.details.humidity}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        backgroundColor:"#555396",
                        color:"#ffffff",
                        width:"8vw",
                        height:"2vh",
                        fontSize:"0.75rem",
                        textAlign:"center",
                        borderRadius:"20px" }}
                      >
                      대기정체에 주의하세요.
                    </Typography>
                     {/*최고/최저온도*/}
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    최고 {currentWeather.temperature.max}° / 최저{" "}
                    {currentWeather.temperature.min}°
                  </Typography>
                </Box>

                <Box 
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems:"center",
                    justifyContent:"space-between" }}>
                  {/* 초미세먼지*/}
                  <Box
                    sx={{ 
                      flex: 1, 
                      flexDirection: "column", 
                      py: 1,
                      textAlign:"center"
                    }}
                  >
                    <Typography variant="caption">초미세먼지</Typography>
                    <Box
                    sx={{
                      backgroundColor:"#FFBB4E",
                      width:"2.5vw",
                      color:"wi"
                    }}
                    >
                    <Typography variant="body2" fontWeight="bold">
                      보통
                    </Typography>
                    </Box>
                  </Box>

                  {/*미세먼지*/}
                  <Box
                    sx={{
                      flex: 1,
                      flexDirection: "column",
                      py: 1,
                      textAlign:"center",
                      alignContent:"center"
                    }}
                  >
                    <Typography variant="caption">미세먼지</Typography>
                    <Box
                    sx={{
                      backgroundColor:"#63A465",
                      width:"2.5vw",
                      
                    }}
                    >
                    <Typography variant="body2" fontWeight="bold">
                      좋음
                    </Typography>
                    </Box>
                  </Box>
                  {/*자외선 */}
                  <Box
                    sx={{
                      flex: 1,
                      flexDirection: "column",
                      py: 1,
                      textAlign:"center",
                      
                    }}
                  >
                    <Typography variant="caption">자외선</Typography>
                    <Box
                      sx={{
                        backgroundColor:"#FF7A00",
                      width:"2.5vw"
                      }}
                    >
                    <Typography variant="body2" fontWeight="bold">
                      주의
                    </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            )}
            {/* 시간별 예보 */}
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                // backgroundColor: "red",
                overflowX: "auto",
                gap: 2,
              }}
            >
              {hourlyForecast.map((item, index) => {
                const hour = new Date(item.timestamp).getHours();
                return (
                  <Box
                    key={index}
                    sx={{
                      minWidth: 60,
                      textAlign: "center",
                      backgroundColor: "#f5f5f5",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="caption" sx={{ display: "block" }}>
                      {hour}시
                    </Typography>
                    <img
                      src={item.weather.iconUrl}
                      alt={item.weather.description}
                      style={{ width: 40, height: 40 }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {Math.round(item.temperature.current)}°
                    </Typography>
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
                  py: 1,
                  borderBottom:
                    index < dailyForecast.length - 1
                      ? "1px solid #eee"
                      : "none",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ width: 60, fontWeight: "bold" }}
                >
                  {getDayLabel(index)}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WbSunny sx={{ fontSize: 20, color: "#FFA500" }} />
                  <WbCloudy sx={{ fontSize: 20, color: "#808080" }} />
                </Box>
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {day.pop}%
                  </Typography>
                </Box>
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
            ))}
          </Paper>

          
          

          

        
      
        </Box>

        {/* 오른쪽 영역 - 지도 */}
        <Box sx={{ flex: { xs: 1, lg: 2 } }}>
          <Paper
            elevation={3}
            sx={{
              height: { xs: 500, lg: "100%" },
              minHeight: 600,
              position: "relative",
              overflow: "hidden",
              background: "#333",
            }}
          >
            {/* 한국 지도 영역 */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              {/* 도시 마커 */}
              {citiesWeather.map((city) => (
                <Box
                  key={city.city}
                  onClick={() => setSelectedCity(city.city)}
                  sx={{
                    position: "absolute",
                    left: `${city.x}%`,
                    top: `${city.y}%`,
                    transform: "translate(-50%, -50%)",
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
                      transform: "translate(-50%, -50%) scale(1.1)",
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
                  backgroundColor: "rgba(255,255,255,0.9)",
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                  초미세먼지
                </Typography>
                <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                  미세먼지
                </Typography>
                <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                  습도
                </Typography>
                <Typography variant="caption" sx={{ display: "block" }}>
                  자외선
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Weather;
