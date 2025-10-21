const axios = require("axios");

class TransportationService {
  constructor() {
    // Kakao API 설정
    this.kakaoApiKey = process.env.KAKAO_REST_API_KEY;
    this.kakaoBaseURL = "https://dapi.kakao.com/v2";

    // Naver API 설정 (옵션)
    this.naverClientId = process.env.NAVER_CLIENT_ID;
    this.naverClientSecret = process.env.NAVER_CLIENT_SECRET;
  }

  // 주소로 길찾기 (Kakao API)
  async getDirections({ origin, destination, mode = "transit" }) {
    try {
      // 1. 출발지와 도착지를 좌표로 변환
      const originCoords = await this.geocodeAddress(origin);
      const destCoords = await this.geocodeAddress(destination);

      // 2. 좌표로 경로 검색
      return await this.getDirectionsByCoordinates({
        start: originCoords,
        end: destCoords,
        mode,
      });
    } catch (error) {
      console.error("길찾기 오류:", error.message);
      throw error;
    }
  }

  // 좌표로 길찾기
  async getDirectionsByCoordinates({ start, end, mode = "transit" }) {
    try {
      let url = "";
      let headers = {};

      if (mode === "driving" || mode === "car") {
        // 자동차 경로
        url = `${this.kakaoBaseURL}/local/geo/transcoord.json`;
        // 실제로는 Kakao Navi API를 사용해야 하지만, 여기서는 기본 구조만
        url = `https://apis-navi.kakaomobility.com/v1/directions`;
        headers = {
          Authorization: `KakaoAK ${this.kakaoApiKey}`,
          "Content-Type": "application/json",
        };

        const response = await axios.get(url, {
          headers,
          params: {
            origin: `${start.lng},${start.lat}`,
            destination: `${end.lng},${end.lat}`,
          },
        });

        return this.formatKakaoDirections(response.data);
      } else {
        // 대중교통 - 실제 구현시에는 ODsay API나 TMAP API 사용 권장
        // 여기서는 기본 구조만 제공
        return {
          success: true,
          mode: "transit",
          origin: start,
          destination: end,
          routes: [
            {
              summary: {
                origin: { lat: start.lat, lng: start.lng },
                destination: { lat: end.lat, lng: end.lng },
                distance: this.calculateDistance(start, end),
                duration: 1800, // 예상 시간 (초)
              },
              message: "대중교통 API는 ODsay 또는 TMAP API를 연동해주세요.",
            },
          ],
        };
      }
    } catch (error) {
      console.error("경로 검색 오류:", error.message);
      throw new Error("경로를 찾을 수 없습니다.");
    }
  }

  // 주소를 좌표로 변환 (Kakao 지오코딩)
  async geocodeAddress(address) {
    try {
      const url = `${this.kakaoBaseURL}/local/search/address.json`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `KakaoAK ${this.kakaoApiKey}`,
        },
        params: {
          query: address,
        },
      });

      if (response.data.documents.length === 0) {
        throw new Error(`주소를 찾을 수 없습니다: ${address}`);
      }

      const location = response.data.documents[0];
      return {
        lat: parseFloat(location.y),
        lng: parseFloat(location.x),
        address: location.address_name,
      };
    } catch (error) {
      console.error("주소 변환 오류:", error.message);
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
}

module.exports = new TransportationService();
