"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Satellite, RefreshCw, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function LiveSatelliteMap() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [satellites, setSatellites] = useState<any[]>([])
  const [lastUpdate, setLastUpdate] = useState<string>("")

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/nasa/satellites?ids=25544,43013,48274,47967")
      const result = await response.json()

      if (result.success) {
        setSatellites(result.data.satellites.slice(0, 4)) // Show first 4
        setLastUpdate(new Date().toLocaleTimeString())
      }
    } catch (error) {
      console.error("Failed to refresh satellite data:", error)
    } finally {
      setTimeout(() => setIsRefreshing(false), 2000)
    }
  }

  useEffect(() => {
    handleRefresh()
    const interval = setInterval(handleRefresh, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#4e6aff]" />
            </div>
            <div>
              <CardTitle className="text-xl">Live Satellite Tracking</CardTitle>
              <p className="text-sm text-gray-600">Real-time LEO satellite positions via NASA APIs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdate && <span className="text-xs text-gray-500">Updated: {lastUpdate}</span>}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder with NASA Integration */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-lg p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder-ov736.png')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10 text-center text-white">
            <Globe className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-semibold mb-2">NASA-Powered Satellite Visualization</h3>
            <p className="text-blue-200 mb-4">Real-time orbital tracking using NASA TLE data and SSC Web Services</p>
            <div className="mt-6 flex justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Operational ({satellites.filter((s) => s.altitude > 400).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Monitoring ({satellites.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">NASA Data</span>
              </div>
            </div>
            <Link href="/dashboard/satellites">
              <Button variant="secondary" className="mt-4">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Tracking
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Satellite List with NASA Data */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Live NASA Satellite Data</h4>
            <Badge className="bg-blue-100 text-blue-800">{satellites.length} Active</Badge>
          </div>
          {satellites.map((satellite, index) => (
            <div
              key={satellite.satelliteId || index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#4e6aff]/10 rounded-full flex items-center justify-center">
                  <Satellite className="w-4 h-4 text-[#4e6aff]" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{satellite.name || `Satellite ${index + 1}`}</div>
                  <div className="text-sm text-gray-600">ID: {satellite.satelliteId || `SAT-00${index + 1}`}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium">{satellite.altitude?.toFixed(0) || "550"} km</div>
                  <div className="text-xs text-gray-600">{satellite.position?.velocity?.toFixed(2) || "7.66"} km/s</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600">Position:</div>
                  <div className="text-xs font-mono">
                    {satellite.position?.latitude?.toFixed(2) || "0.00"}°,{" "}
                    {satellite.position?.longitude?.toFixed(2) || "0.00"}°
                  </div>
                </div>
                <Badge
                  className={
                    (satellite.altitude || 550) > 500 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {(satellite.altitude || 550) > 500 ? "optimal" : "monitoring"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* NASA Attribution */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Globe className="w-4 h-4" />
            <span className="font-medium">Data Source:</span>
            <span>NASA Satellite Services, TLE Data, and SSC Web Services</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
