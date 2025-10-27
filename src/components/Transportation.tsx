import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
} from "@mui/material";
import {
  DirectionsBus,
  DirectionsSubway,
  DirectionsWalk,
  SwapVert,
  Search,
  AccessTime,
  Payment,
  TransferWithinAStation,
  Map as MapIcon,
  DirectionsCar,
  DirectionsTransit,
} from "@mui/icons-material";
import "../CSS/transportation.css";

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
        `http://localhost:5000/api/transportation/directions?origin=${encodeURIComponent(
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

  return (
    <Box
      className="transportation"
      sx={{ maxWidth: 1400, margin: "0 auto", p: 3 }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        🗺️ 경로 검색
      </Typography>

      {/* 교통수단 탭 */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant={transportMode === "transit" ? "contained" : "outlined"}
            startIcon={<DirectionsTransit />}
            onClick={() => setTransportMode("transit")}
            sx={{ flex: 1, py: 1.5 }}
          >
            대중교통
          </Button>
          <Button
            variant={transportMode === "driving" ? "contained" : "outlined"}
            startIcon={<DirectionsCar />}
            onClick={() => setTransportMode("driving")}
            sx={{ flex: 1, py: 1.5 }}
          >
            자가용
          </Button>
          <Button
            variant={transportMode === "walking" ? "contained" : "outlined"}
            startIcon={<DirectionsWalk />}
            onClick={() => setTransportMode("walking")}
            sx={{ flex: 1, py: 1.5 }}
          >
            도보
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* 왼쪽: 검색 및 결과 */}
        <Box sx={{ flex: 1 }}>
          {/* 검색 입력 */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="출발지"
                placeholder="예: 서울역, 강남역"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  onClick={handleSwap}
                  startIcon={<SwapVert />}
                  size="small"
                  variant="outlined"
                >
                  출발지/도착지 바꾸기
                </Button>
              </Box>

              <TextField
                fullWidth
                label="도착지"
                placeholder="예: 대구역, 홍대입구역"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />

              {transportMode === "transit" && (
                <FormControl fullWidth>
                  <InputLabel>경로 옵션</InputLabel>
                  <Select
                    value={option}
                    label="경로 옵션"
                    onChange={(e) => setOption(Number(e.target.value))}
                  >
                    <MenuItem value={0}>최적 경로</MenuItem>
                    <MenuItem value={1}>최소 시간</MenuItem>
                    <MenuItem value={2}>최소 환승</MenuItem>
                    <MenuItem value={3}>최소 도보</MenuItem>
                  </Select>
                </FormControl>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Search />}
                onClick={handleSearch}
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? "검색 중..." : "경로 검색"}
              </Button>
            </Stack>
          </Paper>

          {/* 로딩 */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
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
                    <CardContent>
                      {/* 경로 요약 */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          경로 {index + 1} - {route.type}
                        </Typography>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
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
                                  bgcolor: "grey.50",
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
                                        🚌 {subPath.busNo}번 {subPath.busType}
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
                                    subPath.type === "intercity_bus") && (
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
        </Box>

        {/* 오른쪽: 지도 */}
        <Box sx={{ flex: 1 }}>
          <Paper
            elevation={3}
            sx={{
              position: "sticky",
              top: 20,
              height: { xs: 400, md: "calc(100vh - 120px)" },
              minHeight: 400,
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
              <Box
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
              </Box>
              <Box
                ref={mapRef}
                sx={{
                  flex: 1,
                  minHeight: 300,
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
