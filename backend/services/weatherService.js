const axios = require("axios");

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseURL = "https://api.openweathermap.org/data/2.5";
  }

  // 현재 날씨 조회
  async getCurrentWeather({ lat, lon, city }) {
    try {
      let url = `${this.baseURL}/weather?appid=${this.apiKey}&units=metric&lang=kr`;

      if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`;
      } else if (city) {
        url += `&q=${encodeURIComponent(city)}`;
      } else {
        throw new Error("위도/경도 또는 도시명이 필요합니다.");
      }

      const response = await axios.get(url);
      return this.formatWeatherData(response.data);
    } catch (error) {
      console.error(
        "OpenWeather API 오류:",
        error.response?.data || error.message
      );
      throw new Error("날씨 정보를 가져올 수 없습니다.");
    }
  }

  // 5일 예보 조회
  async getForecast({ lat, lon, city }) {
    try {
      let url = `${this.baseURL}/forecast?appid=${this.apiKey}&units=metric&lang=kr`;

      if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`;
      } else if (city) {
        url += `&q=${encodeURIComponent(city)}`;
      } else {
        throw new Error("위도/경도 또는 도시명이 필요합니다.");
      }

      const response = await axios.get(url);
      return this.formatForecastData(response.data);
    } catch (error) {
      console.error(
        "OpenWeather Forecast API 오류:",
        error.response?.data || error.message
      );
      throw new Error("날씨 예보를 가져올 수 없습니다.");
    }
  }

  // 날씨 데이터 포맷팅
  formatWeatherData(data) {
    return {
      location: {
        name: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lng: data.coord.lon,
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
      timestamp: new Date(data.dt * 1000).toISOString(),
    };
  }

  // 예보 데이터 포맷팅
  formatForecastData(data) {
    return {
      location: {
        name: data.city.name,
        country: data.city.country,
        coordinates: {
          lat: data.city.coord.lat,
          lng: data.city.coord.lon,
        },
      },
      forecasts: data.list.map((item) => ({
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
          pop: item.pop, // 강수 확률
        },
      })),
    };
  }
}

module.exports = new WeatherService();
