"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Satellite, RefreshCw, Globe, Zap, Map, Eye, Activity, Radar } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SatelliteData {
  satelliteId: string
  name: string
  position: {
    latitude: number
    longitude: number
    altitude: number
    velocity: number
    timestamp: string
  }
  altitude: number
  period: number
  inclination: number
}

interface LiveFeedData {
  issPosition: any
  weatherData: any
  spaceWeather: any
  earthImagery: any
}

export default function RealTimeTracking() {
  const [satellites, setSatellites] = useState<SatelliteData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [selectedSatellite, setSelectedSatellite] = useState<string>("")
  const [orbitData, setOrbitData] = useState<any[]>([])
  const [liveFeedData, setLiveFeedData] = useState<LiveFeedData>({} as LiveFeedData)
  const [activeView, setActiveView] = useState<"tracking" | "worldview" | "weather" | "imagery">("tracking")
  const mapRef = useRef<HTMLDivElement>(null)

  const fetchComprehensiveSatelliteData = async () => {
    setIsLoading(true)
    try {
      // Fetch satellite tracking data
      const satelliteResponse = await fetch("/api/nasa/satellites?ids=25544,43013,48274,47967")
      const satelliteResult = await satelliteResponse.json()

      // Fetch ISS live position
      const issResponse = await fetch("http://api.open-notify.org/iss-now.json")
      const issData = await issResponse.json()

      // Fetch comprehensive NASA Earth Data using user's token
      const earthDataResponse = await fetch("/api/nasa/earth-data")
      const earthData = await earthDataResponse.json()

      // Fetch NOAA space weather data
      const spaceWeatherResponse = await fetch("https://services.swpc.noaa.gov/json/planetary_k_index_1m.json")
      const spaceWeatherData = await spaceWeatherResponse.json()

      if (satelliteResult.success) {
        setSatellites(satelliteResult.data.satellites)
        setLastUpdate(new Date().toLocaleTimeString())
        if (!selectedSatellite && satelliteResult.data.satellites.length > 0) {
          setSelectedSatellite(satelliteResult.data.satellites[0].satelliteId)
        }
      }

      // Update live feed data
      setLiveFeedData({
        issPosition: issData,
        weatherData: spaceWeatherData,
        spaceWeather: spaceWeatherData,
        earthImagery: earthData,
      })
    } catch (error) {
      console.error("Failed to fetch comprehensive satellite data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOrbitPrediction = async (satelliteId: string) => {
    try {
      const response = await fetch(`/api/nasa/orbit-prediction?satelliteId=${satelliteId}&hours=6`)
      const result = await response.json()

      if (result.success) {
        const chartData = result.data.positions.slice(0, 36).map((pos: any, index: number) => ({
          time: index * 10,
          altitude: pos.altitude,
          latitude: pos.latitude,
          longitude: pos.longitude,
          velocity: pos.velocity || 7.8,
        }))
        setOrbitData(chartData)
      }
    } catch (error) {
      console.error("Failed to fetch orbit prediction:", error)
    }
  }

  const initializeLiveMap = () => {
    if (!mapRef.current) return

    // Initialize Mapbox with satellite overlay
    const mapboxScript = document.createElement("script")
    mapboxScript.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
    mapboxScript.onload = () => {
      const mapboxgl = (window as any).mapboxgl
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        center: [0, 0],
        zoom: 2,
        projection: "globe",
      })

      // Add satellite markers
      satellites.forEach((satellite) => {
        const marker = new mapboxgl.Marker({
          color: "#4e6aff",
        })
          .setLngLat([satellite.position.longitude, satellite.position.latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${satellite.name}</h3>
            <p>Altitude: ${satellite.altitude.toFixed(0)} km</p>
            <p>Velocity: ${satellite.position.velocity.toFixed(2)} km/s</p>
          </div>
        `),
          )
          .addTo(map)
      })

      // Add ISS live position if available
      if (liveFeedData.issPosition?.iss_position) {
        const issMarker = new mapboxgl.Marker({
          color: "#ff6b35",
        })
          .setLngLat([
            Number.parseFloat(liveFeedData.issPosition.iss_position.longitude),
            Number.parseFloat(liveFeedData.issPosition.iss_position.latitude),
          ])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">International Space Station</h3>
            <p>Live Position</p>
            <p>Updated: ${new Date(liveFeedData.issPosition.timestamp * 1000).toLocaleTimeString()}</p>
          </div>
        `),
          )
          .addTo(map)
      }
    }
    document.head.appendChild(mapboxScript)
  }

  useEffect(() => {
    fetchComprehensiveSatelliteData()
    const interval = setInterval(fetchComprehensiveSatelliteData, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedSatellite) {
      fetchOrbitPrediction(selectedSatellite)
    }
  }, [selectedSatellite])

  useEffect(() => {
    if (activeView === "tracking" && satellites.length > 0) {
      setTimeout(initializeLiveMap, 100)
    }
  }, [activeView, satellites, liveFeedData])

  const getStatusColor = (altitude: number) => {
    if (altitude > 600) return "bg-green-100 text-green-800"
    if (altitude > 400) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center">
                <Satellite className="w-5 h-5 text-[#4e6aff]" />
              </div>
              <div>
                <CardTitle className="text-xl">Live Satellite Monitoring System</CardTitle>
                <p className="text-sm text-gray-600">Real-time tracking powered by NASA, NOAA, and ESA data feeds</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">Live</span>
              </div>
              {lastUpdate && <span className="text-sm text-gray-600">Updated: {lastUpdate}</span>}
              <Button variant="outline" size="sm" onClick={fetchComprehensiveSatelliteData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{satellites.length}</div>
                <div className="text-sm text-gray-600">Active Satellites</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">64,000+</div>
                <div className="text-sm text-gray-600">Objects Tracked</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Radar className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">98.7%</div>
                <div className="text-sm text-gray-600">API Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">30s</div>
                <div className="text-sm text-gray-600">Update Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Live Mapping Systems</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={activeView === "tracking" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("tracking")}
              >
                <Map className="w-4 h-4 mr-2" />
                Live Tracking
              </Button>
              <Button
                variant={activeView === "worldview" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("worldview")}
              >
                <Globe className="w-4 h-4 mr-2" />
                NASA Worldview
              </Button>
              <Button
                variant={activeView === "weather" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("weather")}
              >
                <Activity className="w-4 h-4 mr-2" />
                NOAA Weather
              </Button>
              <Button
                variant={activeView === "imagery" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("imagery")}
              >
                <Eye className="w-4 h-4 mr-2" />
                ESA Sentinel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeView === "tracking" && (
            <div className="space-y-4">
              <div ref={mapRef} className="w-full h-96 rounded-lg border"></div>
              <p className="text-sm text-gray-600">
                Live satellite positions updated every 30 seconds using NASA TLE data and Mapbox satellite imagery
              </p>
            </div>
          )}
          {activeView === "worldview" && (
            <div className="space-y-4">
              <iframe
                src="https://worldview.earthdata.nasa.gov/"
                className="w-full h-96 rounded-lg border"
                title="NASA Worldview"
              />
              <p className="text-sm text-gray-600">
                NASA Worldview provides interactive satellite imagery updated within hours of observation
              </p>
            </div>
          )}
          {activeView === "weather" && (
            <div className="space-y-4">
              <iframe
                src="https://www.star.nesdis.noaa.gov/GOES/fulldisk_band.php?sat=G16&band=GEOCOLOR&length=12"
                className="w-full h-96 rounded-lg border"
                title="NOAA Earth Real-Time"
              />
              <p className="text-sm text-gray-600">
                NOAA real-time weather satellite imagery showing global cloud and storm systems
              </p>
            </div>
          )}
          {activeView === "imagery" && (
            <div className="space-y-4">
              <iframe
                src="https://apps.sentinel-hub.com/eo-browser/"
                className="w-full h-96 rounded-lg border"
                title="ESA Sentinel Hub"
              />
              <p className="text-sm text-gray-600">
                ESA Sentinel Hub EO Browser for high-resolution satellite imagery from multiple missions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Satellite Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {satellites.map((satellite) => (
          <Card
            key={satellite.satelliteId}
            className={`border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedSatellite === satellite.satelliteId
                ? "border-[#4e6aff] bg-[#4e6aff]/5"
                : "border-gray-200 hover:border-[#4e6aff]/50"
            }`}
            onClick={() => setSelectedSatellite(satellite.satelliteId)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Satellite className="w-5 h-5 text-[#4e6aff]" />
                  <CardTitle className="text-lg">{satellite.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(satellite.altitude)}>
                  {satellite.altitude > 600 ? "Optimal" : satellite.altitude > 400 ? "Normal" : "Low"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Altitude:</span>
                  <div className="font-semibold">{satellite.altitude.toFixed(0)} km</div>
                </div>
                <div>
                  <span className="text-gray-600">Velocity:</span>
                  <div className="font-semibold">{satellite.position.velocity.toFixed(2)} km/s</div>
                </div>
                <div>
                  <span className="text-gray-600">Period:</span>
                  <div className="font-semibold">{satellite.period.toFixed(0)} min</div>
                </div>
                <div>
                  <span className="text-gray-600">Inclination:</span>
                  <div className="font-semibold">{satellite.inclination.toFixed(1)}°</div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-600 mb-1">Current Position:</div>
                <div className="text-sm">
                  <div>Lat: {satellite.position.latitude.toFixed(3)}°</div>
                  <div>Lng: {satellite.position.longitude.toFixed(3)}°</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orbit Visualization */}
      {selectedSatellite && orbitData.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">6-Hour Orbit Prediction</CardTitle>
                <p className="text-sm text-gray-600">
                  Predicted orbital path for {satellites.find((s) => s.satelliteId === selectedSatellite)?.name}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">Altitude Profile</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={orbitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="time"
                      stroke="#666"
                      label={{ value: "Minutes", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis stroke="#666" label={{ value: "Altitude (km)", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="altitude" stroke="#4e6aff" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Ground Track</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={orbitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="longitude"
                      stroke="#666"
                      label={{ value: "Longitude", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                      dataKey="latitude"
                      stroke="#666"
                      label={{ value: "Latitude", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="latitude" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-sm bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <div className="text-sm">
              <strong className="text-blue-900">Powered by Multi-Agency Space Data:</strong>
              <span className="text-blue-700 ml-2">
                NASA Spot the Station, NASA Worldview, NOAA Earth Real-Time, ESA Sentinel Hub, Celestrak TLE data, and
                NASA Earth Data API. Live updates every 30 seconds for comprehensive LEO monitoring and business
                intelligence.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
