import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import {
  Cloud,
  Opacity,
  Air,
  Thermostat,
  LocationOn,
} from "@mui/icons-material";
import "../CSS/weather.css";

interface CityWeather {
  city: string;
  name: string;
  x: number; // 이미지 상의 X 좌표 (%)
  y: number; // 이미지 상의 Y 좌표 (%)
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

const Weather = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [citiesWeather, setCitiesWeather] = useState<CityWeather[]>([]);
  const [selectedCity, setSelectedCity] = useState<WeatherDetail | null>(null);

  // 주요 도시 목록 (이미지 상의 좌표로 변경)
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

  // 날씨 데이터 가져오기
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
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
        setError("");
      } catch (err: any) {
        setError("날씨 정보를 가져오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    // 5분마다 자동 갱신
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [majorCities]);

  // 도시 클릭 핸들러
  const handleCityClick = async (city: CityWeather) => {
    console.log("🖱️ 도시 클릭:", city.city);
    try {
      const response = await fetch(
        `http://localhost:5000/api/weather/current?city=${city.city}`
      );
      if (!response.ok) {
        throw new Error("날씨 정보를 가져올 수 없습니다");
      }
      const data = await response.json();
      console.log("✅ 상세 정보:", data);
      setSelectedCity(data);
    } catch (err) {
      console.error("❌ 상세 정보 가져오기 실패:", err);
      setError(`${city.name} 날씨 정보를 가져올 수 없습니다.`);
    }
  };

  return (
    <Box className="weather" sx={{ minHeight: "100vh", p: 3 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: "white" }}
      >
        🌤️ 전국 날씨 지도
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* 상세 정보 영역 */}
        <Box sx={{ flex: 1 }}>
          {selectedCity ? (
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                  📍 {selectedCity.location.name}
                </Typography>

                {/* 날씨 아이콘 */}
                <Box sx={{ textAlign: "center", my: 3 }}>
                  <img
                    src={selectedCity.weather.iconUrl}
                    alt={selectedCity.weather.description}
                    style={{ width: 100, height: 100 }}
                  />
                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                    {selectedCity.temperature.current}°C
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {selectedCity.weather.description}
                  </Typography>
                </Box>

                {/* 상세 정보 */}
                <Stack spacing={2}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Thermostat color="primary" />
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary">
                          체감온도
                        </Typography>
                        <Typography variant="h6">
                          {selectedCity.temperature.feelsLike}°C
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Opacity color="primary" />
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary">
                          습도
                        </Typography>
                        <Typography variant="h6">
                          {selectedCity.details.humidity}%
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Air color="primary" />
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary">
                          풍속
                        </Typography>
                        <Typography variant="h6">
                          {selectedCity.details.windSpeed} m/s
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Cloud color="primary" />
                      <Box flex={1}>
                        <Typography variant="body2" color="text.secondary">
                          구름
                        </Typography>
                        <Typography variant="h6">
                          {selectedCity.details.clouds}%
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      온도 범위
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={`최저 ${selectedCity.temperature.min}°C`}
                        color="info"
                        size="small"
                      />
                      <Chip
                        label={`최고 ${selectedCity.temperature.max}°C`}
                        color="error"
                        size="small"
                      />
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Card elevation={3}>
              <CardContent>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  textAlign="center"
                >
                  🗺️ 지도에서 도시를 클릭하세요
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  mt={2}
                >
                  마커를 클릭하면 상세한 날씨 정보를 볼 수 있습니다.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
        {/* 지도 이미지 영역 */}
        <Box sx={{ flex: { xs: "1", md: "2" } }}>
          <Paper
            elevation={3}
            sx={{
              height: 600,
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* 한국 지도 영역 */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "red",
              }}
            >
              {/* 지도 배경 */}
              <Box
                sx={{
                  position: "absolute",
                  width: "80%",
                  height: "90%",
                  background: "rgba(255, 255, 255, 0.3)",
                  borderRadius: "20px",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                }}
              />

              {/* 도시 마커 */}
              {citiesWeather.map((city) => (
                <Button
                  key={city.city}
                  onClick={() => handleCityClick(city)}
                  sx={{
                    position: "absolute",
                    left: `${city.x}%`,
                    top: `${city.y}%`,
                    transform: "translate(-50%, -50%)",
                    minWidth: "auto",
                    padding: "8px 12px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "2px solid #4CAF50",
                    borderRadius: "8px",
                    flexDirection: "column",
                    gap: 0.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translate(-50%, -50%) scale(1.1)",
                      backgroundColor: "white",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      zIndex: 10,
                    },
                  }}
                >
                  <LocationOn sx={{ fontSize: 16, color: "#4CAF50" }} />
                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      color: "#333",
                      lineHeight: 1,
                    }}
                  >
                    {city.name}
                  </Typography>
                  {city.temperature !== undefined && (
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#FF6B35",
                        lineHeight: 1,
                      }}
                    >
                      {city.temperature}°
                    </Typography>
                  )}
                </Button>
              ))}

              {/* 안내 텍스트 */}
              {citiesWeather.length === 0 && !loading && (
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(0,0,0,0.4)",
                    textAlign: "center",
                  }}
                >
                  날씨 정보를 불러오는 중...
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Weather;
