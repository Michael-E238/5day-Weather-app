import dotenv from 'dotenv';
dotenv.config();
// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
// TODO: Complete the WeatherService class
class Weather {
  cityName: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  weatherIcon: string;
  constructor(
    cityName: string, 
    temperature: number, 
    humidity: number, 
    windSpeed: number, 
    uvIndex: number, 
    weatherIcon: string
  ) {
    this.cityName = cityName;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.uvIndex = uvIndex;
    this.weatherIcon = weatherIcon;
  }
}
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName!: string;
  static async getWeather(city: string) {
    return new WeatherService().getWeatherForCity(city);
  }
  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/';
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.cityName = '';
    this.getWeatherForCity = this.getWeatherForCity.bind(this);
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData.results[0];
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}geocode/json?address=${this.cityName}&key=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const response = await fetch(this.buildGeocodeQuery());
    if (!response.ok)
      throw new Error('Error fetching location data');
    const locationData = await response.json();
    if (!locationData || locationData.length === 0)
      throw new Error('Location data not found');
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok)
      throw new Error('Error fetching weather data');
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { temp, humidity, wind_speed, uvi, weather } = response.current;
    return new Weather(this.cityName, temp, humidity, wind_speed, uvi, weather[0].icon || '');
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    return weatherData.map((day) => {
      const { temp, humidity } = day;
      return new Weather(this.cityName, temp, humidity, currentWeather.windSpeed, currentWeather.uvIndex, day.weather[0].icon || '');
    });
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData.daily);
    return { current: currentWeather, forecast };
  }
}
export default new WeatherService();