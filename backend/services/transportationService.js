const axios = require("axios");

class TransportationService {
  constructor() {
    // Kakao API 설정
    this.kakaoApiKey = process.env.KAKAO_REST_API_KEY;
    this.kakaoBaseURL = "https://dapi.kakao.com/v2";

    // ODsay 대중교통 API 설정
    this.odsayApiKey = process.env.ODSAY_API_KEY;
    this.odsayBaseURL = "https://api.odsay.com/v1/api";

    // Naver API 설정 (옵션)
    this.naverClientId = process.env.NAVER_CLIENT_ID;
    this.naverClientSecret = process.env.NAVER_CLIENT_SECRET;
  }

  // 주소로 길찾기 (Kakao API)
  async getDirections({ origin, destination, mode = "transit", option = 0 }) {
    try {
      console.log(`🔍 길찾기 시작: ${origin} → ${destination}`);

      // 1. 출발지와 도착지를 좌표로 변환
      console.log(`📍 출발지 지오코딩 시작: ${origin}`);
      const originCoords = await this.geocodeAddress(origin);
      console.log(`✅ 출발지 좌표:`, originCoords);

      console.log(`📍 도착지 지오코딩 시작: ${destination}`);
      const destCoords = await this.geocodeAddress(destination);
      console.log(`✅ 도착지 좌표:`, destCoords);

      // 2. 좌표로 경로 검색
      return await this.getDirectionsByCoordinates({
        start: originCoords,
        end: destCoords,
        mode,
        option,
      });
    } catch (error) {
      console.error("❌ 길찾기 오류:", error.message);
      throw error;
    }
  }

  // 좌표로 길찾기
  async getDirectionsByCoordinates({
    start,
    end,
    mode = "transit",
    option = 0,
  }) {
    try {
      if (mode === "transit" || mode === "public") {
        // 대중교통 경로 (ODsay API)
        return await this.getPublicTransitRoute({
          start,
          end,
          option,
        });
      } else if (mode === "driving" || mode === "car") {
        // 자동차 경로 (Kakao Mobility API)
        return await this.getDrivingRoute(start, end);
      } else if (mode === "walking") {
        // 도보 경로
        return await this.getWalkingRoute(start, end);
      } else {
        throw new Error(`지원하지 않는 경로 모드입니다: ${mode}`);
      }
    } catch (error) {
      console.error("경로 검색 오류:", error.message);
      throw error;
    }
  }

  // 대중교통 경로 검색 (ODsay API)
  async getPublicTransitRoute({ start, end, option = 0 }) {
    try {
      console.log("🚇 ODsay API 대중교통 경로 검색 시작");
      console.log(`📍 출발: (${start.lat}, ${start.lng})`);
      console.log(`📍 도착: (${end.lat}, ${end.lng})`);

      const url = `${this.odsayBaseURL}/searchPubTransPath`;
      const response = await axios.get(url, {
        params: {
          SX: start.lng, // 출발지 경도
          SY: start.lat, // 출발지 위도
          EX: end.lng, // 도착지 경도
          EY: end.lat, // 도착지 위도
          OPT: option, // 0:최적, 1:최소시간, 2:최소환승, 3:최소도보
          apiKey: this.odsayApiKey,
        },
        timeout: 10000, // 10초 타임아웃
      });

      console.log("✅ ODsay API 응답 성공");
      return this.formatOdsayDirections(response.data, start, end);
    } catch (error) {
      console.error("❌ ODsay API 오류:", error.message);
      console.error("❌ 에러 상세:", error.response?.data || error);

      // 더 구체적인 에러 메시지
      if (error.response?.data) {
        throw new Error(
          `대중교통 경로 검색 실패: ${JSON.stringify(error.response.data)}`
        );
      }
      throw new Error("대중교통 경로를 찾을 수 없습니다.");
    }
  }

  // ODsay 경로 데이터 포맷팅
  formatOdsayDirections(data, start, end) {
    console.log("🔍 formatOdsayDirections 호출됨");

    // ODsay API 에러 체크
    if (data.error) {
      console.error("❌ ODsay API 에러:", data.error);
      throw new Error(
        `ODsay API 에러: ${data.error[0]?.message || "알 수 없는 오류"}`
      );
    }

    if (!data.result) {
      console.error("❌ result가 없음");
      throw new Error("경로를 찾을 수 없습니다.");
    }

    const result = data.result;
    const routes = [];

    // 1. 도시 내 대중교통 경로 (지하철, 버스) - 최대 2개
    if (result.path && result.path.length > 0) {
      console.log(`✅ 도시 내 대중교통 ${result.path.length}개 경로 발견`);
      result.path.slice(0, 2).forEach((path) => {
        // 경로 좌표 데이터 파싱
        const pathData = this.parseGraphData(path.info);

        routes.push({
          type: this.getRouteTypeName(path.pathType),
          summary: {
            totalTime: path.info.totalTime,
            payment: path.info.payment,
            busTransitCount: path.info.busTransitCount || 0,
            subwayTransitCount: path.info.subwayTransitCount || 0,
            totalDistance: path.info.totalDistance,
            totalWalk: path.info.totalWalk || 0,
            totalStationCount: path.info.totalStationCount || 0,
          },
          subPaths: path.subPath.map((subPath) => this.formatSubPath(subPath)),
          pathData: pathData, // 지도 표시용 경로 좌표
        });
      });
    }

    // 2. 장거리 기차 경로 (KTX, SRT, ITX, 무궁화) - 최대 1개
    if (result.trainRequest && result.trainRequest.count > 0) {
      console.log(`✅ 기차 ${result.trainRequest.count}개 경로 발견`);
      result.trainRequest.OBJ.slice(0, 1).forEach((train) => {
        routes.push({
          type: `${train.trainType} (기차)`,
          summary: {
            totalTime: train.time,
            payment: train.payment,
            busTransitCount: 0,
            subwayTransitCount: 0,
            totalDistance: train.distance,
            totalWalk: 0,
            totalStationCount: 0,
          },
          subPaths: [
            {
              type: "train",
              trafficType: "기차",
              distance: train.distance,
              sectionTime: train.time,
              startStation: train.startSTN,
              endStation: train.endSTN,
              trainType: train.trainType,
              trainCode: train.trainCode,
            },
          ],
        });
      });
    }

    // 3. 고속버스 경로 - 제외 (총 3개 제한)
    if (false && result.exBusRequest && result.exBusRequest.count > 0) {
      console.log(`✅ 고속버스 ${result.exBusRequest.count}개 경로 발견`);
      result.exBusRequest.OBJ.slice(0, 1).forEach((bus) => {
        routes.push({
          type: "고속버스",
          summary: {
            totalTime: bus.time,
            payment: bus.payment,
            busTransitCount: 0,
            subwayTransitCount: 0,
            totalDistance: bus.distance,
            totalWalk: 0,
            totalStationCount: 0,
          },
          subPaths: [
            {
              type: "express_bus",
              trafficType: "고속버스",
              distance: bus.distance,
              sectionTime: bus.time,
              startStation: bus.startSTN,
              endStation: bus.endSTN,
            },
          ],
        });
      });
    }

    // 4. 시외버스 경로 - 제외 (너무 많으면 복잡함)
    /*
    if (result.outBusRequest && result.outBusRequest.count > 0) {
      console.log(`✅ 시외버스 ${result.outBusRequest.count}개 경로 발견`);
      result.outBusRequest.OBJ.slice(0, 2).forEach((bus) => {
        routes.push({
          type: "시외버스",
          summary: {
            totalTime: bus.time,
            payment: bus.payment,
            busTransitCount: 0,
            subwayTransitCount: 0,
            totalDistance: bus.distance,
            totalWalk: 0,
            totalStationCount: 0,
          },
          subPaths: [
            {
              type: "intercity_bus",
              trafficType: "시외버스",
              distance: bus.distance,
              sectionTime: bus.time,
              startStation: bus.startSTN,
              endStation: bus.endSTN,
            },
          ],
        });
      });
    }
    */

    if (routes.length === 0) {
      throw new Error("경로를 찾을 수 없습니다.");
    }

    console.log(`✅ 총 ${routes.length}개 경로 반환`);

    return {
      success: true,
      mode: "transit",
      coordinates: {
        start: start,
        end: end,
      },
      routes: routes,
    };
  }

  // 경로 좌표 데이터 파싱 (graphData)
  parseGraphData(info) {
    try {
      console.log("🔍 parseGraphData 시작:", {
        hasMapObj: !!info.mapObj,
        hasFirstStart: !!info.firstStartStation,
        hasLastEnd: !!info.lastEndStation,
        mapObjLength: info.mapObj ? info.mapObj.length : 0,
      });

      // mapObj에서 경로 좌표 추출
      if (info.mapObj) {
        const coordinates = [];

        // 출발지 좌표
        if (info.firstStartStation) {
          coordinates.push({
            lat: parseFloat(info.firstStartStation.lat),
            lng: parseFloat(info.firstStartStation.lon),
          });
          console.log("📍 출발지 추가:", coordinates[0]);
        }

        // 중간 경로 좌표 (mapObj 파싱)
        const mapObjStr = info.mapObj;

        // mapObj는 "경도:위도^경도:위도^..." 형식
        if (typeof mapObjStr === "string") {
          const points = mapObjStr.split("^");
          console.log(`📍 mapObj 포인트 개수: ${points.length}`);
          points.forEach((point, idx) => {
            const [lng, lat] = point.split(":");
            if (lng && lat) {
              coordinates.push({
                lat: parseFloat(lat),
                lng: parseFloat(lng),
              });
              if (idx < 3) {
                console.log(`📍 중간 좌표 ${idx + 1}:`, {
                  lat: parseFloat(lat),
                  lng: parseFloat(lng),
                });
              }
            }
          });
        }

        // 도착지 좌표
        if (info.lastEndStation) {
          coordinates.push({
            lat: parseFloat(info.lastEndStation.lat),
            lng: parseFloat(info.lastEndStation.lon),
          });
          console.log("📍 도착지 추가:", coordinates[coordinates.length - 1]);
        }

        console.log(`✅ 경로 좌표 ${coordinates.length}개 파싱 완료`);
        return { path: coordinates };
      }

      console.log("⚠️ mapObj 없음");
      return null;
    } catch (error) {
      console.error("❌ 경로 좌표 파싱 실패:", error);
      return null;
    }
  }

  // 경로 타입 이름 변환
  getRouteTypeName(pathType) {
    const types = {
      1: "🚇 지하철만 이용",
      2: "🚌 버스만 이용",
      3: "🚇🚌 지하철+버스",
    };
    return types[pathType] || "🚊 대중교통";
  }

  // 세부 경로 포맷팅
  formatSubPath(subPath) {
    const baseInfo = {
      trafficType: this.getTrafficTypeName(subPath.trafficType),
      distance: subPath.distance,
      sectionTime: subPath.sectionTime,
    };

    // 도보 구간
    if (subPath.trafficType === 3) {
      return {
        ...baseInfo,
        type: "walk",
      };
    }

    // 지하철 구간
    if (subPath.trafficType === 1) {
      return {
        ...baseInfo,
        type: "subway",
        startStation: subPath.startName,
        endStation: subPath.endName,
        stationCount: subPath.stationCount,
        line: subPath.lane?.[0]?.name || "지하철",
        lineColor: subPath.lane?.[0]?.subwayCode
          ? this.getSubwayColor(subPath.lane[0].subwayCode)
          : null,
        way: subPath.way, // 상행/하행
      };
    }

    // 버스 구간
    if (subPath.trafficType === 2) {
      return {
        ...baseInfo,
        type: "bus",
        startStation: subPath.startName,
        endStation: subPath.endName,
        stationCount: subPath.stationCount,
        busNo: subPath.lane?.[0]?.busNo || "버스",
        busType: this.getBusTypeName(subPath.lane?.[0]?.type),
      };
    }

    // 기차 구간
    if (subPath.type === "train") {
      return subPath;
    }

    // 고속/시외버스 구간
    if (subPath.type === "express_bus" || subPath.type === "intercity_bus") {
      return subPath;
    }

    return baseInfo;
  }

  // 교통수단 타입 이름
  getTrafficTypeName(type) {
    const types = {
      1: "지하철",
      2: "버스",
      3: "도보",
    };
    return types[type] || "기타";
  }

  // 버스 타입 이름
  getBusTypeName(type) {
    const types = {
      1: "일반버스",
      2: "좌석버스",
      3: "마을버스",
      4: "직행좌석버스",
      5: "공항버스",
      6: "간선급행버스",
      10: "외곽버스",
      11: "간선버스",
      12: "지선버스",
      13: "순환버스",
      14: "광역버스",
      15: "급행버스",
      16: "관광버스",
    };
    return types[type] || "버스";
  }

  // 지하철 노선 색상 (서울 기준)
  getSubwayColor(code) {
    const colors = {
      1: "#0052A4", // 1호선
      2: "#00A84D", // 2호선
      3: "#EF7C1C", // 3호선
      4: "#00A5DE", // 4호선
      5: "#996CAC", // 5호선
      6: "#CD7C2F", // 6호선
      7: "#747F00", // 7호선
      8: "#E6186C", // 8호선
      9: "#BB8336", // 9호선
    };
    return colors[code] || "#999999";
  }

  // 주소/장소명을 좌표로 변환 (Kakao 지오코딩)
  async geocodeAddress(query) {
    try {
      // 1. 먼저 키워드(장소명) 검색 시도 (서울역, 강남역 등)
      let url = `${this.kakaoBaseURL}/local/search/keyword.json`;
      let response = await axios.get(url, {
        headers: {
          Authorization: `KakaoAK ${this.kakaoApiKey}`,
        },
        params: {
          query: query,
          size: 1,
        },
      });

      if (response.data.documents.length > 0) {
        const location = response.data.documents[0];
        return {
          lat: parseFloat(location.y),
          lng: parseFloat(location.x),
          address: location.address_name || location.place_name,
          name: location.place_name,
        };
      }

      // 2. 키워드 검색 실패시 정확한 주소 검색 시도
      url = `${this.kakaoBaseURL}/local/search/address.json`;
      response = await axios.get(url, {
        headers: {
          Authorization: `KakaoAK ${this.kakaoApiKey}`,
        },
        params: {
          query: query,
        },
      });

      if (response.data.documents.length > 0) {
        const location = response.data.documents[0];
        return {
          lat: parseFloat(location.y),
          lng: parseFloat(location.x),
          address: location.address_name,
        };
      }

      throw new Error(`장소를 찾을 수 없습니다: ${query}`);
    } catch (error) {
      if (error.response) {
        console.error("❌ Kakao API 오류:", error.response.data);
      } else {
        console.error("❌ 주소 변환 오류:", error.message);
      }
      throw error;
    }
  }

  // 장소 검색 (Kakao 키워드 검색)
  async searchPlaces(query) {
    try {
      const url = `${this.kakaoBaseURL}/local/search/keyword.json`;
      console.log("🔍 Kakao API 요청:", url);
      console.log("🔑 API Key:", this.kakaoApiKey ? "설정됨" : "없음");

      const response = await axios.get(url, {
        headers: {
          Authorization: `KakaoAK ${this.kakaoApiKey}`,
        },
        params: {
          query: query,
          size: 10,
        },
        timeout: 5000, // 5초 타임아웃
      });

      console.log("✅ Kakao API 응답 성공");
      return {
        success: true,
        places: response.data.documents.map((place) => ({
          name: place.place_name,
          address: place.address_name,
          roadAddress: place.road_address_name,
          coordinates: {
            lat: parseFloat(place.y),
            lng: parseFloat(place.x),
          },
          category: place.category_name,
          phone: place.phone,
          url: place.place_url,
        })),
      };
    } catch (error) {
      console.error("❌ 장소 검색 오류:", error.message);
      console.error("❌ 에러 상세:", error.response?.data || error);
      throw new Error("장소를 검색할 수 없습니다.");
    }
  }

  // Kakao 경로 데이터 포맷팅
  formatKakaoDirections(data) {
    if (!data.routes || data.routes.length === 0) {
      throw new Error("경로를 찾을 수 없습니다.");
    }

    return {
      success: true,
      routes: data.routes.map((route) => ({
        summary: {
          distance: route.summary.distance,
          duration: route.summary.duration,
          fare: route.summary.fare,
          origin: route.summary.origin,
          destination: route.summary.destination,
        },
        sections: route.sections,
      })),
    };
  }

  // 두 좌표 사이의 거리 계산 (Haversine formula)
  calculateDistance(start, end) {
    const R = 6371e3; // 지구 반지름 (미터)
    const φ1 = (start.lat * Math.PI) / 180;
    const φ2 = (end.lat * Math.PI) / 180;
    const Δφ = ((end.lat - start.lat) * Math.PI) / 180;
    const Δλ = ((end.lng - start.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // 미터 단위
  }

  // 자동차 경로 (Naver Directions API)
  async getDrivingRoute(start, end) {
    try {
      console.log("🚗 네이버 Directions API 자동차 경로 검색 시작");
      console.log(`📍 출발: (${start.lat}, ${start.lng})`);
      console.log(`📍 도착: (${end.lat}, ${end.lng})`);

      // 네이버 Directions 5 API 호출
      const url = "https://maps.apigw.ntruss.com/map-direction/v1/driving";
      const response = await axios.get(url, {
        headers: {
          "X-NCP-APIGW-API-KEY-ID": this.naverClientId,
          "X-NCP-APIGW-API-KEY": this.naverClientSecret,
        },
        params: {
          start: `${start.lng},${start.lat}`, // 경도,위도 순서
          goal: `${end.lng},${end.lat}`,
          option: "trafast", // trafast:실시간 빠른길, tracomfort:편한길, traoptimal:최적
        },
        timeout: 10000,
      });

      if (
        !response.data ||
        response.data.code !== 0 ||
        !response.data.route ||
        !response.data.route.trafast ||
        response.data.route.trafast.length === 0
      ) {
        throw new Error("자동차 경로를 찾을 수 없습니다.");
      }

      console.log("✅ 네이버 Directions API 응답 성공");

      const route = response.data.route.trafast[0]; // 첫 번째 경로 사용
      const summary = route.summary;

      // 경로 좌표 추출
      const pathCoordinates = [];
      route.path.forEach((coord) => {
        pathCoordinates.push({
          lng: coord[0],
          lat: coord[1],
        });
      });

      console.log(
        `✅ 경로 정보: ${summary.distance}m, ${Math.round(
          summary.duration / 60000
        )}분`
      );

      return {
        success: true,
        coordinates: { start, end },
        routes: [
          {
            type: "자동차 (네이버)",
            summary: {
              totalTime: Math.round(summary.duration / 60000), // 밀리초 → 분
              payment: summary.tollFare || 0, // 통행료
              busTransitCount: 0,
              subwayTransitCount: 0,
              totalDistance: summary.distance, // 미터
              totalWalk: 0,
              totalStationCount: 0,
              fuelPrice: summary.fuelPrice || 0, // 유류비
              taxiFare: summary.taxiFare || 0, // 택시 요금
            },
            subPaths: [],
            pathData: {
              path: pathCoordinates, // 지도 표시용 경로 좌표
            },
          },
        ],
      };
    } catch (error) {
      console.error("❌ 네이버 자동차 경로 검색 실패:", error.message);
      if (error.response?.data) {
        console.error("❌ 응답 데이터:", error.response.data);
      }
      throw new Error("자동차 경로 검색에 실패했습니다.");
    }
  }

  // 도보 경로
  async getWalkingRoute(start, end) {
    try {
      const distance = this.calculateDistance(
        start.lat,
        start.lng,
        end.lat,
        end.lng
      );
      const walkingSpeed = 4;
      const timeInMinutes = Math.round((distance / 1000 / walkingSpeed) * 60);

      return {
        success: true,
        coordinates: { start, end },
        routes: [
          {
            type: "도보",
            summary: {
              totalTime: timeInMinutes,
              payment: 0,
              busTransitCount: 0,
              subwayTransitCount: 0,
              totalDistance: distance,
              totalWalk: distance,
              totalStationCount: 0,
            },
            subPaths: [],
            pathData: {
              path: [
                { lat: start.lat, lng: start.lng },
                { lat: end.lat, lng: end.lng },
              ],
            },
          },
        ],
      };
    } catch (error) {
      console.error("❌ 도보 경로 계산 실패:", error.message);
      throw new Error("도보 경로 계산에 실패했습니다.");
    }
  }

  // Kakao vertexes 배열을 path 형식으로 변환
  convertVertexesToPath(vertexes) {
    const path = [];
    for (let i = 0; i < vertexes.length; i += 2) {
      path.push({
        lng: vertexes[i],
        lat: vertexes[i + 1],
      });
    }
    return path;
  }
}

module.exports = new TransportationService();
