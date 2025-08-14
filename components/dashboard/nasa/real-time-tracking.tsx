"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Satellite, RefreshCw, Globe, Zap } from "lucide-react"
import { useState, useEffect } from "react"
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

export default function RealTimeTracking() {
  const [satellites, setSatellites] = useState<SatelliteData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [selectedSatellite, setSelectedSatellite] = useState<string>("")
  const [orbitData, setOrbitData] = useState<any[]>([])

  const fetchSatelliteData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/nasa/satellites?ids=25544,43013,48274,47967")
      const result = await response.json()

      if (result.success) {
        setSatellites(result.data.satellites)
        setLastUpdate(new Date().toLocaleTimeString())
        if (!selectedSatellite && result.data.satellites.length > 0) {
          setSelectedSatellite(result.data.satellites[0].satelliteId)
        }
      }
    } catch (error) {
      console.error("Failed to fetch satellite data:", error)
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
          time: index * 10, // minutes
          altitude: pos.altitude,
          latitude: pos.latitude,
          longitude: pos.longitude,
        }))
        setOrbitData(chartData)
      }
    } catch (error) {
      console.error("Failed to fetch orbit prediction:", error)
    }
  }

  useEffect(() => {
    fetchSatelliteData()
    const interval = setInterval(fetchSatelliteData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedSatellite) {
      fetchOrbitPrediction(selectedSatellite)
    }
  }, [selectedSatellite])

  const getStatusColor = (altitude: number) => {
    if (altitude > 600) return "bg-green-100 text-green-800"
    if (altitude > 400) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center">
                <Satellite className="w-5 h-5 text-[#4e6aff]" />
              </div>
              <div>
                <CardTitle className="text-xl">NASA Real-Time Satellite Tracking</CardTitle>
                <p className="text-sm text-gray-600">Live orbital data powered by NASA TLE and SSC APIs</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdate && <span className="text-sm text-gray-600">Last update: {lastUpdate}</span>}
              <Button variant="outline" size="sm" onClick={fetchSatelliteData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
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

      {/* NASA Data Attribution */}
      <Card className="border-0 shadow-sm bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <div className="text-sm">
              <strong className="text-blue-900">Powered by NASA Open Data:</strong>
              <span className="text-blue-700 ml-2">
                Real-time satellite tracking using NASA TLE data, SSC Web Services, and CDDIS orbital products. Data
                updates every 30 seconds for accurate LEO monitoring.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
