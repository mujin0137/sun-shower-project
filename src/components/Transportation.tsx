import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DirectionsBus from "@mui/icons-material/DirectionsBus";
import DirectionsSubway from "@mui/icons-material/DirectionsSubway";
import DirectionsWalk from "@mui/icons-material/DirectionsWalk";
import SwapVert from "@mui/icons-material/SwapVert";
import Search from "@mui/icons-material/Search";
import AccessTime from "@mui/icons-material/AccessTime";
import Payment from "@mui/icons-material/Payment";
import TransferWithinAStation from "@mui/icons-material/TransferWithinAStation";
import MapIcon from "@mui/icons-material/Map";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import DirectionsTransit from "@mui/icons-material/DirectionsTransit";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import "../CSS/transportation.css";

// API 베이스 URL 동적 설정
const API_BASE_URL = `http://${window.location.hostname}:5001`;

declare global {
  interface Window {
    kakao: any;
  }
}

interface RouteOption {
  type: string;
  summary: {
    totalTime: number;
    payment: number;
    busTransitCount: number;
    subwayTransitCount: number;
    totalDistance: number;
    totalWalk: number;
    totalStationCount: number;
  };
  subPaths: SubPath[];
  pathData?: any;
}

interface SubPath {
  trafficType: string;
  type?: string;
  distance: number;
  sectionTime: number;
  startStation?: string;
  endStation?: string;
  stationCount?: number;
  line?: string;
  lineColor?: string;
  busNo?: string;
  busType?: string;
  way?: string;
  trainType?: string;
  trainCode?: string;
}

const Transportation = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [transportMode, setTransportMode] = useState<
    "transit" | "driving" | "walking"
  >("transit"); // 교통수단 탭
  const [option, setOption] = useState(0); // 0: 최적, 1: 최소시간, 2: 최소환승, 3: 최소도보
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [markers, setMarkers] = useState<any[]>([]);
  const [polylines, setPolylines] = useState<any[]>([]);

  // Kakao Map 초기화
  useEffect(() => {
    if (!mapRef.current) return;
    const initializeMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.log("⏳ Kakao SDK 대기 중...");
        setTimeout(initializeMap, 100);
        return;
      }
      const kakao = window.kakao;
      const container = mapRef.current;
      if (!container) return;
      try {
        console.log("🗺️ 지도 생성 시작...");
        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 중심
          level: 8,
        };
        const mapInstance = new kakao.maps.Map(container, options);
        setMap(mapInstance);
        console.log("✅ 지도 초기화 완료");
      } catch (err) {
        console.error("❌ 지도 생성 실패:", err);
      }
    };
    initializeMap();
  }, []);

  // 지도에 출발지/도착지 마커 표시
  const displayMarkersOnMap = (startCoords: any, endCoords: any) => {
    if (!map || !window.kakao) return;
    const kakao = window.kakao;
    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers = [];
    // 출발지 마커
    const startMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(startCoords.lat, startCoords.lng),
      map: map,
    });
    const startInfowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">🚩 출발: ${origin}</div>`,
    });
    startInfowindow.open(map, startMarker);
    newMarkers.push(startMarker);
    // 도착지 마커
    const endMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(endCoords.lat, endCoords.lng),
      map: map,
    });
    const endInfowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;">🏁 도착: ${destination}</div>`,
    });
    endInfowindow.open(map, endMarker);
    newMarkers.push(endMarker);
    setMarkers(newMarkers);
    // 지도 범위 조정
    const bounds = new kakao.maps.LatLngBounds();
    bounds.extend(new kakao.maps.LatLng(startCoords.lat, startCoords.lng));
    bounds.extend(new kakao.maps.LatLng(endCoords.lat, endCoords.lng));
    map.setBounds(bounds);
  };

  // 지도에 경로선 표시
  const displayRouteOnMap = (pathData: any) => {
    if (!map || !window.kakao || !pathData) return;
    const kakao = window.kakao;
    // 기존 폴리라인 제거
    polylines.forEach((line) => line.setMap(null));
    const newPolylines = [];
    // 경로선 표시
    if (pathData.path && pathData.path.length > 0) {
      const linePath = pathData.path.map(
        (point: any) => new kakao.maps.LatLng(point.lat, point.lng)
      );
      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: "#FF6B35",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
      });
      polyline.setMap(map);
      newPolylines.push(polyline);
      console.log(`✅ 경로 표시 완료 (${pathData.path.length}개 좌표)`);
    }
    setPolylines(newPolylines);
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = async () => {
    if (!origin || !destination) {
      setError("출발지와 도착지를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setRoutes([]);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/transportation/directions?origin=${encodeURIComponent(
          origin
        )}&destination=${encodeURIComponent(
          destination
        )}&mode=${transportMode}&option=${option}`
      );

      if (!response.ok) {
        throw new Error("경로를 찾을 수 없습니다.");
      }

      const data = await response.json();

      if (data.success && data.routes) {
        setRoutes(data.routes);

        // 지도에 출발지/도착지 마커 표시
        if (data.coordinates) {
          displayMarkersOnMap(data.coordinates.start, data.coordinates.end);

          // 첫 번째 경로에 pathData가 있으면 경로선 표시
          if (data.routes[0]?.pathData) {
            displayRouteOnMap(data.routes[0].pathData);
          }
        }
      } else {
        setError("경로를 찾을 수 없습니다.");
      }
    } catch (err: any) {
      setError(err.message || "경로 검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case "subway":
        return <DirectionsSubway sx={{ color: "#0052A4" }} />;
      case "bus":
        return <DirectionsBus sx={{ color: "#5BB025" }} />;
      case "walk":
        return <DirectionsWalk sx={{ color: "#999" }} />;
      case "train":
        return <DirectionsSubway sx={{ color: "#FF6B35" }} />;
      case "express_bus":
      case "intercity_bus":
        return <DirectionsBus sx={{ color: "#FF0000" }} />;
      default:
        return null;
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}분`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins}분`;
  };

  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box
      className="transportation"
      sx={{
        width: "100%",
        maxWidth: 1800,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold" }}></Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: { xs: "auto", md: "790px" },
          position: "relative",
          overflow: "hidden",
          alignItems: "stretch",
          borderRadius: "10px",
        }}
      >
        {/* 왼쪽: 검색 및 결과 */}
        <Box
          sx={{
            minWidth: { xs: "100%", md: 340 },
            width: { xs: "100%", md: 340 },
            position: "absolute",
            height: "100%",
            top: { xs: "400px", md: 0 },
            bottom: { xs: "auto", md: 0 },
            zIndex: 11,
          }}
        >
          {/* 검색 입력 */}

          <Box sx={{ display: "flex", gap: 3, position: "relative" }}>
            {/*접기패널*/}
            <Box
              sx={{
                position: "relative",
                width: { xs: "100%", md: 600 },
                transition: "left 0.4s ease",
                left: { md: collapsed ? -550 : 0 },
                bottom: { xs: collapsed ? -400 : 0, md: 0 },
                zIndex: 11,
              }}
            >
              {/* 접기/펼치기 버튼 */}
              <IconButton
                onClick={() => setCollapsed(!collapsed)}
                sx={{
                  position: "absolute",
                  top: { md: "350px" },
                  left: { md: "545px", xs: "calc(50% - 20px)" },
                  transform: { md: "translateY(-50%)", xs: "translateX(-50%)" },
                  rotate: { md: "0deg", xs: "90deg" },
                  background: { xs: "gray", md: "white" },
                  border: { xs: "none", md: "1px solid #ccc" },
                  width: { xs: 5, md: 40 },
                  height: { xs: 40, md: 40 },
                  borderRadius: { xs: "5px", md: "20px / 50%" },
                  zIndex: 30,
                  "&:hover": { background: "#f0f0f0" },

                  overflow: { xs: "hidden", md: "visible" },
                  padding: { xs: 0 },
                }}
              >
                {collapsed ? (
                  <ChevronRight
                    sx={{ height: { xs: 0, md: 40 }, width: { sx: 0 } }}
                  />
                ) : (
                  <ChevronLeft sx={{ height: { xs: 0, md: 40 } }} />
                )}
              </IconButton>
              <Paper
                elevation={3}
                sx={{
                  height: { xs: "80vh", md: "790px" },
                  transition: "padding 0.4s ease",
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none", // Firefox
                  msOverflowStyle: "none", // IE and Edge
                }}
              >
                <Stack spacing={2} sx={{ p: 4.3 }}>
                  {/* 교통수단 탭 */}
                  <Box
                    sx={{
                      mb: 3,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        width: "100%",
                        justifyContent: {
                          xs: "flex-start",
                          md: "space-between",
                        },
                        px: { xs: 0, md: 0 },
                      }}
                    >
                      <Button
                        variant={
                          transportMode === "transit" ? "contained" : "outlined"
                        }
                        startIcon={
                          <DirectionsTransit
                            sx={{ display: { xs: "none", md: "block" } }}
                          />
                        }
                        onClick={() => setTransportMode("transit")}
                        sx={{
                          flex: 1,
                          height: 40,
                          borderRadius: "30px",
                          fontSize: { xs: "14px", md: "14px" },
                          minWidth: { xs: "auto", md: 0 },
                          whiteSpace: "nowrap",
                          textTransform: "none",
                        }}
                      >
                        대중교통
                      </Button>
                      <Button
                        variant={
                          transportMode === "driving" ? "contained" : "outlined"
                        }
                        startIcon={
                          <DirectionsCar
                            sx={{ display: { xs: "none", md: "block" } }}
                          />
                        }
                        onClick={() => setTransportMode("driving")}
                        sx={{
                          flex: 1,
                          borderRadius: "30px",
                          height: 40,
                          fontSize: { xs: "14px", md: "14px" },
                          minWidth: { xs: "auto", md: 0 },
                          whiteSpace: "nowrap",
                          textTransform: "none",
                        }}
                      >
                        자가용
                      </Button>
                      <Button
                        variant={
                          transportMode === "walking" ? "contained" : "outlined"
                        }
                        startIcon={
                          <DirectionsWalk
                            sx={{ display: { xs: "none", md: "block" } }}
                          />
                        }
                        onClick={() => setTransportMode("walking")}
                        sx={{
                          flex: 1,
                          height: 40,
                          borderRadius: "30px",
                          fontSize: { xs: "14px", md: "14px" },
                          minWidth: { xs: "auto", md: 0 },
                          whiteSpace: "nowrap",
                          textTransform: "none",
                        }}
                      >
                        도보
                      </Button>

                      <Box
                        sx={{
                          width: { xs: "90px", md: "120px" },
                          display: { md: "none" },
                          marginRight: { xs: "20px" },
                        }}
                      >
                        <FormControl fullWidth>
                          <Select
                            value={option}
                            onChange={(e) => setOption(Number(e.target.value))}
                            sx={{
                              textAlign: "center",
                              height: { xs: 40 },
                              alignItems: "center",
                              fontSize: { xs: "0.75rem" },
                            }}
                          >
                            <MenuItem value={0}>최적</MenuItem>
                            <MenuItem value={1}>최소 시간</MenuItem>
                            <MenuItem value={2}>최소 환승</MenuItem>
                            <MenuItem value={3}>최소 도보</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Stack>
                  </Box>
                  {/*출발지 도착지*/}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      position: "relative",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="출발지"
                      placeholder="예: 서울역, 강남역"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />

                    <TextField
                      fullWidth
                      label="도착지"
                      placeholder="예: 대구역, 홍대입구역"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    {/*출발지 도착지 바꾸기 버튼*/}
                    <Button
                      onClick={handleSwap}
                      size="small"
                      variant="outlined"
                      sx={{
                        position: "absolute",
                        top: 45,
                        right: "-15px",
                        borderRadius: "50%",
                        minWidth: "40px",
                        width: "40px",
                        height: "40px",
                        p: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "white",
                      }}
                    >
                      <SwapVert sx={{ fontSize: 30 }} />
                    </Button>
                  </Box>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box
                      sx={{
                        width: 140,
                        display: { xs: "none", md: "block" },
                      }}
                    >
                      <FormControl fullWidth>
                        <Select
                          value={option}
                          onChange={(e) => setOption(Number(e.target.value))}
                          sx={{
                            textAlign: "center",
                            height: "49",
                            alignItems: "center",
                          }}
                        >
                          <MenuItem value={0}>최적</MenuItem>
                          <MenuItem value={1}>최소 시간</MenuItem>
                          <MenuItem value={2}>최소 환승</MenuItem>
                          <MenuItem value={3}>최소 도보</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<Search />}
                      onClick={handleSearch}
                      disabled={loading}
                      sx={{ py: 1.5, width: "340px", justifyContent: "center" }}
                    >
                      {loading ? "검색 중..." : "길찾기"}
                    </Button>
                  </Stack>
                  {/* 에러 메시지 */} {/* 로딩 */}
                  {loading && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", my: 5 }}
                    >
                      <CircularProgress />
                    </Box>
                  )}
                  {/* 에러 */}
                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}
                  {/* 경로 결과 */}
                  {routes && routes.length > 0 && (
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        📊 총 {routes.length}개의 경로를 찾았습니다
                      </Typography>

                      <Stack spacing={2}>
                        {routes.map((route, index) => (
                          <Card key={index} elevation={3}>
                            <CardContent sx={{ bgcolor: "white" }}>
                              {/* 경로 요약 */}
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                  경로 {index + 1} - {route.type}
                                </Typography>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  flexWrap="wrap"
                                >
                                  <Chip
                                    icon={<AccessTime />}
                                    label={formatTime(route.summary.totalTime)}
                                    color="primary"
                                    size="small"
                                  />
                                  {route.summary.payment !== undefined && (
                                    <Chip
                                      icon={<Payment />}
                                      label={`${route.summary.payment.toLocaleString()}원`}
                                      color="success"
                                      size="small"
                                    />
                                  )}
                                  {transportMode === "transit" && (
                                    <Chip
                                      icon={<TransferWithinAStation />}
                                      label={`환승 ${
                                        route.summary.busTransitCount +
                                        route.summary.subwayTransitCount
                                      }회`}
                                      size="small"
                                    />
                                  )}
                                  {route.summary.totalWalk !== undefined && (
                                    <Chip
                                      icon={<DirectionsWalk />}
                                      label={`도보 ${route.summary.totalWalk}m`}
                                      size="small"
                                    />
                                  )}
                                </Stack>
                              </Box>

                              <Divider sx={{ my: 2 }} />

                              {/* 상세 경로 */}
                              {route.subPaths && route.subPaths.length > 0 && (
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ mb: 1, fontWeight: "bold" }}
                                  >
                                    상세 경로
                                  </Typography>
                                  <Stack spacing={1.5}>
                                    {route.subPaths.map((subPath, subIndex) => (
                                      <Box
                                        key={subIndex}
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 2,
                                          p: 1.5,
                                          bgcolor: "transparent",
                                          borderRadius: 1,
                                        }}
                                      >
                                        <Box sx={{ minWidth: 40 }}>
                                          {getTransportIcon(subPath.type || "")}
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                          {subPath.type === "subway" && (
                                            <>
                                              <Typography
                                                variant="body2"
                                                fontWeight="bold"
                                              >
                                                🚇 {subPath.line}
                                                {subPath.way &&
                                                  ` (${subPath.way} 방향)`}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                {subPath.startStation} →{" "}
                                                {subPath.endStation} (
                                                {subPath.stationCount}개 정거장)
                                              </Typography>
                                            </>
                                          )}

                                          {subPath.type === "bus" && (
                                            <>
                                              <Typography
                                                variant="body2"
                                                fontWeight="bold"
                                              >
                                                🚌 {subPath.busNo}번{" "}
                                                {subPath.busType}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                {subPath.startStation} →{" "}
                                                {subPath.endStation} (
                                                {subPath.stationCount}개 정거장)
                                              </Typography>
                                            </>
                                          )}

                                          {subPath.type === "walk" && (
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              🚶 도보 {subPath.distance}m (
                                              {subPath.sectionTime}분)
                                            </Typography>
                                          )}

                                          {subPath.type === "train" && (
                                            <>
                                              <Typography
                                                variant="body2"
                                                fontWeight="bold"
                                              >
                                                🚄 {subPath.trainType}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                {subPath.startStation} →{" "}
                                                {subPath.endStation}
                                              </Typography>
                                            </>
                                          )}

                                          {(subPath.type === "express_bus" ||
                                            subPath.type ===
                                              "intercity_bus") && (
                                            <>
                                              <Typography
                                                variant="body2"
                                                fontWeight="bold"
                                              >
                                                🚌 {subPath.trafficType}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                {subPath.startStation} →{" "}
                                                {subPath.endStation}
                                              </Typography>
                                            </>
                                          )}
                                        </Box>

                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {subPath.sectionTime}분
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Stack>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Box>

        {/* 오른쪽: 지도 */}
        <Box sx={{ flex: 1 }}>
          <Paper
            elevation={3}
            sx={{
              position: "sticky",
              top: 0,
              height: { xs: "100vh", md: "790px" },
              minHeight: 500,

              // zIndex: 12,
            }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: 1,
              }}
            >
              {/* <Box
                sx={{
                  p: 2,
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <MapIcon />
                <Typography variant="h6">경로 지도</Typography>
              </Box> */}
              <Box
                ref={mapRef}
                sx={{
                  flex: 1,
                  height: "100%",
                  minHeight: 500,
                  bgcolor: "grey.100",
                  position: "relative",
                }}
              >
                {!map && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                    }}
                  >
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      지도 로드 중...
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Transportation;
