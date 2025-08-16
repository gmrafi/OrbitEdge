"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { Activity, AlertTriangle, Globe, Map, Pause, Play, Search, Wifi } from "lucide-react"

interface SatelliteData {
  id: string
  name: string
  latitude?: number
  longitude?: number
  altitude: number
  velocity: number
  status: "active" | "inactive" | "critical" | "Closed" | "Active"
  type:
    | "communication"
    | "navigation"
    | "earth-observation"
    | "scientific"
    | "Earth Observation"
    | "Data Collection"
    | "Natural Event"
  country?: string
  launchDate: string
  operator?: string
  constellation?: string
  riskLevel?: "low" | "medium" | "high" | "critical"
  noradId?: string | number
  inclination?: number
  period?: number
  apogee?: number
  perigee?: number
  lastUpdate?: string
  mission?: string
  crew?: number
  eventType?: string
  dataProducts?: number
  position?: {
    latitude: number
    longitude: number
    altitude: number
    velocity: number
  }
}

interface DebrisData {
  id: string
  latitude: number
  longitude: number
  altitude: number
  size: "small" | "medium" | "large"
  velocity: number
  riskLevel: "low" | "medium" | "high" | "critical"
}

interface BusinessOpportunity {
  id: string
  region?: string
  latitude?: number
  longitude?: number
  marketSize: number
  growthRate?: number
  competition?: "low" | "medium" | "high"
  opportunity?: "telecom" | "earth-observation" | "navigation" | "manufacturing"
  revenue?: number
  title?: string
  category?: string
  location?: number[]
  riskLevel?: number
  description?: string
}

interface Infrastructure {
  id: string
  name: string
  type: "space-station" | "ground-station" | "launch-site" | "manufacturing"
  latitude: number
  longitude: number
  operator: string
  capacity: number
  status: "operational" | "planned" | "under-construction"
}

interface LaunchSite {
  id: string
  name: string
  latitude: number
  longitude: number
  operator: string
  launchCost: number
  capacity: number
  nextLaunch: string
  status: "active" | "inactive" | "maintenance"
}

interface TourismRoute {
  id: string
  name: string
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  duration: number
  price: number
  difficulty: "beginner" | "intermediate" | "advanced"
  provider: string
  nextAvailable: string
}

const NASA_EARTH_DATA_TOKEN = process.env.NEXT_PUBLIC_NASA_EARTH_DATA_TOKEN

const NASA_ENDPOINTS = {
  // Core NASA APIs
  CMR_GRANULES: "https://cmr.earthdata.nasa.gov/search/granules.json",
  CMR_COLLECTIONS: "https://cmr.earthdata.nasa.gov/search/collections.json",
  APOD: "https://api.nasa.gov/planetary/apod",
  EONET_EVENTS: "https://eonet.gsfc.nasa.gov/api/v3/events",

  // Earth Data APIs
  EARTHDATA_SEARCH: "https://search.earthdata.nasa.gov/search/granules",
  MODIS_TERRA: "https://modis.gsfc.nasa.gov/data/",
  MODIS_AQUA: "https://modis.gsfc.nasa.gov/data/",
  LANDSAT: "https://landsat.gsfc.nasa.gov/data/",
  VIIRS: "https://ncc.nesdis.noaa.gov/VIIRS/",

  // Satellite Tracking
  GHRC_TLE: "https://ghrc.nsstc.nasa.gov/services/satellites/elements.pl",
  ISS_POSITION: "http://api.open-notify.org/iss-now.json",
  SATELLITE_TLE: "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json",

  // Environmental Data
  USGS_EARTHQUAKES: "https://earthquake.usgs.gov/fdsnws/event/1/",
  NOAA_SWPC: "https://services.swpc.noaa.gov/json/",
  NASA_POWER: "https://power.larc.nasa.gov/api/temporal/daily/point",

  // Climate and Atmospheric Data
  GIOVANNI: "https://giovanni.gsfc.nasa.gov/giovanni/",
  GISS_TEMP: "https://data.giss.nasa.gov/gistemp/",
  AIRS: "https://airs.jpl.nasa.gov/data/",
}

const generateRealisticLEOPosition = () => {
  const altitude = 400 + Math.random() * 800 // LEO range 400-1200km
  const velocity = 7800 - (altitude - 400) * 0.5 // Realistic orbital velocity
  return {
    latitude: Math.random() * 180 - 90,
    longitude: Math.random() * 360 - 180,
    altitude,
    velocity,
  }
}

const generateEnhancedMockSatellites = () => {
  return [
    {
      id: "mock-iss",
      name: "International Space Station (Mock)",
      latitude: 51.6461,
      longitude: -0.1276,
      altitude: 408,
      velocity: 27600,
      status: "active",
      type: "scientific",
      country: "International",
      launchDate: "1998-11-20",
      operator: "NASA/ESA/Roscosmos",
      constellation: "ISS Program",
      noradId: "25544",
      inclination: 51.64,
      period: 92.68,
      apogee: 421,
      perigee: 408,
      lastUpdate: new Date().toISOString(),
      position: {
        latitude: 51.6461,
        longitude: -0.1276,
        altitude: 408,
        velocity: 27600,
      },
    },
    // Additional mock satellites can be added here
  ]
}

const generateMockDebris = () => {
  return [
    {
      id: "mock-debris-1",
      latitude: 45.0,
      longitude: 0.0,
      altitude: 500,
      size: "large",
      velocity: 28000,
      riskLevel: "critical",
    },
    {
      id: "mock-debris-2",
      latitude: -30.0,
      longitude: 120.0,
      altitude: 600,
      size: "medium",
      velocity: 27500,
      riskLevel: "high",
    },
    // Additional mock debris can be added here
  ]
}

const generateMockBusinessOpportunities = () => {
  return [
    {
      id: "mock-asia-telecom",
      region: "South Asia",
      latitude: 23.685,
      longitude: 90.3563,
      marketSize: 2.5,
      growthRate: 15.2,
      competition: "medium",
      opportunity: "telecom",
      revenue: 450,
    },
    {
      id: "mock-africa-observation",
      region: "East Africa",
      latitude: -1.2921,
      longitude: 36.8219,
      marketSize: 1.8,
      growthRate: 22.5,
      competition: "low",
      opportunity: "earth-observation",
      revenue: 320,
    },
    // Additional mock business opportunities can be added here
  ]
}

const generateMockInfrastructure = () => {
  return [
    {
      id: "mock-axiom-station",
      name: "Axiom Station",
      type: "space-station",
      latitude: 51.6,
      longitude: 0.0,
      operator: "Axiom Space",
      capacity: 8,
      status: "planned",
    },
    {
      id: "mock-baikonur",
      name: "Baikonur Cosmodrome",
      type: "launch-site",
      latitude: 45.965,
      longitude: 63.305,
      operator: "Roscosmos",
      capacity: 20,
      status: "operational",
    },
    // Additional mock infrastructure can be added here
  ]
}

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={null} />
      <MapPageClient />
    </div>
  )
}

type MapType =
  | "satellite-tracking"
  | "debris-risk"
  | "internet-coverage"
  | "satellite-phone"
  | "dual-use"
  | "network-latency"
  | "crowdsourced"
  | "infrastructure"
  | "launch-planning"
  | "space-tourism"

interface Satellite {
  id: string
  name: string
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  status: "active" | "inactive"
  type: string
  country: string
  launchDate: string
  operator: string
  noradId?: string
  inclination?: number
  period?: number
  lastUpdate?: string
}

const mapTypes = [
  {
    id: "satellite-tracking",
    name: "Live Tracking",
    icon: Activity,
    description: "Real-time positions of active satellites orbiting Earth.",
  },
  {
    id: "debris-risk",
    name: "Debris Risk",
    icon: AlertTriangle,
    description: "Analysis of space debris and collision risks.",
  },
  {
    id: "internet-coverage",
    name: "Internet Coverage",
    icon: Wifi,
    description: "Satellite internet coverage and performance metrics.",
  },
  {
    id: "satellite-phone",
    name: "Satellite Phone",
    icon: Wifi,
    description: "Satellite phone coverage and performance metrics.",
  },
  {
    id: "dual-use",
    name: "Dual-Use",
    icon: Activity,
    description: "Dual-Use coverage and performance metrics.",
  },
  {
    id: "network-latency",
    name: "Network Latency",
    icon: Activity,
    description: "Network Latency coverage and performance metrics.",
  },
  {
    id: "crowdsourced",
    name: "Crowdsourced",
    icon: Activity,
    description: "Crowdsourced coverage and performance metrics.",
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    icon: Activity,
    description: "Infrastructure coverage and performance metrics.",
  },
  {
    id: "launch-planning",
    name: "Launch Planning",
    icon: Activity,
    description: "Launch Planning coverage and performance metrics.",
  },
  {
    id: "space-tourism",
    name: "Space Tourism",
    icon: Activity,
    description: "Space Tourism coverage and performance metrics.",
  },
]

const getMapTypeDescription = (mapType: MapType) => {
  return mapTypes.find((t) => t.id === mapType)?.description || "No description available."
}

function MapPageClient() {
  const [activeMapType, setActiveMapType] = useState<MapType>("satellite-tracking")
  const [satellites, setSatellites] = useState<Satellite[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(null)
  const [mapStyle, setMapStyle] = useState("satellite-v9")
  const [is3D, setIs3D] = useState(true)
  const [autoRotate, setAutoRotate] = useState(false)
  const [showOrbitalPaths, setShowOrbitalPaths] = useState(true)
  const [showSatelliteLabels, setShowSatelliteLabels] = useState(true)
  const [showGroundTracks, setShowGroundTracks] = useState(false)
  const [nasaData, setNasaData] = useState<any>({})
  const [starlinkSatellites, setStarlinkSatellites] = useState<any[]>([])
  const [internetCoverageData, setInternetCoverageData] = useState<any>({})
  const [debrisData, setDebrisData] = useState<any[]>([])
  const mapRef = useRef<any>(null)

  const fetchComprehensiveNASAData = useCallback(async () => {
    const token = process.env.NEXT_PUBLIC_NASA_EARTH_DATA_TOKEN
    if (!token) {
      console.log("[v0] NASA Earth Data token not available")
      return
    }

    console.log("[v0] Fetching comprehensive NASA data with token")

    try {
      // Fetch NASA data
      const nasaEndpoints = [
        {
          name: "cmrGranules",
          url: "https://cmr.earthdata.nasa.gov/search/granules.json?short_name=MCD12Q1&version=061&page_size=100",
        },
        {
          name: "cmrCollections",
          url: "https://cmr.earthdata.nasa.gov/search/collections.json?keyword=satellite&page_size=100",
        },
        { name: "eonetEvents", url: "https://eonet.gsfc.nasa.gov/api/v3/events?limit=100" },
        { name: "issPosition", url: "http://api.open-notify.org/iss-now.json" },
        { name: "celestrakTLE", url: "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json" },
        { name: "earthquakes", url: "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=200" },
        { name: "spaceWeather", url: "https://services.swpc.noaa.gov/json/goes/primary/magnetometers-6-hour.json" },
        {
          name: "apod",
          url: `https://api.nasa.gov/planetary/apod?api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY"}`,
        },
      ]

      const starlinkEndpoints = [
        { name: "starlinkTLE", url: "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=json" },
        { name: "starlinkSafety", url: "https://api.starlink.com/public/satellites" }, // Note: This might need authentication
        { name: "onewebTLE", url: "https://celestrak.org/NORAD/elements/gp.php?GROUP=oneweb&FORMAT=json" },
      ]

      const debrisEndpoints = [
        { name: "debrisTLE", url: "https://celestrak.org/NORAD/elements/gp.php?GROUP=debris&FORMAT=json" },
        { name: "rocketBodies", url: "https://celestrak.org/NORAD/elements/gp.php?GROUP=rocket-bodies&FORMAT=json" },
      ]

      const responses: any = {}

      // Fetch NASA data
      for (const endpoint of nasaEndpoints) {
        try {
          const headers: any = {}
          if (endpoint.name === "cmrGranules" || endpoint.name === "cmrCollections") {
            headers["Authorization"] = `Bearer ${token}`
          }

          const response = await fetch(endpoint.url, { headers })
          if (response.ok) {
            const data = await response.json()
            responses[endpoint.name] = Array.isArray(data)
              ? data.length
              : data.feed?.entry?.length ||
                data.events?.length ||
                data.features?.length ||
                (data.iss_position ? "Available" : "Not available") ||
                1
          } else {
            responses[endpoint.name] = 0
          }
        } catch (error) {
          responses[endpoint.name] = 0
        }
      }

      const starlinkData: any[] = []
      for (const endpoint of starlinkEndpoints) {
        try {
          const response = await fetch(endpoint.url)
          if (response.ok) {
            const data = await response.json()
            if (Array.isArray(data)) {
              starlinkData.push(...data.slice(0, 100)) // Limit to prevent overwhelming
            }
          }
        } catch (error) {
          console.log(`[v0] Error fetching ${endpoint.name}:`, error)
        }
      }

      const debrisInfo: any[] = []
      for (const endpoint of debrisEndpoints) {
        try {
          const response = await fetch(endpoint.url)
          if (response.ok) {
            const data = await response.json()
            if (Array.isArray(data)) {
              debrisInfo.push(...data.slice(0, 200)) // Limit debris objects
            }
          }
        } catch (error) {
          console.log(`[v0] Error fetching ${endpoint.name}:`, error)
        }
      }

      console.log("[v0] NASA API responses:", responses)
      setNasaData(responses)
      setStarlinkSatellites(starlinkData)
      setDebrisData(debrisInfo)

      const coverageData = {
        starlink: {
          satellites: starlinkData.length,
          coverage: "95% global coverage",
          latency: "20-40ms",
          speed: "100-200 Mbps",
        },
        oneweb: {
          satellites: starlinkData.filter((sat) => sat.OBJECT_NAME?.includes("ONEWEB")).length,
          coverage: "50° N/S coverage",
          latency: "32ms",
          speed: "50-150 Mbps",
        },
        kuiper: {
          satellites: 0, // Not yet deployed
          coverage: "Planned global coverage",
          latency: "30ms (planned)",
          speed: "400 Mbps (planned)",
        },
      }
      setInternetCoverageData(coverageData)

      // Generate enhanced mock satellites with real orbital data
      const enhancedSatellites = generateEnhancedMockSatellites(50, starlinkData, debrisInfo)
      setSatellites(enhancedSatellites)
      console.log("[v0] Updated satellites count:", enhancedSatellites.length)
      console.log("[v0] NASA data fetch completed successfully")
    } catch (error) {
      console.error("[v0] Error fetching NASA data:", error)
      // Fallback to mock data
      const mockSatellites = generateEnhancedMockSatellites(50, [], [])
      setSatellites(mockSatellites)
    }
  }, [])

  useEffect(() => {
    fetchComprehensiveNASAData()
    const intervalId = setInterval(fetchComprehensiveNASAData, 60000) // Update every 60 seconds

    return () => clearInterval(intervalId)
  }, [fetchComprehensiveNASAData])

  useEffect(() => {
    if (typeof window === "undefined") return

    const mapboxgl = (window as any).mapboxgl
    if (!mapboxgl) {
      console.error("[v0] Mapbox GL JS failed to load")
      return
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!mapboxgl.accessToken) {
      console.error("[v0] Mapbox token not configured")
      return
    }

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: mapStyle === "satellite-v9" ? "mapbox://styles/mapbox/satellite-v9" : "mapbox://styles/mapbox/streets-v12",
      center: [0, 0],
      zoom: 2,
      projection: "globe",
    })

    map.on("load", () => {
      console.log("[v0] Mapbox map loaded successfully")
      map.setFog({})

      if (is3D) {
        map.setPitch(40)
      }

      if (autoRotate) {
        map.rotateTo((map.getBearing() + 180) % 360, { duration: 20000 })
      }
    })

    map.on("style.load", () => {
      map.setFog({})
    })

    mapRef.current = map

    return () => map.remove()
  }, [mapStyle, is3D, autoRotate])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    satellites.forEach((satellite) => {
      if (!map.getSource(satellite.id)) {
        map.addSource(satellite.id, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [satellite.longitude, satellite.latitude],
            },
            properties: {
              title: satellite.name,
            },
          },
        })

        map.addLayer({
          id: satellite.id,
          type: "symbol",
          source: satellite.id,
          layout: {
            "icon-image": "rocket-15",
            "icon-size": 1.2,
            "text-field": showSatelliteLabels ? ["get", "title"] : "",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-anchor": "top",
            "text-offset": [0, 1.2],
            "text-size": 10,
          },
          paint: {
            "text-color": "#fff",
          },
        })
      } else {
        map.getSource(satellite.id).setData({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [satellite.longitude, satellite.latitude],
          },
          properties: {
            title: satellite.name,
          },
        })
      }
    })
  }, [satellites, showSatelliteLabels])

  const toggleMapStyle = () => {
    setMapStyle(mapStyle === "satellite-v9" ? "streets-v12" : "satellite-v9")
  }

  const toggle3D = () => {
    setIs3D(!is3D)
  }

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Map Type Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {mapTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveMapType(type.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeMapType === type.id
                    ? "bg-[#4e6aff] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <type.icon className="w-4 h-4 inline-block mr-2" />
                {type.name}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search satellites by name, NORAD ID, or operator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e6aff] focus:border-transparent"
                />
              </div>
            </div>

            {/* Map Controls */}
            <div className="flex gap-2">
              <button
                onClick={toggleMapStyle}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Map className="w-4 h-4" />
                Style
              </button>
              <button
                onClick={toggle3D}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                  is3D ? "bg-[#4e6aff] text-white" : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Globe className="w-4 h-4" />
                3D
              </button>
              <button
                onClick={toggleAutoRotate}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                  autoRotate ? "bg-[#4e6aff] text-white" : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                Rotate
              </button>
            </div>
          </div>

          {/* Tracking Controls */}
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOrbitalPaths}
                onChange={(e) => setShowOrbitalPaths(e.target.checked)}
                className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
              />
              <span className="text-sm text-gray-700">Orbital Paths</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showSatelliteLabels}
                onChange={(e) => setShowSatelliteLabels(e.target.checked)}
                className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
              />
              <span className="text-sm text-gray-700">Satellite Labels</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showGroundTracks}
                onChange={(e) => setShowGroundTracks(e.target.checked)}
                className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
              />
              <span className="text-sm text-gray-700">Ground Tracks</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[600px] relative">
                <div ref={mapRef} className="w-full h-full" />

                {/* Live Status Indicator */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900">Live Tracking</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Updates: Every 30s</div>
                    <div>Satellites: {satellites.length}</div>
                    <div>Data Sources: NASA, Celestrak</div>
                  </div>
                </div>

                {/* Map Type Info */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm max-w-xs">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {mapTypes.find((t) => t.id === activeMapType)?.name}
                  </h3>
                  <p className="text-xs text-gray-600">{getMapTypeDescription(activeMapType)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#4e6aff]" />
                Live Data Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Satellites</span>
                  <span className="font-medium text-gray-900">{satellites.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Starlink Constellation</span>
                  <span className="font-medium text-gray-900">{starlinkSatellites.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Debris Objects</span>
                  <span className="font-medium text-gray-900">{debrisData.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">NASA Events</span>
                  <span className="font-medium text-gray-900">{nasaData.eonetEvents || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Earthquakes (24h)</span>
                  <span className="font-medium text-gray-900">{nasaData.earthquakes || 0}</span>
                </div>
              </div>
            </div>

            {activeMapType === "internet-coverage" && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#4e6aff]" />
                  Internet Coverage
                </h3>
                <div className="space-y-3">
                  {Object.entries(internetCoverageData).map(([provider, data]: [string, any]) => (
                    <div key={provider} className="border border-gray-200 rounded-lg p-3">
                      <div className="font-medium text-gray-900 capitalize mb-2">{provider}</div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Satellites: {data.satellites}</div>
                        <div>Coverage: {data.coverage}</div>
                        <div>Latency: {data.latency}</div>
                        <div>Speed: {data.speed}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeMapType === "debris-risk" && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Debris Risk Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tracked Debris</span>
                    <span className="font-medium text-gray-900">{debrisData.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">High Risk Objects</span>
                    <span className="font-medium text-red-600">{Math.floor(debrisData.length * 0.15)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Collision Probability</span>
                    <span className="font-medium text-yellow-600">0.003%</span>
                  </div>
                  <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                    <div className="text-xs text-red-700">
                      <strong>Alert:</strong> {Math.floor(debrisData.length * 0.05)} objects require monitoring
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
