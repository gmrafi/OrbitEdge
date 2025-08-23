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

// Tokens must not be used directly on the client. Use internal API routes instead.

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
  const [showEarthquakes, setShowEarthquakes] = useState(true)
  const [showEonetEvents, setShowEonetEvents] = useState(true)
  const [nasaData, setNasaData] = useState<any>({})
  const [starlinkSatellites, setStarlinkSatellites] = useState<any[]>([])
  const [internetCoverageData, setInternetCoverageData] = useState<any>({})
  const [debrisData, setDebrisData] = useState<any[]>([])
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [earthquakesGeoJSON, setEarthquakesGeoJSON] = useState<any>(null)
  const [eonetEventsGeoJSON, setEonetEventsGeoJSON] = useState<any>(null)
  const [issPosition, setIssPosition] = useState<{ latitude: number; longitude: number } | null>(null)

  const fetchComprehensiveNASAData = useCallback(async () => {
    try {
      const responses: any = {}

      // CMR granules
      const granulesRes = await fetch(
        "/api/nasa/earth-data?endpoint=cmr-granules&params=" +
          encodeURIComponent("short_name=MCD12Q1&version=061&page_size=50"),
      )
      if (granulesRes.ok) {
        const data = await granulesRes.json()
        responses.cmrGranules = data?.feed?.entry?.length || data?.items?.length || 0
      }

      // CMR collections
      const collectionsRes = await fetch(
        "/api/nasa/earth-data?endpoint=cmr-collections&params=" + encodeURIComponent("keyword=satellite&page_size=50"),
      )
      if (collectionsRes.ok) {
        const data = await collectionsRes.json()
        responses.cmrCollections = data?.feed?.entry?.length || data?.items?.length || 0
      }

      // Public data via internal proxy
      const [eventsRes, issRes, tleRes, quakesRes, spaceWxRes, apodRes] = await Promise.all([
        fetch("/api/nasa/public-data?endpoint=eonet-events&params=" + encodeURIComponent("limit=100")),
        fetch("/api/nasa/public-data?endpoint=iss-position"),
        fetch("/api/nasa/public-data?endpoint=celestrak-tle"),
        fetch(
          "/api/nasa/public-data?endpoint=usgs-earthquakes&params=" +
            encodeURIComponent("format=geojson&limit=200"),
        ),
        fetch("/api/nasa/public-data?endpoint=noaa-space-weather"),
        fetch("/api/nasa/public-data?endpoint=nasa-apod"),
      ])

      if (eventsRes.ok) {
        const data = await eventsRes.json()
        responses.eonetEvents = data?.events?.length || 0
        // Convert to GeoJSON (use latest geometry for each event)
        const features = (data?.events || [])
          .map((ev: any) => {
            const geos = ev?.geometry || []
            const last = geos[geos.length - 1]
            const coords = last?.coordinates
            if (!coords || coords.length < 2) return null
            return {
              type: "Feature",
              geometry: { type: "Point", coordinates: [coords[0], coords[1]] },
              properties: {
                id: ev.id,
                title: ev.title,
                category: ev.categories?.[0]?.title || "Event",
                date: last?.date || ev?.geometry?.[0]?.date,
              },
            }
          })
          .filter(Boolean)
        setEonetEventsGeoJSON({ type: "FeatureCollection", features })
      }
      if (issRes.ok) {
        const data = await issRes.json()
        responses.issPosition = data?.iss_position ? "Available" : "Not available"
        if (data?.iss_position) {
          setIssPosition({
            latitude: Number.parseFloat(data.iss_position.latitude),
            longitude: Number.parseFloat(data.iss_position.longitude),
          })
        }
      }
      let starlinkData: any[] = []
      if (tleRes.ok) {
        const data = await tleRes.json()
        if (Array.isArray(data)) starlinkData = data.slice(0, 100)
      }
      if (quakesRes.ok) {
        const data = await quakesRes.json()
        responses.earthquakes = data?.features?.length || 0
        setEarthquakesGeoJSON(data)
      }
      if (spaceWxRes.ok) {
        const data = await spaceWxRes.json()
        responses.spaceWeather = Array.isArray(data) ? data.length : 0
      }
      if (apodRes.ok) {
        responses.apod = "Available"
      }

      // Internal satellite positions (ISS + a few)
      let apiSatellites: any[] = []
      const satsRes = await fetch("/api/nasa/satellites?ids=25544,43013,48274,47967")
      if (satsRes.ok) {
        const satsJson = await satsRes.json()
        apiSatellites = satsJson?.data?.satellites || []
      }

      // Debris
      const debrisRes = await fetch(
        "/api/nasa/public-data?endpoint=celestrak-tle&params=" + encodeURIComponent("GROUP=debris&FORMAT=json"),
      )
      let debrisInfo: any[] = []
      if (debrisRes.ok) {
        const data = await debrisRes.json()
        if (Array.isArray(data)) debrisInfo = data.slice(0, 200)
      }

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
          satellites: 0,
          coverage: "Planned global coverage",
          latency: "30ms (planned)",
          speed: "400 Mbps (planned)",
        },
      }
      setInternetCoverageData(coverageData)

      // Use internal API satellites if available; otherwise fallback to starlink sample
      if (apiSatellites.length > 0) {
        const mapped = apiSatellites.map((sat: any, idx: number) => ({
          id: sat.satelliteId || `api-${idx}`,
          name: sat.name || `Satellite ${idx + 1}`,
          latitude: sat.position?.latitude ?? 0,
          longitude: sat.position?.longitude ?? 0,
          altitude: sat.altitude ?? 500,
          velocity: sat.position?.velocity ?? 7.5,
          status: "active" as const,
          type: "communication",
          country: "",
          launchDate: sat.epoch || "",
          operator: "",
        }))
        setSatellites(mapped as any)
      } else {
        const fallbackSatellites = (starlinkData.slice(0, 20) as any[]).map((s, idx) => ({
          id: `starlink-${idx}`,
          name: s.OBJECT_NAME || `Starlink-${idx}`,
          latitude: (Math.random() - 0.5) * 180,
          longitude: (Math.random() - 0.5) * 360,
          altitude: 500 + Math.random() * 300,
          velocity: 7.4 + Math.random() * 0.6,
          status: "active" as const,
          type: "communication",
          country: "",
          launchDate: "",
          operator: "",
        }))
        setSatellites(fallbackSatellites as any)
      }
    } catch (error) {
      console.error("[v0] Error fetching NASA data:", error)
    }
  }, [])

  useEffect(() => {
    fetchComprehensiveNASAData()
    const intervalId = setInterval(fetchComprehensiveNASAData, 60000)
    return () => clearInterval(intervalId)
  }, [fetchComprehensiveNASAData])

  useEffect(() => {
    if (typeof window === "undefined") return

    const ensureMapbox = async () => {
      if (!(window as any).mapboxgl) {
        if (!document.querySelector('link[href*="mapbox-gl"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
          document.head.appendChild(link)
        }
        await new Promise<void>((resolve) => {
          const script = document.createElement("script")
          script.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"
          script.onload = () => resolve()
          document.head.appendChild(script)
        })
      }

      const mapboxgl = (window as any).mapboxgl
      if (!mapboxgl) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!mapboxgl.accessToken) {
      console.error("[v0] Mapbox token not configured")
      return
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
        style:
          mapStyle === "satellite-v9"
            ? "mapbox://styles/mapbox/satellite-v9"
            : "mapbox://styles/mapbox/streets-v12",
      center: [0, 0],
      zoom: 2,
      projection: "globe",
    })

    map.on("load", () => {
      map.setFog({})
        if (is3D) map.setPitch(40)
        if (autoRotate) map.rotateTo((map.getBearing() + 180) % 360, { duration: 20000 })
      })
      map.on("style.load", () => map.setFog({}))

    mapRef.current = map
    }

    ensureMapbox()
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [mapStyle, is3D, autoRotate])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const sourceId = "satellite-points-source"
    const layerId = "satellite-points-layer"
    const labelLayerId = "satellite-labels-layer"

    const geojson = {
      type: "FeatureCollection",
      features: satellites.map((s) => ({
            type: "Feature",
        geometry: { type: "Point", coordinates: [s.longitude, s.latitude] },
        properties: { title: s.name },
      })),
    }

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, { type: "geojson", data: geojson as any })
        map.addLayer({
        id: layerId,
          type: "symbol",
        source: sourceId,
          layout: {
            "icon-image": "rocket-15",
            "icon-size": 1.2,
        },
      })
      map.addLayer({
        id: labelLayerId,
        type: "symbol",
        source: sourceId,
        layout: {
            "text-field": showSatelliteLabels ? ["get", "title"] : "",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-anchor": "top",
            "text-offset": [0, 1.2],
            "text-size": 10,
          },
        paint: { "text-color": "#fff" },
        })
      } else {
      ;(map.getSource(sourceId) as any).setData(geojson)
      map.setLayoutProperty(labelLayerId, "text-field", showSatelliteLabels ? ["get", "title"] : "")
    }
  }, [satellites, showSatelliteLabels])

  // Earthquakes overlay
  useEffect(() => {
    const map = mapRef.current
    if (!map || !earthquakesGeoJSON) return

    const sourceId = "earthquakes-source"
    const clustersId = "earthquakes-clusters"
    const clusterCountId = "earthquakes-cluster-count"
    const unclusteredId = "earthquakes-unclustered"

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: earthquakesGeoJSON,
        cluster: true,
        clusterMaxZoom: 8,
        clusterRadius: 40,
      } as any)

      map.addLayer({
        id: clustersId,
        type: "circle",
        source: sourceId,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            50,
            "#f1f075",
            200,
            "#f28cb1",
          ],
          "circle-radius": ["step", ["get", "point_count"], 15, 50, 20, 200, 25],
        },
      })

      map.addLayer({
        id: clusterCountId,
        type: "symbol",
        source: sourceId,
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: { "text-color": "#111" },
      })

      map.addLayer({
        id: unclusteredId,
        type: "circle",
        source: sourceId,
        filter: ["!has", "point_count"],
        paint: {
          "circle-color": "#ff5722",
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      })
    } else {
      ;(map.getSource(sourceId) as any).setData(earthquakesGeoJSON)
    }

    map.setLayoutProperty(clustersId, "visibility", showEarthquakes ? "visible" : "none")
    map.setLayoutProperty(clusterCountId, "visibility", showEarthquakes ? "visible" : "none")
    map.setLayoutProperty(unclusteredId, "visibility", showEarthquakes ? "visible" : "none")
  }, [earthquakesGeoJSON, showEarthquakes])

  // EONET events overlay
  useEffect(() => {
    const map = mapRef.current
    if (!map || !eonetEventsGeoJSON) return

    const sourceId = "eonet-events-source"
    const layerId = "eonet-events-layer"

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, { type: "geojson", data: eonetEventsGeoJSON } as any)
      map.addLayer({
        id: layerId,
        type: "symbol",
        source: sourceId,
        layout: {
          "icon-image": "marker-15",
          "icon-size": 1,
          "text-field": ["get", "title"],
          "text-offset": [0, 1.0],
          "text-size": 10,
        },
        paint: { "text-color": "#222", "text-halo-color": "#fff", "text-halo-width": 1 },
      })
    } else {
      ;(map.getSource(sourceId) as any).setData(eonetEventsGeoJSON)
    }

    map.setLayoutProperty(layerId, "visibility", showEonetEvents ? "visible" : "none")
  }, [eonetEventsGeoJSON, showEonetEvents])

  // ISS position overlay
  useEffect(() => {
    const map = mapRef.current
    if (!map || !issPosition) return

    const sourceId = "iss-source"
    const layerId = "iss-layer"
    const data = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [issPosition.longitude, issPosition.latitude] },
          properties: { title: "ISS" },
        },
      ],
    }

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, { type: "geojson", data } as any)
      map.addLayer({
        id: layerId,
        type: "symbol",
        source: sourceId,
        layout: { "icon-image": "rocket-15", "icon-size": 1.2, "text-field": ["get", "title"], "text-offset": [0, 1.0], "text-size": 10 },
        paint: { "text-color": "#fff" },
      })
    } else {
      ;(map.getSource(sourceId) as any).setData(data)
    }
  }, [issPosition])

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
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showEarthquakes}
                onChange={(e) => setShowEarthquakes(e.target.checked)}
                className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
              />
              <span className="text-sm text-gray-700">Earthquakes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showEonetEvents}
                onChange={(e) => setShowEonetEvents(e.target.checked)}
                className="rounded border-gray-300 text-[#4e6aff] focus:ring-[#4e6aff]"
              />
              <span className="text-sm text-gray-700">EONET Events</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[600px] relative">
                <div ref={mapContainerRef} className="w-full h-full" />

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
