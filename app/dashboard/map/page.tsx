"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Satellite, MapPin, Orbit, AlertTriangle, Play, Pause } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SatelliteData {
  id: string
  name: string
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  status: "active" | "inactive" | "critical"
  type: "communication" | "navigation" | "earth-observation" | "scientific"
  country: string
  launchDate: string
}

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapStyle, setMapStyle] = useState("satellite-v9")
  const [is3D, setIs3D] = useState(true)
  const [autoRotate, setAutoRotate] = useState(false)
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(null)
  const [satellites, setSatellites] = useState<SatelliteData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showOrbits, setShowOrbits] = useState(true)
  const [showDebris, setShowDebris] = useState(false)

  // Mock satellite data - in production, this would come from NASA APIs
  const mockSatellites: SatelliteData[] = [
    {
      id: "iss",
      name: "International Space Station",
      latitude: 51.6461,
      longitude: -0.1276,
      altitude: 408,
      velocity: 27600,
      status: "active",
      type: "scientific",
      country: "International",
      launchDate: "1998-11-20",
    },
    {
      id: "hubble",
      name: "Hubble Space Telescope",
      latitude: 28.5383,
      longitude: -80.6253,
      altitude: 547,
      velocity: 27300,
      status: "active",
      type: "scientific",
      country: "USA",
      launchDate: "1990-04-24",
    },
    {
      id: "starlink-1",
      name: "Starlink-1007",
      latitude: 40.7128,
      longitude: -74.006,
      altitude: 550,
      velocity: 27400,
      status: "active",
      type: "communication",
      country: "USA",
      launchDate: "2019-05-23",
    },
  ]

  useEffect(() => {
    setSatellites(mockSatellites)
  }, [])

  useEffect(() => {
    if (!mapContainer.current) return

    // Load Mapbox GL JS dynamically
    const loadMapbox = async () => {
      try {
        // Load Mapbox CSS
        const link = document.createElement("link")
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
        link.rel = "stylesheet"
        document.head.appendChild(link)

        // Load Mapbox JS
        const script = document.createElement("script")
        script.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"
        script.onload = initializeMap
        document.head.appendChild(script)
      } catch (error) {
        console.error("Failed to load Mapbox:", error)
      }
    }

    const initializeMap = () => {
      if (typeof window !== "undefined" && (window as any).mapboxgl && !map.current) {
        const mapboxgl = (window as any).mapboxgl
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: `mapbox://styles/mapbox/${mapStyle}`,
          projection: is3D ? "globe" : "mercator",
          center: [0, 20],
          zoom: is3D ? 1.5 : 2,
          pitch: is3D ? 0 : 0,
          bearing: 0,
        })

        map.current.on("load", () => {
          setMapLoaded(true)

          // Add atmosphere styling for globe
          if (is3D) {
            map.current.setFog({
              color: "rgb(186, 210, 235)",
              "high-color": "rgb(36, 92, 223)",
              "horizon-blend": 0.02,
              "space-color": "rgb(11, 11, 25)",
              "star-intensity": 0.6,
            })
          }

          // Add satellite markers
          addSatelliteMarkers()

          // Start auto-rotation if enabled
          if (autoRotate) {
            startAutoRotation()
          }
        })
      }
    }

    loadMapbox()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  const addSatelliteMarkers = () => {
    if (!map.current || !mapLoaded) return

    satellites.forEach((satellite) => {
      // Create custom marker element
      const el = document.createElement("div")
      el.className = "satellite-marker"
      el.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: ${satellite.status === "active" ? "#4e6aff" : satellite.status === "critical" ? "#ef4444" : "#6b7280"};
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        animation: pulse 2s infinite;
      `

      // Add marker to map
      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat([satellite.longitude, satellite.latitude])
        .addTo(map.current)

      // Add click event
      el.addEventListener("click", () => {
        setSelectedSatellite(satellite)

        // Create popup
        const popup = new (window as any).mapboxgl.Popup({ offset: 25 })
          .setLngLat([satellite.longitude, satellite.latitude])
          .setHTML(`
            <div class="p-3">
              <h3 class="font-bold text-sm mb-2">${satellite.name}</h3>
              <div class="space-y-1 text-xs">
                <div><strong>Altitude:</strong> ${satellite.altitude} km</div>
                <div><strong>Velocity:</strong> ${satellite.velocity.toLocaleString()} km/h</div>
                <div><strong>Status:</strong> <span class="capitalize">${satellite.status}</span></div>
                <div><strong>Type:</strong> ${satellite.type.replace("-", " ")}</div>
              </div>
            </div>
          `)
          .addTo(map.current)
      })

      // Add orbital path if enabled
      if (showOrbits) {
        addOrbitPath(satellite)
      }
    })
  }

  const addOrbitPath = (satellite: SatelliteData) => {
    // Generate orbital path coordinates (simplified circular orbit)
    const orbitPoints = []
    const radius = 0.1 // Simplified orbit radius

    for (let i = 0; i <= 360; i += 10) {
      const angle = (i * Math.PI) / 180
      const lat = satellite.latitude + radius * Math.cos(angle)
      const lng = satellite.longitude + radius * Math.sin(angle)
      orbitPoints.push([lng, lat])
    }

    map.current.addSource(`orbit-${satellite.id}`, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: orbitPoints,
        },
      },
    })

    map.current.addLayer({
      id: `orbit-${satellite.id}`,
      type: "line",
      source: `orbit-${satellite.id}`,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#4e6aff",
        "line-width": 2,
        "line-opacity": 0.6,
        "line-dasharray": [2, 2],
      },
    })
  }

  const startAutoRotation = () => {
    if (!map.current) return

    const rotateCamera = () => {
      if (autoRotate && map.current) {
        map.current.rotateTo(map.current.getBearing() + 0.5, { duration: 1000 })
        requestAnimationFrame(rotateCamera)
      }
    }
    rotateCamera()
  }

  const toggleMapStyle = (style: string) => {
    if (map.current) {
      setMapStyle(style)
      map.current.setStyle(`mapbox://styles/mapbox/${style}`)
    }
  }

  const toggle3D = () => {
    if (map.current) {
      const new3D = !is3D
      setIs3D(new3D)
      map.current.setProjection(new3D ? "globe" : "mercator")
      map.current.setZoom(new3D ? 1.5 : 2)

      if (new3D) {
        map.current.setFog({
          color: "rgb(186, 210, 235)",
          "high-color": "rgb(36, 92, 223)",
          "horizon-blend": 0.02,
          "space-color": "rgb(11, 11, 25)",
          "star-intensity": 0.6,
        })
      } else {
        map.current.setFog(null)
      }
    }
  }

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate)
    if (!autoRotate) {
      startAutoRotation()
    }
  }

  const filteredSatellites = satellites.filter((satellite) => {
    const matchesSearch = satellite.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || satellite.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Satellite Tracking Map</h1>
        <p className="text-gray-600">Real-time visualization of LEO satellites and orbital mechanics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#4e6aff]" />
                  Live Satellite Map
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={is3D ? "default" : "outline"}
                    size="sm"
                    onClick={toggle3D}
                    className={is3D ? "bg-[#4e6aff] hover:bg-[#4e6aff]/90" : ""}
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    3D Globe
                  </Button>
                  <Button
                    variant={autoRotate ? "default" : "outline"}
                    size="sm"
                    onClick={toggleAutoRotate}
                    className={autoRotate ? "bg-[#4e6aff] hover:bg-[#4e6aff]/90" : ""}
                  >
                    {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-[500px]">
                <div ref={mapContainer} className="w-full h-full rounded-b-lg" />

                {/* Map Controls */}
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMapStyle("satellite-v9")}
                      className={mapStyle === "satellite-v9" ? "bg-[#4e6aff] text-white" : ""}
                    >
                      Satellite
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMapStyle("streets-v12")}
                      className={mapStyle === "streets-v12" ? "bg-[#4e6aff] text-white" : ""}
                    >
                      Streets
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMapStyle("dark-v11")}
                      className={mapStyle === "dark-v11" ? "bg-[#4e6aff] text-white" : ""}
                    >
                      Dark
                    </Button>
                  </div>
                </div>

                {/* Layer Controls */}
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowOrbits(!showOrbits)}
                      className={showOrbits ? "bg-[#4e6aff] text-white" : ""}
                    >
                      <Orbit className="w-4 h-4 mr-1" />
                      Orbits
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDebris(!showDebris)}
                      className={showDebris ? "bg-red-500 text-white" : ""}
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Debris
                    </Button>
                  </div>
                </div>

                {!mapLoaded && (
                  <div className="absolute inset-0 bg-gray-100 rounded-b-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-[#4e6aff] border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading satellite map...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Satellite List */}
        <div className="lg:col-span-1">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Satellite className="w-5 h-5 text-[#4e6aff]" />
                Tracked Satellites
              </CardTitle>
              <div className="space-y-2">
                <Input
                  placeholder="Search satellites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8"
                />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="navigation">Navigation</SelectItem>
                    <SelectItem value="earth-observation">Earth Observation</SelectItem>
                    <SelectItem value="scientific">Scientific</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] overflow-y-auto">
                {filteredSatellites.map((satellite) => (
                  <div
                    key={satellite.id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedSatellite?.id === satellite.id ? "bg-blue-50 border-l-4 border-l-[#4e6aff]" : ""
                    }`}
                    onClick={() => {
                      setSelectedSatellite(satellite)
                      if (map.current) {
                        map.current.flyTo({
                          center: [satellite.longitude, satellite.latitude],
                          zoom: 4,
                          duration: 2000,
                        })
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{satellite.name}</h4>
                      <Badge
                        variant={
                          satellite.status === "active"
                            ? "default"
                            : satellite.status === "critical"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {satellite.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Altitude:</span>
                        <span>{satellite.altitude} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Velocity:</span>
                        <span>{satellite.velocity.toLocaleString()} km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="capitalize">{satellite.type.replace("-", " ")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Satellite Details */}
      {selectedSatellite && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Satellite className="w-5 h-5 text-[#4e6aff]" />
              {selectedSatellite.name} - Detailed Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orbital">Orbital Data</TabsTrigger>
                <TabsTrigger value="mission">Mission Info</TabsTrigger>
                <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Current Position</h4>
                    <div className="text-sm text-gray-600">
                      <div>Latitude: {selectedSatellite.latitude.toFixed(4)}°</div>
                      <div>Longitude: {selectedSatellite.longitude.toFixed(4)}°</div>
                      <div>Altitude: {selectedSatellite.altitude} km</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Performance</h4>
                    <div className="text-sm text-gray-600">
                      <div>Velocity: {selectedSatellite.velocity.toLocaleString()} km/h</div>
                      <div>
                        Status:{" "}
                        <Badge variant={selectedSatellite.status === "active" ? "default" : "destructive"}>
                          {selectedSatellite.status}
                        </Badge>
                      </div>
                      <div>Type: {selectedSatellite.type.replace("-", " ")}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Mission Details</h4>
                    <div className="text-sm text-gray-600">
                      <div>Country: {selectedSatellite.country}</div>
                      <div>Launch Date: {new Date(selectedSatellite.launchDate).toLocaleDateString()}</div>
                      <div>
                        Days in Orbit:{" "}
                        {Math.floor(
                          (Date.now() - new Date(selectedSatellite.launchDate).getTime()) / (1000 * 60 * 60 * 24),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orbital" className="mt-4">
                <div className="text-center py-8 text-gray-500">
                  <Orbit className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Orbital mechanics data visualization coming soon...</p>
                  <p className="text-sm">Integration with NASA TLE data in progress</p>
                </div>
              </TabsContent>

              <TabsContent value="mission" className="mt-4">
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Mission information and objectives coming soon...</p>
                  <p className="text-sm">Detailed mission data integration in progress</p>
                </div>
              </TabsContent>

              <TabsContent value="telemetry" className="mt-4">
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Real-time telemetry data coming soon...</p>
                  <p className="text-sm">Live satellite health monitoring in development</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
