import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Cloud, CloudRain, Sun, CloudSnow } from 'lucide-react';

export default function WeatherDashboard() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('weather_recent');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    fetchWeather('London');
  }, []);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    
    try {
      const mockData = {
        city: cityName,
        country: 'UK',
        temp: Math.floor(Math.random() * 30) + 5,
        feelsLike: Math.floor(Math.random() * 30) + 5,
        condition: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        pressure: Math.floor(Math.random() * 50) + 1000,
        visibility: Math.floor(Math.random() * 5) + 5,
        sunrise: '06:30 AM',
        sunset: '06:45 PM',
        forecast: [
          { day: 'Mon', temp: 18, condition: 'Clear' },
          { day: 'Tue', temp: 20, condition: 'Clouds' },
          { day: 'Wed', temp: 16, condition: 'Rain' },
          { day: 'Thu', temp: 19, condition: 'Clear' },
          { day: 'Fri', temp: 21, condition: 'Clear' }
        ]
      };

      setWeather(mockData);
      
      const updated = [cityName, ...recentSearches.filter(c => c !== cityName)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('weather_recent', JSON.stringify(updated));
      
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeather(city);
      setCity('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getWeatherIcon = (condition) => {
    switch(condition) {
      case 'Clear': return <Sun className="text-yellow-400" size={48} />;
      case 'Clouds': return <Cloud className="text-gray-400" size={48} />;
      case 'Rain': return <CloudRain className="text-blue-400" size={48} />;
      case 'Snow': return <CloudSnow className="text-blue-200" size={48} />;
      default: return <Sun className="text-yellow-400" size={48} />;
    }
  };

  const getBackgroundGradient = () => {
    if (!weather) return 'from-blue-400 to-blue-600';
    switch(weather.condition) {
      case 'Clear': return 'from-orange-400 to-pink-500';
      case 'Clouds': return 'from-gray-400 to-gray-600';
      case 'Rain': return 'from-blue-500 to-blue-700';
      case 'Snow': return 'from-blue-300 to-purple-400';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">WeatherNow</h1>
          <p className="text-gray-600">Real-time weather information at your fingertips</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for a city..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Search
            </button>
          </div>

          {recentSearches.length > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Recent:</span>
              {recentSearches.map((c, i) => (
                <button
                  key={i}
                  onClick={() => fetchWeather(c)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-xl">
            {error}
          </div>
        )}

        {weather && !loading && (
          <div className="space-y-6">
            <div className={`bg-gradient-to-br ${getBackgroundGradient()} rounded-2xl shadow-xl p-8 text-white`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={20} />
                    <h2 className="text-3xl font-bold">{weather.city}</h2>
                  </div>
                  <p className="text-xl opacity-90">{weather.country}</p>
                </div>
                <div className="text-right">
                  {getWeatherIcon(weather.condition)}
                </div>
              </div>
              
              <div className="flex items-end gap-4 mb-6">
                <div className="text-7xl font-bold">{weather.temp}°</div>
                <div className="text-2xl opacity-90 mb-2">
                  Feels like {weather.feelsLike}°
                </div>
              </div>
              
              <div className="text-2xl font-medium">{weather.condition}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Wind className="text-blue-500" size={24} />
                  <span className="text-gray-600 font-medium">Wind</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{weather.windSpeed} km/h</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Droplets className="text-blue-500" size={24} />
                  <span className="text-gray-600 font-medium">Humidity</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{weather.humidity}%</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="text-blue-500" size={24} />
                  <span className="text-gray-600 font-medium">Visibility</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{weather.visibility} km</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Gauge className="text-blue-500" size={24} />
                  <span className="text-gray-600 font-medium">Pressure</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{weather.pressure} mb</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Sunrise className="text-orange-500" size={24} />
                  <span className="text-gray-600 font-medium">Sunrise</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{weather.sunrise}</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Sunset className="text-orange-500" size={24} />
                  <span className="text-gray-600 font-medium">Sunset</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{weather.sunset}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">5-Day Forecast</h3>
              <div className="grid grid-cols-5 gap-4">
                {weather.forecast.map((day, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="font-medium text-gray-700 mb-3">{day.day}</div>
                    <div className="mb-3">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <div className="text-xl font-bold text-gray-800">{day.temp}°</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Built with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}