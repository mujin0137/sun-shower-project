const axios = require("axios");

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    // OpenWeatherMap API URL
    this.baseURL = "https://api.openweathermap.org/data/2.5";
  }

  // 도시명을 좌표로 변환 (한국 주요 도시 지원)
  getCityCoords(city) {
    const cities = {
      // 광역시/특별시/특별자치시
      Seoul: { lat: 37.5665, lon: 126.978, name: "서울" },
      서울: { lat: 37.5665, lon: 126.978, name: "서울" },
      Busan: { lat: 35.1796, lon: 129.0756, name: "부산" },
      부산: { lat: 35.1796, lon: 129.0756, name: "부산" },
      Incheon: { lat: 37.4563, lon: 126.7052, name: "인천" },
      인천: { lat: 37.4563, lon: 126.7052, name: "인천" },
      Daegu: { lat: 35.8714, lon: 128.6014, name: "대구" },
      대구: { lat: 35.8714, lon: 128.6014, name: "대구" },
      Daejeon: { lat: 36.3504, lon: 127.3845, name: "대전" },
      대전: { lat: 36.3504, lon: 127.3845, name: "대전" },
      Gwangju: { lat: 35.1595, lon: 126.8526, name: "광주" },
      광주: { lat: 35.1595, lon: 126.8526, name: "광주" },
      Ulsan: { lat: 35.5384, lon: 129.3114, name: "울산" },
      울산: { lat: 35.5384, lon: 129.3114, name: "울산" },
      Sejong: { lat: 36.4801, lon: 127.289, name: "세종" },
      세종: { lat: 36.4801, lon: 127.289, name: "세종" },

      // 경기도
      Suwon: { lat: 37.2636, lon: 127.0286, name: "수원" },
      수원: { lat: 37.2636, lon: 127.0286, name: "수원" },
      Seongnam: { lat: 37.4449, lon: 127.1388, name: "성남" },
      성남: { lat: 37.4449, lon: 127.1388, name: "성남" },
      Yongin: { lat: 37.241, lon: 127.1776, name: "용인" },
      용인: { lat: 37.241, lon: 127.1776, name: "용인" },
      Goyang: { lat: 37.6584, lon: 126.832, name: "고양" },
      고양: { lat: 37.6584, lon: 126.832, name: "고양" },
      Ansan: { lat: 37.3219, lon: 126.8309, name: "안산" },
      안산: { lat: 37.3219, lon: 126.8309, name: "안산" },
      Bucheon: { lat: 37.4989, lon: 126.7831, name: "부천" },
      부천: { lat: 37.4989, lon: 126.7831, name: "부천" },
      Anyang: { lat: 37.3943, lon: 126.9568, name: "안양" },
      안양: { lat: 37.3943, lon: 126.9568, name: "안양" },
      Namyangju: { lat: 37.6361, lon: 127.2167, name: "남양주" },
      남양주: { lat: 37.6361, lon: 127.2167, name: "남양주" },
      Hwaseong: { lat: 37.1997, lon: 126.8311, name: "화성" },
      화성: { lat: 37.1997, lon: 126.8311, name: "화성" },
      Pyeongtaek: { lat: 36.9921, lon: 127.1128, name: "평택" },
      평택: { lat: 36.9921, lon: 127.1128, name: "평택" },
      Paju: { lat: 37.7598, lon: 126.7802, name: "파주" },
      파주: { lat: 37.7598, lon: 126.7802, name: "파주" },
      Gimpo: { lat: 37.6152, lon: 126.7156, name: "김포" },
      김포: { lat: 37.6152, lon: 126.7156, name: "김포" },

      // 강원도
      Chuncheon: { lat: 37.8813, lon: 127.73, name: "춘천" },
      춘천: { lat: 37.8813, lon: 127.73, name: "춘천" },
      Gangneung: { lat: 37.7519, lon: 128.8761, name: "강릉" },
      강릉: { lat: 37.7519, lon: 128.8761, name: "강릉" },
      Wonju: { lat: 37.3422, lon: 127.9202, name: "원주" },
      원주: { lat: 37.3422, lon: 127.9202, name: "원주" },

      // 충청도
      Cheongju: { lat: 36.6424, lon: 127.489, name: "청주" },
      청주: { lat: 36.6424, lon: 127.489, name: "청주" },
      Cheonan: { lat: 36.8151, lon: 127.1139, name: "천안" },
      천안: { lat: 36.8151, lon: 127.1139, name: "천안" },
      Asan: { lat: 36.7898, lon: 127.0019, name: "아산" },
      아산: { lat: 36.7898, lon: 127.0019, name: "아산" },

      // 전라도
      Jeonju: { lat: 35.8242, lon: 127.148, name: "전주" },
      전주: { lat: 35.8242, lon: 127.148, name: "전주" },
      Iksan: { lat: 35.9439, lon: 126.9547, name: "익산" },
      익산: { lat: 35.9439, lon: 126.9547, name: "익산" },
      Gunsan: { lat: 35.9678, lon: 126.7368, name: "군산" },
      군산: { lat: 35.9678, lon: 126.7368, name: "군산" },
      Mokpo: { lat: 34.8118, lon: 126.3922, name: "목포" },
      목포: { lat: 34.8118, lon: 126.3922, name: "목포" },
      Yeosu: { lat: 34.7604, lon: 127.6622, name: "여수" },
      여수: { lat: 34.7604, lon: 127.6622, name: "여수" },
      Suncheon: { lat: 34.9507, lon: 127.4872, name: "순천" },
      순천: { lat: 34.9507, lon: 127.4872, name: "순천" },

      // 경상도
      Pohang: { lat: 36.019, lon: 129.3435, name: "포항" },
      포항: { lat: 36.019, lon: 129.3435, name: "포항" },
      Gyeongju: { lat: 35.8562, lon: 129.2247, name: "경주" },
      경주: { lat: 35.8562, lon: 129.2247, name: "경주" },
      Jinju: { lat: 35.1797, lon: 128.1076, name: "진주" },
      진주: { lat: 35.1797, lon: 128.1076, name: "진주" },
      Changwon: { lat: 35.2283, lon: 128.6811, name: "창원" },
      창원: { lat: 35.2283, lon: 128.6811, name: "창원" },
      Gimhae: { lat: 35.2285, lon: 128.8894, name: "김해" },
      김해: { lat: 35.2285, lon: 128.8894, name: "김해" },

      // 제주도
      Jeju: { lat: 33.4996, lon: 126.5312, name: "제주" },
      제주: { lat: 33.4996, lon: 126.5312, name: "제주" },
      Seogwipo: { lat: 33.2541, lon: 126.56, name: "서귀포" },
      서귀포: { lat: 33.2541, lon: 126.56, name: "서귀포" },
    };

    return cities[city] || cities["Seoul"];
  }

  // 현재 날씨 조회 (OpenWeatherMap API)
  async getCurrentWeather({ lat, lon, city }) {
    try {
      // 좌표 확인
      let coords;
      let locationName;

      if (city) {
        const cityData = this.getCityCoords(city);
        coords = { lat: cityData.lat, lon: cityData.lon };
        locationName = cityData.name;
      } else if (lat && lon) {
        coords = { lat: parseFloat(lat), lon: parseFloat(lon) };
        locationName = "현재 위치";
      } else {
        throw new Error("위도/경도 또는 도시명이 필요합니다.");
      }

      console.log("🔍 OpenWeather API 요청:");
      console.log("- 위치:", locationName);
      console.log("- 좌표:", coords);
      console.log("- API Key:", this.apiKey ? "설정됨" : "없음");

      const url = `${this.baseURL}/weather`;

      const response = await axios.get(url, {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          appid: this.apiKey,
          units: "metric", // 섭씨 온도
          lang: "kr", // 한국어
        },
        timeout: 10000,
      });

      console.log("✅ OpenWeather API 응답 성공");
      console.log("- 도시:", response.data.name);
      console.log("- 온도:", response.data.main.temp, "°C");
      console.log("- 날씨:", response.data.weather[0].description);

      return this.formatWeatherData(
        response.data,
        locationName,
        coords.lat,
        coords.lon
      );
    } catch (error) {
      console.error("❌ OpenWeather API 오류:", error.message);
      if (error.response) {
        console.error("❌ 응답 상태:", error.response.status);
        console.error("❌ 응답 데이터:", error.response?.data);
      }
      throw new Error("날씨 정보를 가져올 수 없습니다: " + error.message);
    }
  }

  // 예보 조회 (OpenWeatherMap 5일 예보)
  async getForecast({ lat, lon, city }) {
    try {
      let coords;
      let locationName;

      if (city) {
        const cityData = this.getCityCoords(city);
        coords = { lat: cityData.lat, lon: cityData.lon };
        locationName = cityData.name;
      } else if (lat && lon) {
        coords = { lat: parseFloat(lat), lon: parseFloat(lon) };
        locationName = "현재 위치";
      } else {
        throw new Error("위도/경도 또는 도시명이 필요합니다.");
      }

      console.log("🔍 OpenWeather 예보 API 요청:");
      console.log("- 위치:", locationName);
      console.log("- 좌표:", coords);
      console.log("- API Key:", this.apiKey ? "설정됨" : "없음");

      const url = `${this.baseURL}/forecast`;

      const response = await axios.get(url, {
        params: {
          lat: coords.lat,
          lon: coords.lon,
          appid: this.apiKey,
          units: "metric", // 섭씨 온도
          lang: "kr", // 한국어
        },
        timeout: 10000,
      });

      console.log("✅ OpenWeather 예보 API 응답 성공");
      console.log("- 도시:", response.data.city.name);
      console.log("- 예보 개수:", response.data.list.length);

      return this.formatForecastData(
        response.data,
        locationName,
        coords.lat,
        coords.lon
      );
    } catch (error) {
      console.error("❌ OpenWeather 예보 API 오류:", error.message);
      if (error.response) {
        console.error("❌ 응답 상태:", error.response.status);
        console.error("❌ 응답 데이터:", error.response.data);
      }
      throw new Error("날씨 예보를 가져올 수 없습니다: " + error.message);
    }
  }

  // 날씨 경고 판단 로직
  getWeatherAlert(data) {
    const weatherId = data.weather[0].id;
    const windSpeed = data.wind.speed;
    const visibility = data.visibility;
    const rain = data.rain?.["3h"] || data.rain?.["1h"] || 0;
    const snow = data.snow?.["3h"] || data.snow?.["1h"] || 0;
    const humidity = data.main.humidity;

    // 우선순위 순으로 체크
    // 1. 집중호우 (weather id 500-531: 비, 강수량 > 15mm/h)
    if ((weatherId >= 502 && weatherId <= 531) || rain > 15) {
      return "집중호우에 주의하세요.";
    }

    // 2. 폭설 (weather id 600-622: 눈, 적설량 > 5cm/h)
    if ((weatherId >= 602 && weatherId <= 622) || snow > 5) {
      return "폭설에 주의하세요.";
    }

    // 3. 뇌우/천둥번개 (weather id 200-232)
    if (weatherId >= 200 && weatherId <= 232) {
      return "천둥·번개에 주의하세요.";
    }

    // 4. 강풍 (풍속 > 14m/s)
    if (windSpeed > 14) {
      return "강풍에 주의하세요.";
    }

    // 5. 안개 (weather id 700-781, 가시거리 < 1km)
    if ((weatherId >= 701 && weatherId <= 741) || visibility < 1000) {
      return "짙은 안개에 주의하세요.";
    }

    // 6. 폭염 (기온 > 33°C, 습도 > 40%)
    if (data.main.temp > 33 && humidity > 40) {
      return "폭염에 주의하세요.";
    }

    // 7. 한파 (기온 < -12°C)
    if (data.main.temp < -12) {
      return "한파에 주의하세요.";
    }

    // 8. 비/눈 (weather id 300-531, 600-622)
    if (
      (weatherId >= 300 && weatherId <= 531) ||
      (weatherId >= 600 && weatherId <= 622)
    ) {
      return "우산을 챙기세요.";
    }

    // 9. 미세먼지/대기질 (가시거리 < 5km, 구름 > 80%)
    if (visibility < 5000 && data.clouds.all > 80) {
      return "대기정체에 주의하세요.";
    }

    // 10. 기본 메시지 (맑음/보통)
    return "기분 좋은 날씨에요.";
  }

  // 날씨 데이터 포맷팅 (OpenWeatherMap API 응답)
  formatWeatherData(data, locationName, lat, lon) {
    return {
      location: {
        name: locationName || data.name,
        country: data.sys?.country || "KR",
        coordinates: {
          lat: lat || data.coord?.lat,
          lng: lon || data.coord?.lon,
        },
      },
      weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      },
      temperature: {
        current: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        min: Math.round(data.main.temp_min),
        max: Math.round(data.main.temp_max),
      },
      details: {
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility,
        windSpeed: data.wind.speed,
        windDeg: data.wind.deg,
        clouds: data.clouds.all,
      },
      sun: {
        sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
        sunset: new Date(data.sys.sunset * 1000).toISOString(),
      },
      alert: this.getWeatherAlert(data),
      timestamp: new Date(data.dt * 1000).toISOString(),
    };
  }

  // 예보 데이터 포맷팅 (OpenWeatherMap API 응답)
  formatForecastData(data, locationName, lat, lon) {
    const forecasts = data.list.map((item) => ({
      timestamp: new Date(item.dt * 1000).toISOString(),
      weather: {
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      },
      temperature: {
        current: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        min: Math.round(item.main.temp_min),
        max: Math.round(item.main.temp_max),
      },
      details: {
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        windSpeed: item.wind.speed,
        windDeg: item.wind.deg,
        clouds: item.clouds.all,
        pop: Math.round(item.pop * 100), // 강수확률 (0~1 -> 0~100%)
      },
    }));

    return {
      location: {
        name: locationName || data.city.name,
        country: data.city.country,
        coordinates: {
          lat: lat || data.city.coord.lat,
          lng: lon || data.city.coord.lon,
        },
      },
      forecasts: forecasts,
    };
  }
}

module.exports = new WeatherService();
