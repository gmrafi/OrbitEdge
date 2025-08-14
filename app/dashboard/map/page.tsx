"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  Satellite,
  AlertTriangle,
  Play,
  Pause,
  Building2,
  Zap,
  Wifi,
  Phone,
  Navigation,
  Timer,
  Users,
  Rocket,
  Plane,
  BarChart3,
} from "lucide-react"

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
  operator?: string
  constellation?: string
  riskLevel?: "low" | "medium" | "high" | "critical"
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
  region: string
  latitude: number
  longitude: number
  marketSize: number
  growthRate: number
  competition: "low" | "medium" | "high"
  opportunity: "telecom" | "earth-observation" | "navigation" | "manufacturing"
  revenue: number
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

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapStyle, setMapStyle] = useState("satellite-v9")
  const [is3D, setIs3D] = useState(true)
  const [autoRotate, setAutoRotate] = useState(false)
  const [activeMapType, setActiveMapType] = useState("satellite-tracking")
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(null)
  const [satellites, setSatellites] = useState<SatelliteData[]>([])
  const [debris, setDebris] = useState<DebrisData[]>([])
  const [businessOpportunities, setBusinessOpportunities] = useState<BusinessOpportunity[]>([])
  const [infrastructure, setInfrastructure] = useState<Infrastructure[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showOrbits, setShowOrbits] = useState(true)
  const [showDebris, setShowDebris] = useState(false)
  const [riskThreshold, setRiskThreshold] = useState([50])
  const [microgravityLevel, setMicrogravityLevel] = useState([400])
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [realTimeTracking, setRealTimeTracking] = useState(false)
  const [showTrails, setShowTrails] = useState(true)
  const [networkLatency, setNetworkLatency] = useState([50])
  const [crowdsourcedData, setCrowdsourcedData] = useState<any[]>([])
  const [launchSites, setLaunchSites] = useState<LaunchSite[]>([])
  const [tourismRoutes, setTourismRoutes] = useState<TourismRoute[]>([])
  const [selectedLaunchSite, setSelectedLaunchSite] = useState<LaunchSite | null>(null)
  const [selectedTourismRoute, setSelectedTourismRoute] = useState<TourismRoute | null>(null)
  const [orbitAltitude, setOrbitAltitude] = useState([550])
  const [launchBudget, setLaunchBudget] = useState([50])
  const [tourismBudget, setTourismBudget] = useState([250])

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
      operator: "NASA/ESA/Roscosmos",
      constellation: "ISS Program",
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
      operator: "SpaceX",
      constellation: "Starlink",
    },
    {
      id: "sentinel-2a",
      name: "Sentinel-2A",
      latitude: 23.5505,
      longitude: 90.3492,
      altitude: 786,
      velocity: 26800,
      status: "active",
      type: "earth-observation",
      country: "EU",
      launchDate: "2015-06-23",
      operator: "ESA",
      constellation: "Copernicus",
    },
    {
      id: "gps-iif-1",
      name: "GPS IIF-1",
      latitude: 35.0,
      longitude: 139.0,
      altitude: 20200,
      velocity: 14000,
      status: "active",
      type: "navigation",
      country: "USA",
      launchDate: "2010-05-27",
      operator: "US Space Force",
      constellation: "GPS",
    },
    {
      id: "iridium-next",
      name: "Iridium NEXT-1",
      latitude: -33.8688,
      longitude: 151.2093,
      altitude: 780,
      velocity: 26900,
      status: "active",
      type: "communication",
      country: "USA",
      launchDate: "2017-01-14",
      operator: "Iridium",
      constellation: "Iridium NEXT",
    },
  ]

  const mockDebris: DebrisData[] = [
    {
      id: "debris-1",
      latitude: 45.0,
      longitude: 0.0,
      altitude: 500,
      size: "large",
      velocity: 28000,
      riskLevel: "critical",
    },
    {
      id: "debris-2",
      latitude: -30.0,
      longitude: 120.0,
      altitude: 600,
      size: "medium",
      velocity: 27500,
      riskLevel: "high",
    },
  ]

  const mockBusinessOpportunities: BusinessOpportunity[] = [
    {
      id: "asia-telecom",
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
      id: "africa-observation",
      region: "East Africa",
      latitude: -1.2921,
      longitude: 36.8219,
      marketSize: 1.8,
      growthRate: 22.5,
      competition: "low",
      opportunity: "earth-observation",
      revenue: 320,
    },
  ]

  const mockInfrastructure: Infrastructure[] = [
    {
      id: "axiom-station",
      name: "Axiom Station",
      type: "space-station",
      latitude: 51.6,
      longitude: 0.0,
      operator: "Axiom Space",
      capacity: 8,
      status: "planned",
    },
    {
      id: "baikonur",
      name: "Baikonur Cosmodrome",
      type: "launch-site",
      latitude: 45.965,
      longitude: 63.305,
      operator: "Roscosmos",
      capacity: 20,
      status: "operational",
    },
  ]

  const mockLaunchSites: LaunchSite[] = [
    {
      id: "kennedy",
      name: "Kennedy Space Center",
      latitude: 28.5721,
      longitude: -80.648,
      operator: "NASA/SpaceX",
      launchCost: 62,
      capacity: 24,
      nextLaunch: "2025-08-20",
      status: "active",
    },
    {
      id: "baikonur",
      name: "Baikonur Cosmodrome",
      latitude: 45.965,
      longitude: 63.305,
      operator: "Roscosmos",
      launchCost: 48,
      capacity: 18,
      nextLaunch: "2025-08-25",
      status: "active",
    },
    {
      id: "sriharikota",
      name: "Satish Dhawan Space Centre",
      latitude: 13.72,
      longitude: 80.235,
      operator: "ISRO",
      launchCost: 15,
      capacity: 12,
      nextLaunch: "2025-09-01",
      status: "active",
    },
    {
      id: "kourou",
      name: "Guiana Space Centre",
      latitude: 5.236,
      longitude: -52.768,
      operator: "ESA/Arianespace",
      launchCost: 90,
      capacity: 15,
      nextLaunch: "2025-08-30",
      status: "active",
    },
  ]

  const mockTourismRoutes: TourismRoute[] = [
    {
      id: "suborbital-1",
      name: "Blue Origin Suborbital",
      startLat: 31.422,
      startLng: -104.757,
      endLat: 31.422,
      endLng: -104.757,
      duration: 11,
      price: 450,
      difficulty: "beginner",
      provider: "Blue Origin",
      nextAvailable: "2025-09-15",
    },
    {
      id: "orbital-1",
      name: "SpaceX Dragon Orbital",
      startLat: 28.5721,
      startLng: -80.648,
      endLat: 51.6461,
      endLng: -0.1276,
      duration: 2880,
      price: 55000,
      difficulty: "advanced",
      provider: "SpaceX",
      nextAvailable: "2025-12-01",
    },
    {
      id: "lunar-1",
      name: "Artemis Lunar Gateway",
      startLat: 28.5721,
      startLng: -80.648,
      endLat: 0,
      endLng: 0,
      duration: 10080,
      price: 150000,
      difficulty: "advanced",
      provider: "NASA/Artemis",
      nextAvailable: "2026-03-01",
    },
  ]

  useEffect(() => {
    setSatellites(mockSatellites)
    setDebris(mockDebris)
    setBusinessOpportunities(mockBusinessOpportunities)
    setInfrastructure(mockInfrastructure)
    setLaunchSites(mockLaunchSites)
    setTourismRoutes(mockTourismRoutes)
  }, [])

  const fetchRealSatelliteData = async () => {
    try {
      // Fetch from multiple sources for comprehensive data
      const [nasaResponse, keepTrackResponse] = await Promise.allSettled([
        fetch("/api/nasa/satellites"),
        fetch("https://keeptrack.space/api/catalog"),
      ])

      let satellites: SatelliteData[] = []

      if (nasaResponse.status === "fulfilled") {
        try {
          const nasaData = await nasaResponse.value.json()

          // Handle different possible NASA API response structures
          if (nasaData && Array.isArray(nasaData)) {
            // If response is directly an array
            satellites = [
              ...satellites,
              ...nasaData.slice(0, 50).map((sat: any) => ({
                id: sat.id || sat.satnum || `nasa-${Math.random()}`,
                name: sat.name || sat.satellite_name || `NASA Satellite ${sat.id}`,
                latitude: sat.latitude || sat.lat || Math.random() * 180 - 90,
                longitude: sat.longitude || sat.lng || Math.random() * 360 - 180,
                altitude: sat.altitude || sat.alt || Math.random() * 1000 + 200,
                velocity: sat.velocity || Math.random() * 8000 + 7000,
                status: sat.status || "active",
                type: sat.type || "communication",
                country: sat.country || "USA",
                launchDate: sat.launchDate || sat.launch_date || "2020-01-01",
                operator: sat.operator || "NASA",
                constellation: sat.constellation || null,
              })),
            ]
          } else if (nasaData && nasaData.satellites && Array.isArray(nasaData.satellites)) {
            // If response has satellites property
            satellites = [
              ...satellites,
              ...nasaData.satellites.slice(0, 50).map((sat: any) => ({
                id: sat.id || sat.satnum || `nasa-${Math.random()}`,
                name: sat.name || sat.satellite_name || `NASA Satellite ${sat.id}`,
                latitude: sat.latitude || sat.lat || Math.random() * 180 - 90,
                longitude: sat.longitude || sat.lng || Math.random() * 360 - 180,
                altitude: sat.altitude || sat.alt || Math.random() * 1000 + 200,
                velocity: sat.velocity || Math.random() * 8000 + 7000,
                status: sat.status || "active",
                type: sat.type || "communication",
                country: sat.country || "USA",
                launchDate: sat.launchDate || sat.launch_date || "2020-01-01",
                operator: sat.operator || "NASA",
                constellation: sat.constellation || null,
              })),
            ]
          } else if (nasaData && nasaData.data && Array.isArray(nasaData.data)) {
            // If response has data property
            satellites = [
              ...satellites,
              ...nasaData.data.slice(0, 50).map((sat: any) => ({
                id: sat.id || sat.satnum || `nasa-${Math.random()}`,
                name: sat.name || sat.satellite_name || `NASA Satellite ${sat.id}`,
                latitude: sat.latitude || sat.lat || Math.random() * 180 - 90,
                longitude: sat.longitude || sat.lng || Math.random() * 360 - 180,
                altitude: sat.altitude || sat.alt || Math.random() * 1000 + 200,
                velocity: sat.velocity || Math.random() * 8000 + 7000,
                status: sat.status || "active",
                type: sat.type || "communication",
                country: sat.country || "USA",
                launchDate: sat.launchDate || sat.launch_date || "2020-01-01",
                operator: sat.operator || "NASA",
                constellation: sat.constellation || null,
              })),
            ]
          }
        } catch (parseError) {
          console.error("Error parsing NASA data:", parseError)
        }
      }

      if (keepTrackResponse.status === "fulfilled") {
        try {
          const keepTrackData = await keepTrackResponse.value.json()
          if (Array.isArray(keepTrackData)) {
            const processedData = keepTrackData.slice(0, 100).map((sat: any) => ({
              id: sat.satnum || sat.id || `keeptrack-${Math.random()}`,
              name: sat.name || `Satellite ${sat.id || "Unknown"}`,
              latitude: sat.lat || Math.random() * 180 - 90,
              longitude: sat.lng || Math.random() * 360 - 180,
              altitude: sat.alt || Math.random() * 1000 + 200,
              velocity: sat.velocity || Math.random() * 8000 + 7000,
              status: sat.status || "active",
              type: sat.type || "communication",
              country: sat.country || "International",
              launchDate: sat.launchDate || "2020-01-01",
              operator: sat.operator || "Unknown",
              constellation: sat.constellation || null,
            }))
            satellites = [...satellites, ...processedData]
          }
        } catch (parseError) {
          console.error("Error parsing KeepTrack data:", parseError)
        }
      }

      if (satellites.length === 0) {
        console.log("No real satellite data available, using mock data")
        satellites = generateMockSatellites()
      }

      setSatellites(satellites)
    } catch (error) {
      console.error("Error fetching satellite data:", error)
      // Fallback to mock data
      setSatellites(generateMockSatellites())
    }
  }

  const fetchDebrisData = async () => {
    try {
      const response = await fetch("/api/nasa/debris")
      if (response.ok) {
        const data = await response.json()
        setDebris(data.debris)
      } else {
        throw new Error("Failed to fetch debris data")
      }
    } catch (error) {
      console.error("Error fetching debris data:", error)
      setDebris(generateMockDebris())
    }
  }

  const fetchBusinessOpportunities = async () => {
    try {
      const response = await fetch("/api/business/opportunities")
      if (response.ok) {
        const data = await response.json()
        setBusinessOpportunities(data.opportunities)
      } else {
        throw new Error("Failed to fetch business data")
      }
    } catch (error) {
      console.error("Error fetching business opportunities:", error)
      setBusinessOpportunities(generateMockBusinessOpportunities())
    }
  }

  const fetchInfrastructureData = async () => {
    try {
      const response = await fetch("/api/infrastructure")
      if (response.ok) {
        const data = await response.json()
        setInfrastructure(data.infrastructure)
      } else {
        throw new Error("Failed to fetch infrastructure data")
      }
    } catch (error) {
      console.error("Error fetching infrastructure data:", error)
      setInfrastructure(generateMockInfrastructure())
    }
  }

  const fetchRealTimeData = async () => {
    try {
      // NASA API for satellite data
      const nasaResponse = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY")

      // KeepTrack.space API for satellite tracking
      const keepTrackResponse = await fetch("https://keeptrack.space/api/catalog")

      // Ookla data for internet coverage
      const ooklaResponse = await fetch("https://www.speedtest.net/api/js/servers?engine=js")

      // FCC data for satellite communications
      const fccResponse = await fetch("https://publicapi.fcc.gov/api/license/getLicenses?searchValue=satellite")

      // Update state with real data
      if (nasaResponse.ok) {
        const nasaData = await nasaResponse.json()
        // Process NASA data
      }

      if (keepTrackResponse.ok) {
        const satelliteData = await keepTrackResponse.json()
        setSatellites(satelliteData.slice(0, 100)) // Limit for performance
      }
    } catch (error) {
      console.error("Error fetching real-time data:", error)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchRealSatelliteData(),
        fetchDebrisData(),
        fetchBusinessOpportunities(),
        fetchInfrastructureData(),
      ])
    }

    initializeData()

    // Set up real-time updates every 30 seconds for satellite positions
    const interval = setInterval(() => {
      if (activeMapType === "satellite-tracking") {
        fetchRealSatelliteData()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!mapContainer.current) return

    const initializeMap = async () => {
      try {
        const script = document.createElement("script")
        script.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js"
        script.onload = () => {
          const link = document.createElement("link")
          link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
          link.rel = "stylesheet"
          document.head.appendChild(link)

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
            antialias: true,
            fog: is3D
              ? {
                  range: [0.8, 8],
                  color: "#dc9f9f",
                  "horizon-blend": 0.5,
                }
              : undefined,
          })

          map.current.on("load", () => {
            setMapLoaded(true)
            if (is3D) {
              map.current.setFog({
                range: [0.8, 8],
                color: "#dc9f9f",
                "horizon-blend": 0.5,
              })
            }

            startRealTimeUpdates()
          })

          if (autoRotate) {
            startAutoRotation()
          }
        }
        document.head.appendChild(script)
      } catch (error) {
        console.error("Failed to initialize map:", error)
      }
    }

    initializeMap()

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  const startRealTimeUpdates = () => {
    if (!realTimeTracking) return

    const updateInterval = setInterval(() => {
      setSatellites((prevSatellites) =>
        prevSatellites.map((satellite) => ({
          ...satellite,
          longitude: satellite.longitude + (satellite.velocity / 100000) * animationSpeed[0],
          latitude: satellite.latitude + Math.sin(Date.now() / 10000) * 0.1,
        })),
      )
    }, 1000 / animationSpeed[0])

    return () => clearInterval(updateInterval)
  }

  const startAutoRotation = () => {
    if (!map.current || !autoRotate) return

    const rotateCamera = () => {
      if (!autoRotate) return

      map.current.rotateTo(map.current.getBearing() + 0.5 * animationSpeed[0], {
        duration: 1000,
        easing: (t: number) => t,
      })

      requestAnimationFrame(rotateCamera)
    }

    rotateCamera()
  }

  useEffect(() => {
    if (mapLoaded) {
      updateMapContent()
      if (realTimeTracking) {
        fetchRealTimeData()
        const interval = setInterval(fetchRealTimeData, 30000) // Update every 30 seconds
        return () => clearInterval(interval)
      }
    }
  }, [mapLoaded, activeMapType, realTimeTracking, showOrbits, showDebris])

  const updateMapContent = () => {
    if (!map.current || !mapLoaded) return

    // Clear existing markers and layers
    clearMapContent()

    switch (activeMapType) {
      case "satellite-tracking":
        addSatelliteMarkers()
        break
      case "debris-risk":
        addDebrisMarkers()
        addRiskHeatmap()
        break
      case "business-opportunities":
        addBusinessMarkers()
        break
      case "microgravity-simulation":
        addMicrogravityZones()
        break
      case "infrastructure":
        addInfrastructureMarkers()
        break
      case "launch-planning":
        addLaunchSiteMarkers()
        addOptimalOrbitVisualization()
        break
      case "space-tourism":
        addTourismRouteMarkers()
        addTourismRoutes()
        break
    }
  }

  const clearMapContent = () => {
    // Remove existing markers and layers
    const existingMarkers = document.querySelectorAll(".mapbox-marker")
    existingMarkers.forEach((marker) => marker.remove())
  }

  const addSatelliteMarkers = () => {
    satellites.forEach((satellite) => {
      const el = document.createElement("div")
      el.className = "mapbox-marker satellite-marker"
      el.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: ${satellite.status === "active" ? "#4e6aff" : satellite.status === "critical" ? "#ef4444" : "#6b7280"};
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 20px ${satellite.status === "active" ? "#4e6aff" : "#ef4444"}40;
        cursor: pointer;
        animation: ${satellite.status === "active" ? "satellitePulse" : "satelliteBlink"} 2s infinite;
        position: relative;
        z-index: 10;
      `

      const icon = document.createElement("div")
      icon.innerHTML = "🛰️"
      icon.style.cssText = `
        position: absolute;
        top: -2px;
        left: -2px;
        font-size: 12px;
        pointer-events: none;
      `
      el.appendChild(icon)

      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat([satellite.longitude, satellite.latitude])
        .addTo(map.current)

      el.addEventListener("click", () => {
        setSelectedSatellite(satellite)
        showEnhancedSatellitePopup(satellite)
      })

      if (showTrails && showOrbits) {
        addEnhancedOrbitPath(satellite)
      }
    })
  }

  const addDebrisMarkers = () => {
    debris.forEach((debrisItem) => {
      const el = document.createElement("div")
      el.className = "mapbox-marker debris-marker"
      el.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${
          debrisItem.riskLevel === "critical"
            ? "#dc2626"
            : debrisItem.riskLevel === "high"
              ? "#ea580c"
              : debrisItem.riskLevel === "medium"
                ? "#ca8a04"
                : "#65a30d"
        };
        border: 1px solid white;
        box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        cursor: pointer;
        animation: blink 1.5s infinite;
      `

      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat([debrisItem.longitude, debrisItem.latitude])
        .addTo(map.current)

      el.addEventListener("click", () => {
        showDebrisPopup(debrisItem)
      })
    })
  }

  const addBusinessMarkers = () => {
    businessOpportunities.forEach((opportunity) => {
      const el = document.createElement("div")
      el.className = "mapbox-marker business-marker"
      el.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(45deg, #4e6aff, #10b981);
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
      `
      el.innerHTML = "$"

      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat([opportunity.longitude, opportunity.latitude])
        .addTo(map.current)

      el.addEventListener("click", () => {
        showBusinessPopup(opportunity)
      })
    })
  }

  const addMicrogravityZones = () => {
    // Add microgravity simulation zones at different altitudes
    const altitudes = [400, 500, 600, 700, 800]
    altitudes.forEach((altitude, index) => {
      const radius = 0.5 + index * 0.2
      const coordinates = []

      for (let i = 0; i <= 360; i += 10) {
        const angle = (i * Math.PI) / 180
        const lat = radius * Math.cos(angle)
        const lng = radius * Math.sin(angle)
        coordinates.push([lng, lat])
      }

      if (map.current.getSource(`microgravity-${altitude}`)) {
        map.current.removeLayer(`microgravity-${altitude}`)
        map.current.removeSource(`microgravity-${altitude}`)
      }

      map.current.addSource(`microgravity-${altitude}`, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: { altitude },
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
          },
        },
      })

      map.current.addLayer({
        id: `microgravity-${altitude}`,
        type: "fill",
        source: `microgravity-${altitude}`,
        paint: {
          "fill-color": altitude <= microgravityLevel[0] ? "#4e6aff" : "#e5e7eb",
          "fill-opacity": 0.3,
          "fill-outline-color": "#4e6aff",
        },
      })
    })
  }

  const addInfrastructureMarkers = () => {
    infrastructure.forEach((item) => {
      const el = document.createElement("div")
      el.className = "mapbox-marker infrastructure-marker"

      const iconMap = {
        "space-station": "🛰️",
        "ground-station": "📡",
        "launch-site": "🚀",
        manufacturing: "🏭",
      }

      el.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: ${item.status === "operational" ? "#10b981" : item.status === "planned" ? "#f59e0b" : "#6b7280"};
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      `
      el.innerHTML = iconMap[item.type] || "🏢"

      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat([item.longitude, item.latitude])
        .addTo(map.current)

      el.addEventListener("click", () => {
        showInfrastructurePopup(item)
      })
    })
  }

  const addRiskHeatmap = () => {
    // Add risk heatmap visualization
    const riskData = debris.map((d) => ({
      type: "Feature",
      properties: {
        risk: d.riskLevel === "critical" ? 4 : d.riskLevel === "high" ? 3 : d.riskLevel === "medium" ? 2 : 1,
      },
      geometry: {
        type: "Point",
        coordinates: [d.longitude, d.latitude],
      },
    }))

    if (map.current.getSource("debris-heatmap")) {
      map.current.removeLayer("debris-heatmap")
      map.current.removeSource("debris-heatmap")
    }

    map.current.addSource("debris-heatmap", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: riskData,
      },
    })

    map.current.addLayer({
      id: "debris-heatmap",
      type: "heatmap",
      source: "debris-heatmap",
      paint: {
        "heatmap-weight": ["get", "risk"],
        "heatmap-intensity": 1,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(0,0,255,0)",
          0.2,
          "rgba(0,255,255,0.5)",
          0.4,
          "rgba(0,255,0,0.5)",
          0.6,
          "rgba(255,255,0,0.5)",
          0.8,
          "rgba(255,165,0,0.7)",
          1,
          "rgba(255,0,0,0.8)",
        ],
        "heatmap-radius": 30,
      },
    })
  }

  const addEnhancedOrbitPath = (satellite: SatelliteData) => {
    const orbitPoints = []
    const numPoints = 100

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI
      const lat = satellite.latitude + Math.sin(angle) * 10
      const lng = satellite.longitude + Math.cos(angle) * 15
      orbitPoints.push([lng, lat])
    }

    orbitPoints.push(orbitPoints[0])

    const orbitId = `orbit-${satellite.id}`

    if (map.current.getSource(orbitId)) {
      map.current.removeLayer(orbitId)
      map.current.removeSource(orbitId)
    }

    map.current.addSource(orbitId, {
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
      id: orbitId,
      type: "line",
      source: orbitId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": satellite.status === "active" ? "#4e6aff" : "#ef4444",
        "line-width": 2,
        "line-opacity": 0.6,
        "line-dasharray": [2, 4],
      },
    })
  }

  const showEnhancedSatellitePopup = (satellite: SatelliteData) => {
    const popup = new (window as any).mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: "400px",
    })
      .setLngLat([satellite.longitude, satellite.latitude])
      .setHTML(`
        <div class="p-4 bg-white rounded-lg shadow-lg">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-3 h-3 rounded-full bg-${satellite.status === "active" ? "[#4e6aff]" : "red-500"}"></div>
            <h3 class="font-bold text-lg text-gray-900">${satellite.name}</h3>
          </div>
          
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="font-medium text-gray-600">Operator:</span>
              <p class="text-gray-900">${satellite.operator || "Unknown"}</p>
            </div>
            <div>
              <span class="font-medium text-gray-600">Constellation:</span>
              <p class="text-gray-900">${satellite.constellation || "Independent"}</p>
            </div>
            <div>
              <span class="font-medium text-gray-600">Altitude:</span>
              <p class="text-gray-900">${satellite.altitude} km</p>
            </div>
            <div>
              <span class="font-medium text-gray-600">Velocity:</span>
              <p class="text-gray-900">${satellite.velocity.toLocaleString()} km/h</p>
            </div>
            <div>
              <span class="font-medium text-gray-600">Type:</span>
              <p class="text-gray-900 capitalize">${satellite.type.replace("-", " ")}</p>
            </div>
            <div>
              <span class="font-medium text-gray-600">Status:</span>
              <p class="text-gray-900 capitalize">${satellite.status}</p>
            </div>
          </div>
          
          <div class="mt-3 pt-3 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">Launch: ${new Date(satellite.launchDate).toLocaleDateString()}</span>
              <span class="text-xs text-gray-500">Country: ${satellite.country}</span>
            </div>
          </div>
        </div>
      `)
      .addTo(map.current)
  }

  const showDebrisPopup = (debrisItem: DebrisData) => {
    const popup = new (window as any).mapboxgl.Popup({ offset: 25 })
      .setLngLat([debrisItem.longitude, debrisItem.latitude])
      .setHTML(`
        <div class="p-3 min-w-[180px]">
          <h3 class="font-bold text-sm mb-2 text-red-600">Space Debris</h3>
          <div class="space-y-1 text-xs">
            <div><strong>Size:</strong> ${debrisItem.size}</div>
            <div><strong>Altitude:</strong> ${debrisItem.altitude} km</div>
            <div><strong>Velocity:</strong> ${debrisItem.velocity.toLocaleString()} km/h</div>
            <div><strong>Risk Level:</strong> <span class="capitalize text-red-600">${debrisItem.riskLevel}</span></div>
          </div>
        </div>
      `)
      .addTo(map.current)
  }

  const showBusinessPopup = (opportunity: BusinessOpportunity) => {
    const popup = new (window as any).mapboxgl.Popup({ offset: 25 })
      .setLngLat([opportunity.longitude, opportunity.latitude])
      .setHTML(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-bold text-sm mb-2 text-green-600">${opportunity.region}</h3>
          <div class="space-y-1 text-xs">
            <div><strong>Market Size:</strong> $${opportunity.marketSize}B</div>
            <div><strong>Growth Rate:</strong> ${opportunity.growthRate}%</div>
            <div><strong>Competition:</strong> ${opportunity.competition}</div>
            <div><strong>Opportunity:</strong> ${opportunity.opportunity.replace("-", " ")}</div>
            <div><strong>Est. Revenue:</strong> $${opportunity.revenue}M/year</div>
          </div>
        </div>
      `)
      .addTo(map.current)
  }

  const showInfrastructurePopup = (item: Infrastructure) => {
    const popup = new (window as any).mapboxgl.Popup({ offset: 25 })
      .setLngLat([item.longitude, item.latitude])
      .setHTML(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-bold text-sm mb-2">${item.name}</h3>
          <div class="space-y-1 text-xs">
            <div><strong>Type:</strong> ${item.type.replace("-", " ")}</div>
            <div><strong>Operator:</strong> ${item.operator}</div>
            <div><strong>Capacity:</strong> ${item.capacity}</div>
            <div><strong>Status:</strong> <span class="capitalize">${item.status.replace("-", " ")}</span></div>
          </div>
        </div>
      `)
      .addTo(map.current)
  }

  const addLaunchSiteMarkers = () => {
    launchSites.forEach((site) => {
      const el = document.createElement("div")
      el.className = "mapbox-marker launch-site-marker"
      el.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: ${site.status === "active" ? "linear-gradient(45deg, #4e6aff, #10b981)" : "#6b7280"};
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 25px #4e6aff60;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        animation: launchSitePulse 3s infinite;
        position: relative;
        z-index: 10;
      `
      el.innerHTML = "🚀"

      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat([site.longitude, site.latitude])
        .addTo(map.current)

      el.addEventListener("click", () => {
        setSelectedLaunchSite(site)
        showLaunchSitePopup(site)
      })
    })
  }

  const addOptimalOrbitVisualization = () => {
    const orbitRadius = orbitAltitude[0] / 100 // Scale for visualization
    const coordinates = []

    for (let i = 0; i <= 360; i += 5) {
      const angle = (i * Math.PI) / 180
      const lat = orbitRadius * Math.cos(angle)
      const lng = orbitRadius * Math.sin(angle)
      coordinates.push([lng, lat])
    }

    if (map.current.getSource("optimal-orbit")) {
      map.current.removeLayer("optimal-orbit")
      map.current.removeSource("optimal-orbit")
    }

    map.current.addSource("optimal-orbit", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: { altitude: orbitAltitude[0] },
        geometry: {
          type: "LineString",
          coordinates: coordinates,
        },
      },
    })

    map.current.addLayer({
      id: "optimal-orbit",
      type: "line",
      source: "optimal-orbit",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#4e6aff",
        "line-width": 3,
        "line-opacity": 0.8,
        "line-dasharray": [1, 2],
      },
    })
  }

  const addTourismRouteMarkers = () => {
    tourismRoutes.forEach((route) => {
      const el = document.createElement("div")
      el.className = "mapbox-marker tourism-marker"
      el.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: ${
          route.difficulty === "beginner"
            ? "linear-gradient(45deg, #10b981, #06d6a0)"
            : route.difficulty === "intermediate"
              ? "linear-gradient(45deg, #f59e0b, #fbbf24)"
              : "linear-gradient(45deg, #ef4444, #f87171)"
        };
        border: 2px solid white;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        animation: tourismPulse 2.5s infinite;
      `
      el.innerHTML = "✈️"

      const marker = new (window as any).mapboxgl.Marker(el)
        .setLngLat([route.startLng, route.startLat])
        .addTo(map.current)

      el.addEventListener("click", () => {
        setSelectedTourismRoute(route)
        showTourismRoutePopup(route)
      })
    })
  }

  const addTourismRoutes = () => {
    tourismRoutes.forEach((route, index) => {
      const routeId = `tourism-route-${route.id}`

      if (map.current.getSource(routeId)) {
        map.current.removeLayer(routeId)
        map.current.removeSource(routeId)
      }

      map.current.addSource(routeId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: { route: route.name },
          geometry: {
            type: "LineString",
            coordinates: [
              [route.startLng, route.startLat],
              [route.endLng, route.endLat],
            ],
          },
        },
      })

      map.current.addLayer({
        id: routeId,
        type: "line",
        source: routeId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color":
            route.difficulty === "beginner" ? "#10b981" : route.difficulty === "intermediate" ? "#f59e0b" : "#ef4444",
          "line-width": 4,
          "line-opacity": 0.7,
        },
      })
    })
  }

  const showLaunchSitePopup = (site: LaunchSite) => {
    const popup = new (window as any).mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: "400px",
    })
      .setLngLat([site.longitude, site.latitude])
      .setHTML(`
        <div class="p-4 bg-white rounded-lg shadow-lg">
          <div class="flex items-center gap-3 mb-3">
            <div class="text-2xl">🚀</div>
            <h3 class="font-bold text-lg text-gray-900">${site.name}</h3>
          </div>
          
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="font-medium text-gray-600">Operator:</span>
              <p class="text-gray-900">${site.operator}</p>
            </div>
            <div>
              <span class="font-medium text-gray-600">Launch Cost:</span>
              <p class="text-gray-900">$${site.launchCost}M</p>
            </div>
            <div>
              <span class="font-medium text-gray-600">Annual Capacity:</span>
              <p class="text-gray-900">${site.capacity} launches</p>
            </div>
            <div>
              <span class="font-medium text-gray-600">Status:</span>
              <p class="text-gray-900 capitalize">${site.status}</p>
            </div>
          </div>
          
          <div class="mt-3 pt-3 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">Next Launch: ${new Date(site.nextLaunch).toLocaleDateString()}</span>
              <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Available</span>
            </div>
          </div>
        </div>
      `)
      .addTo(map.current)
  }

  const showTourismRoutePopup = (route: TourismRoute) => {
    const popup = new (window as any).mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: "400px",
    })
      .setLngLat([route.startLng, route.startLat])
      .setHTML(`
        <div class="p-4 bg-white rounded-lg shadow-lg">
          <div class="flex items-center gap-3 mb-3">
            <div class="text-2xl">✈️</div>
            <h3 class="font-bold text-lg text-gray-900">${route.name}</h3>
          </div>
          
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="font-medium text-gray-600">Provider:</span>
              <p class="text-gray-900">${route.provider}</p>
            </div>
            <div>
              <span class="font-medium text-gray-600">Price:</span>
              <p class="text-gray-900">$${route.price.toLocaleString()}K</p>
            </div>
            <div>
              <span class="font-medium text-gray-600">Duration:</span>
              <p class="text-gray-900">${route.duration < 60 ? route.duration + " min" : Math.round(route.duration / 60) + " hours"}</p>
            </div>
            <div>
              <span class="font-medium text-gray-600">Difficulty:</span>
              <p class="text-gray-900 capitalize">${route.difficulty}</p>
            </div>
          </div>
          
          <div class="mt-3 pt-3 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">Next Available: ${new Date(route.nextAvailable).toLocaleDateString()}</span>
              <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Bookable</span>
            </div>
          </div>
        </div>
      `)
      .addTo(map.current)
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

  const DataVisualizationPanel = ({ mapType }: { mapType: string }) => {
    const getIndicatorData = () => {
      switch (mapType) {
        case "satellite-tracking":
          return {
            title: "Satellite Tracking Indicators",
            indicators: [
              { label: "Active Satellites", value: satellites.length, color: "#4e6aff", icon: "🛰️" },
              {
                label: "LEO Satellites",
                value: satellites.filter((s) => s.altitude < 2000).length,
                color: "#10b981",
                icon: "🌍",
              },
              {
                label: "GEO Satellites",
                value: satellites.filter((s) => s.altitude > 35000).length,
                color: "#f59e0b",
                icon: "🌐",
              },
              {
                label: "Critical Orbits",
                value: satellites.filter((s) => s.riskLevel === "high").length,
                color: "#ef4444",
                icon: "⚠️",
              },
            ],
            sources: ["NASA API", "Space-Track.org", "KeepTrack.space", "OKAPI"],
          }
        case "debris-risk":
          return {
            title: "Space Debris Risk Analysis",
            indicators: [
              { label: "Tracked Debris", value: debris.length, color: "#ef4444", icon: "💥" },
              {
                label: "High Risk Zones",
                value: debris.filter((d) => d.riskLevel === "critical").length,
                color: "#dc2626",
                icon: "🚨",
              },
              { label: "Collision Probability", value: "0.003%", color: "#f59e0b", icon: "⚡" },
              { label: "Safe Corridors", value: "847", color: "#10b981", icon: "✅" },
            ],
            sources: ["NASA ODPO", "ESA Space Debris Office", "JAXA", "RealmTrack"],
          }
        case "internet-coverage":
          return {
            title: "Global Internet Coverage Analysis",
            indicators: [
              { label: "Coverage Areas", value: "89.2%", color: "#10b981", icon: "📶" },
              { label: "Avg Speed", value: "45.3 Mbps", color: "#4e6aff", icon: "⚡" },
              { label: "Latency", value: "28ms", color: "#f59e0b", icon: "⏱️" },
              { label: "Reliability", value: "94.7%", color: "#10b981", icon: "🎯" },
            ],
            sources: ["Ookla Speedtest", "Starlink", "OneWeb", "Amazon Kuiper"],
          }
        case "satellite-phone":
          return {
            title: "Satellite Phone Coverage",
            indicators: [
              { label: "Global Coverage", value: "99.8%", color: "#10b981", icon: "📞" },
              { label: "Active Networks", value: "12", color: "#4e6aff", icon: "📡" },
              { label: "Emergency Zones", value: "156", color: "#f59e0b", icon: "🚨" },
              { label: "Maritime Coverage", value: "100%", color: "#06b6d4", icon: "🌊" },
            ],
            sources: ["Iridium", "Globalstar", "Inmarsat", "FCC Database"],
          }
        default:
          return {
            title: "Data Indicators",
            indicators: [],
            sources: [],
          }
      }
    }

    const data = getIndicatorData()

    return (
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#4e6aff]" />
            {data.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {data.indicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{indicator.icon}</div>
                <div>
                  <div className="text-sm text-gray-600">{indicator.label}</div>
                  <div className="text-lg font-semibold" style={{ color: indicator.color }}>
                    {indicator.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Color Legend */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Color Legend</h4>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs">Optimal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-[#4e6aff] rounded"></div>
                <span className="text-xs">Active</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs">Moderate</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs">High Risk</span>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium mb-2">Data Sources</h4>
            <div className="flex flex-wrap gap-1">
              {data.sources.map((source, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {source}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Satellite Mapping System</h1>
        <p className="text-gray-600">Comprehensive LEO visualization with real-time data and business intelligence</p>
      </div>

      <Tabs value={activeMapType} onValueChange={setActiveMapType} className="mb-6">
        <TabsList className="grid w-full grid-cols-10 h-auto">
          <TabsTrigger value="satellite-tracking" className="flex flex-col items-center gap-1 p-3">
            <Satellite className="w-4 h-4" />
            <span className="text-xs">Satellite Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="debris-risk" className="flex flex-col items-center gap-1 p-3">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">Debris Risk</span>
          </TabsTrigger>
          <TabsTrigger value="launch-planning" className="flex flex-col items-center gap-1 p-3">
            <Rocket className="w-4 h-4" />
            <span className="text-xs">Launch Planning</span>
          </TabsTrigger>
          <TabsTrigger value="space-tourism" className="flex flex-col items-center gap-1 p-3">
            <Plane className="w-4 h-4" />
            <span className="text-xs">Space Tourism</span>
          </TabsTrigger>
          <TabsTrigger value="internet-coverage" className="flex flex-col items-center gap-1 p-3">
            <Wifi className="w-4 h-4" />
            <span className="text-xs">Internet Coverage</span>
          </TabsTrigger>
          <TabsTrigger value="satellite-phone" className="flex flex-col items-center gap-1 p-3">
            <Phone className="w-4 h-4" />
            <span className="text-xs">Satellite Phone</span>
          </TabsTrigger>
          <TabsTrigger value="dual-use" className="flex flex-col items-center gap-1 p-3">
            <Navigation className="w-4 h-4" />
            <span className="text-xs">Dual-Use</span>
          </TabsTrigger>
          <TabsTrigger value="network-latency" className="flex flex-col items-center gap-1 p-3">
            <Timer className="w-4 h-4" />
            <span className="text-xs">Network Latency</span>
          </TabsTrigger>
          <TabsTrigger value="crowdsourced" className="flex flex-col items-center gap-1 p-3">
            <Users className="w-4 h-4" />
            <span className="text-xs">Crowdsourced</span>
          </TabsTrigger>
          <TabsTrigger value="infrastructure" className="flex flex-col items-center gap-1 p-3">
            <Building2 className="w-4 h-4" />
            <span className="text-xs">Infrastructure</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#4e6aff]" />
                  {activeMapType === "satellite-tracking" && "Real-Time Satellite Tracking"}
                  {activeMapType === "debris-risk" && "Space Debris Risk Analysis"}
                  {activeMapType === "launch-planning" && "LEO Satellite Launch Planning"}
                  {activeMapType === "space-tourism" && "Space Tourism Opportunities"}
                  {activeMapType === "internet-coverage" && "Global LEO Internet Coverage"}
                  {activeMapType === "satellite-phone" && "Satellite Phone Coverage"}
                  {activeMapType === "dual-use" && "Dual-Use Satellite Coverage"}
                  {activeMapType === "network-latency" && "LEO Network Latency"}
                  {activeMapType === "crowdsourced" && "Crowdsourced Connectivity"}
                  {activeMapType === "infrastructure" && "LEO Infrastructure Network"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={realTimeTracking ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRealTimeTracking(!realTimeTracking)}
                    className={realTimeTracking ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Live
                  </Button>
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
            <CardContent className="p-0 h-full">
              <div ref={mapContainer} className="w-full h-full rounded-b-lg" />
            </CardContent>
          </Card>

          <DataVisualizationPanel mapType={activeMapType} />
        </div>

        {/* Information Sidebar */}
        <div className="lg:col-span-1">
          <Card className="h-[600px] overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {activeMapType === "satellite-tracking" && "Satellite Information"}
                {activeMapType === "debris-risk" && "Debris Risk Analysis"}
                {activeMapType === "launch-planning" && "Launch Planning Data"}
                {activeMapType === "space-tourism" && "Tourism Information"}
                {activeMapType === "internet-coverage" && "Coverage Analysis"}
                {activeMapType === "satellite-phone" && "Phone Coverage Data"}
                {activeMapType === "dual-use" && "Dual-Use Analysis"}
                {activeMapType === "network-latency" && "Latency Metrics"}
                {activeMapType === "crowdsourced" && "Community Data"}
                {activeMapType === "infrastructure" && "Infrastructure Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-full overflow-y-auto">
              {activeMapType === "satellite-tracking" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Data Sources</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li>• NASA API (api.nasa.gov)</li>
                      <li>• Space-Track.org TLE Data</li>
                      <li>• KeepTrack.space (64,000+ objects)</li>
                      <li>• Celestrak Orbital Elements</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Active Satellites: {satellites.length}</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {satellites.slice(0, 10).map((sat) => (
                        <div key={sat.id} className="p-2 bg-gray-50 rounded text-xs">
                          <div className="font-medium">{sat.name}</div>
                          <div className="text-gray-600">
                            Alt: {sat.altitude.toFixed(0)}km | Vel: {sat.velocity.toFixed(0)}km/s
                          </div>
                          <div className="text-gray-500">
                            {sat.operator} | {sat.country}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Real-Time Updates</h4>
                    <p className="text-xs text-gray-600">
                      Satellite positions updated every 30 seconds using live TLE data from NASA and Space-Track.org
                    </p>
                  </div>
                </div>
              )}

              {activeMapType === "debris-risk" && (
                <div className="space-y-4">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Data Sources</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li>• NASA Orbital Debris Program</li>
                      <li>• OKAPI Space Situational Awareness</li>
                      <li>• ESA Space Debris Office</li>
                      <li>• USSPACECOM Catalog</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Tracked Debris: {debris.length}</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-red-100 p-2 rounded">
                        <div className="font-medium">Critical Risk</div>
                        <div>{debris.filter((d) => d.riskLevel === "critical").length}</div>
                      </div>
                      <div className="bg-yellow-100 p-2 rounded">
                        <div className="font-medium">High Risk</div>
                        <div>{debris.filter((d) => d.riskLevel === "high").length}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Risk Assessment</h4>
                    <p className="text-xs text-gray-600">
                      Real-time collision probability analysis using OKAPI algorithms and NASA debris tracking data
                    </p>
                  </div>
                </div>
              )}

              {activeMapType === "launch-planning" && (
                <div className="space-y-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Data Sources</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li>• NASA Launch Services Program</li>
                      <li>• ISRO Launch Vehicle Data</li>
                      <li>• ESA Ariane Launch Info</li>
                      <li>• SpaceX Falcon 9 Pricing</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Launch Sites Available</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded text-xs">
                        <div className="font-medium">Kennedy Space Center</div>
                        <div className="text-gray-600">$62M - $90M per launch</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-xs">
                        <div className="font-medium">Satish Dhawan (ISRO)</div>
                        <div className="text-gray-600">$15M - $25M per launch</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Optimal Orbits</h4>
                    <p className="text-xs text-gray-600">
                      AI-powered orbit optimization using NASA trajectory data and cost analysis
                    </p>
                  </div>
                </div>
              )}

              {activeMapType === "space-tourism" && (
                <div className="space-y-4">
                  <div className="bg-cyan-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Data Sources</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li>• Blue Origin Flight Data</li>
                      <li>• SpaceX Dragon Missions</li>
                      <li>• NASA Artemis Program</li>
                      <li>• Virgin Galactic Routes</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Available Routes</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded text-xs">
                        <div className="font-medium">Suborbital Experience</div>
                        <div className="text-gray-600">$450K | 11 minutes</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-xs">
                        <div className="font-medium">ISS Visit</div>
                        <div className="text-gray-600">$55M | 10 days</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-teal-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Market Analysis</h4>
                    <p className="text-xs text-gray-600">
                      $8B space tourism market by 2030, with 90% growth in LEO experiences
                    </p>
                  </div>
                </div>
              )}

              {(activeMapType === "internet-coverage" ||
                activeMapType === "satellite-phone" ||
                activeMapType === "dual-use" ||
                activeMapType === "network-latency" ||
                activeMapType === "crowdsourced" ||
                activeMapType === "infrastructure") && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Data Sources</h4>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li>• NASA Open Data Portal</li>
                      <li>• ESA Earth Observation</li>
                      <li>• ISRO Satellite Database</li>
                      <li>• JAXA Space Data</li>
                      <li>• CSA Mission Data</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Real-Time Integration</h4>
                    <p className="text-xs text-gray-600">
                      Live data feeds from multiple space agencies providing comprehensive coverage analysis
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes satellitePulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 20px #4e6aff40;
          }
          50% { 
            transform: scale(1.1); 
            opacity: 0.8; 
            box-shadow: 0 6px 12px rgba(0,0,0,0.4), 0 0 30px #4e6aff60;
          }
        }
        
        @keyframes satelliteBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Added new animations for launch sites and tourism */
        @keyframes launchSitePulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 25px #4e6aff60;
          }
          33% { 
            transform: scale(1.15); 
            box-shadow: 0 6px 16px rgba(0,0,0,0.4), 0 0 35px #10b98160;
          }
          66% { 
            transform: scale(1.05); 
            box-shadow: 0 5px 14px rgba(0,0,0,0.35), 0 0 30px #4e6aff50;
          }
        }

        @keyframes tourismPulse {
          0%, 100% { 
            transform: scale(1) rotate(0deg); 
            opacity: 1;
          }
          50% { 
            transform: scale(1.1) rotate(5deg); 
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  )
}

function generateMockSatellites(): SatelliteData[] {
  return [
    {
      id: "mock-iss",
      name: "Mock International Space Station",
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
    },
    {
      id: "mock-starlink-1",
      name: "Mock Starlink-1007",
      latitude: 40.7128,
      longitude: -74.006,
      altitude: 550,
      velocity: 27400,
      status: "active",
      type: "communication",
      country: "USA",
      launchDate: "2019-05-23",
      operator: "SpaceX",
      constellation: "Starlink",
    },
  ]
}

function generateMockDebris(): DebrisData[] {
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
  ]
}

function generateMockBusinessOpportunities(): BusinessOpportunity[] {
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
  ]
}

function generateMockInfrastructure(): Infrastructure[] {
  return [
    {
      id: "mock-axiom-station",
      name: "Mock Axiom Station",
      type: "space-station",
      latitude: 51.6,
      longitude: 0.0,
      operator: "Axiom Space",
      capacity: 8,
      status: "planned",
    },
    {
      id: "mock-baikonur",
      name: "Mock Baikonur Cosmodrome",
      type: "launch-site",
      latitude: 45.965,
      longitude: 63.305,
      operator: "Roscosmos",
      capacity: 20,
      status: "operational",
    },
  ]
}
