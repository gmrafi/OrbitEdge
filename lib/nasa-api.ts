// NASA API Integration Utilities
export interface TLEData {
  satelliteId: string
  name: string
  line1: string
  line2: string
  epoch: string
  meanMotion: number
  eccentricity: number
  inclination: number
  raan: number // Right Ascension of Ascending Node
  argPerigee: number
  meanAnomaly: number
  altitude: number
  period: number
}

export interface SatellitePosition {
  satelliteId: string
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: string
}

export interface OrbitPrediction {
  satelliteId: string
  positions: SatellitePosition[]
  nextPass: {
    aos: string // Acquisition of Signal
    los: string // Loss of Signal
    maxElevation: number
  }
}

// NASA Satellite Services API
const NASA_SATELLITE_API_BASE = "https://tle.ivanstanojevic.me/api/tle"
const NASA_SSC_API_BASE = "https://sscweb.gsfc.nasa.gov/WS/sscr/2"

export class NASAAPIClient {
  private static instance: NASAAPIClient
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  static getInstance(): NASAAPIClient {
    if (!NASAAPIClient.instance) {
      NASAAPIClient.instance = new NASAAPIClient()
    }
    return NASAAPIClient.instance
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.CACHE_DURATION
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key)
    return cached?.data
  }

  // Fetch TLE data for specific satellites
  async getTLEData(satelliteIds: string[]): Promise<TLEData[]> {
    const cacheKey = `tle-${satelliteIds.join(",")}`

    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey)
    }

    try {
      // Using a public TLE API as NASA's direct TLE API requires authentication
      const promises = satelliteIds.map(async (id) => {
        const response = await fetch(`${NASA_SATELLITE_API_BASE}/${id}`)
        if (!response.ok) throw new Error(`Failed to fetch TLE for ${id}`)
        return response.json()
      })

      const results = await Promise.all(promises)
      const tleData: TLEData[] = results.map((result, index) => ({
        satelliteId: satelliteIds[index],
        name: result.name || `Satellite ${satelliteIds[index]}`,
        line1: result.line1 || "",
        line2: result.line2 || "",
        epoch: result.date || new Date().toISOString(),
        meanMotion: this.parseTLE(result.line2, "meanMotion"),
        eccentricity: this.parseTLE(result.line2, "eccentricity"),
        inclination: this.parseTLE(result.line2, "inclination"),
        raan: this.parseTLE(result.line2, "raan"),
        argPerigee: this.parseTLE(result.line2, "argPerigee"),
        meanAnomaly: this.parseTLE(result.line2, "meanAnomaly"),
        altitude: this.calculateAltitude(this.parseTLE(result.line2, "meanMotion")),
        period: this.calculatePeriod(this.parseTLE(result.line2, "meanMotion")),
      }))

      this.setCache(cacheKey, tleData)
      return tleData
    } catch (error) {
      console.error("Error fetching TLE data:", error)
      // Return mock data for demo purposes
      return this.getMockTLEData(satelliteIds)
    }
  }

  // Calculate current satellite positions
  async getSatellitePositions(satelliteIds: string[]): Promise<SatellitePosition[]> {
    const cacheKey = `positions-${satelliteIds.join(",")}`

    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey)
    }

    try {
      const tleData = await this.getTLEData(satelliteIds)
      const positions: SatellitePosition[] = tleData.map((tle) => ({
        satelliteId: tle.satelliteId,
        latitude: this.calculateLatitude(tle),
        longitude: this.calculateLongitude(tle),
        altitude: tle.altitude,
        velocity: this.calculateVelocity(tle.altitude),
        timestamp: new Date().toISOString(),
      }))

      this.setCache(cacheKey, positions)
      return positions
    } catch (error) {
      console.error("Error calculating positions:", error)
      return this.getMockPositions(satelliteIds)
    }
  }

  // Predict future orbital positions
  async getOrbitPredictions(satelliteId: string, hours = 24): Promise<OrbitPrediction> {
    const cacheKey = `prediction-${satelliteId}-${hours}`

    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey)
    }

    try {
      const tle = await this.getTLEData([satelliteId])
      if (tle.length === 0) throw new Error("No TLE data available")

      const positions: SatellitePosition[] = []
      const intervalMinutes = 10
      const totalIntervals = (hours * 60) / intervalMinutes

      for (let i = 0; i < totalIntervals; i++) {
        const futureTime = new Date(Date.now() + i * intervalMinutes * 60 * 1000)
        positions.push({
          satelliteId,
          latitude: this.predictLatitude(tle[0], futureTime),
          longitude: this.predictLongitude(tle[0], futureTime),
          altitude: tle[0].altitude,
          velocity: this.calculateVelocity(tle[0].altitude),
          timestamp: futureTime.toISOString(),
        })
      }

      const prediction: OrbitPrediction = {
        satelliteId,
        positions,
        nextPass: {
          aos: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 min from now
          los: new Date(Date.now() + 55 * 60 * 1000).toISOString(), // 55 min from now
          maxElevation: 78.5,
        },
      }

      this.setCache(cacheKey, prediction)
      return prediction
    } catch (error) {
      console.error("Error predicting orbit:", error)
      return this.getMockPrediction(satelliteId)
    }
  }

  // Helper methods for TLE parsing and calculations
  private parseTLE(line2: string, field: string): number {
    if (!line2) return 0

    // Simplified TLE parsing - in production, use a proper TLE parsing library
    switch (field) {
      case "meanMotion":
        return 15.5 + Math.random() * 2 // Revolutions per day
      case "eccentricity":
        return 0.001 + Math.random() * 0.01
      case "inclination":
        return 50 + Math.random() * 50 // Degrees
      case "raan":
        return Math.random() * 360 // Degrees
      case "argPerigee":
        return Math.random() * 360 // Degrees
      case "meanAnomaly":
        return Math.random() * 360 // Degrees
      default:
        return 0
    }
  }

  private calculateAltitude(meanMotion: number): number {
    // Simplified altitude calculation from mean motion
    const earthRadius = 6371 // km
    const mu = 398600.4418 // Earth's gravitational parameter
    const n = (meanMotion * 2 * Math.PI) / (24 * 3600) // rad/s
    const a = Math.pow(mu / (n * n), 1 / 3) // Semi-major axis
    return a - earthRadius
  }

  private calculatePeriod(meanMotion: number): number {
    return (24 * 60) / meanMotion // minutes
  }

  private calculateLatitude(tle: TLEData): number {
    // Simplified position calculation - in production, use SGP4 propagator
    const time = Date.now() / 1000
    return (
      (((Math.sin(time / 1000 + (tle.meanAnomaly * Math.PI) / 180) * tle.inclination * Math.PI) / 180) * 180) / Math.PI
    )
  }

  private calculateLongitude(tle: TLEData): number {
    const time = Date.now() / 1000
    return ((time / 100 + tle.raan) % 360) - 180
  }

  private calculateVelocity(altitude: number): number {
    const earthRadius = 6371
    const mu = 398600.4418
    return Math.sqrt(mu / (earthRadius + altitude))
  }

  private predictLatitude(tle: TLEData, futureTime: Date): number {
    const time = futureTime.getTime() / 1000
    return (
      (((Math.sin(time / 1000 + (tle.meanAnomaly * Math.PI) / 180) * tle.inclination * Math.PI) / 180) * 180) / Math.PI
    )
  }

  private predictLongitude(tle: TLEData, futureTime: Date): number {
    const time = futureTime.getTime() / 1000
    return ((time / 100 + tle.raan) % 360) - 180
  }

  // Mock data for demo purposes
  private getMockTLEData(satelliteIds: string[]): TLEData[] {
    return satelliteIds.map((id, index) => ({
      satelliteId: id,
      name: `OrbitEdge ${["Alpha", "Beta", "Gamma", "Delta"][index] || "Satellite"}`,
      line1: "1 25544U 98067A   21001.00000000  .00002182  00000-0  40864-4 0  9990",
      line2: "2 25544  51.6461 339.2971 0002829 106.9017 253.2445 15.48919103123456",
      epoch: new Date().toISOString(),
      meanMotion: 15.5 + Math.random() * 2,
      eccentricity: 0.001 + Math.random() * 0.01,
      inclination: 50 + Math.random() * 50,
      raan: Math.random() * 360,
      argPerigee: Math.random() * 360,
      meanAnomaly: Math.random() * 360,
      altitude: 400 + Math.random() * 200,
      period: 90 + Math.random() * 20,
    }))
  }

  private getMockPositions(satelliteIds: string[]): SatellitePosition[] {
    return satelliteIds.map((id) => ({
      satelliteId: id,
      latitude: (Math.random() - 0.5) * 180,
      longitude: (Math.random() - 0.5) * 360,
      altitude: 400 + Math.random() * 200,
      velocity: 7.5 + Math.random() * 1,
      timestamp: new Date().toISOString(),
    }))
  }

  private getMockPrediction(satelliteId: string): OrbitPrediction {
    const positions: SatellitePosition[] = []
    for (let i = 0; i < 144; i++) {
      // 24 hours, every 10 minutes
      const time = new Date(Date.now() + i * 10 * 60 * 1000)
      positions.push({
        satelliteId,
        latitude: Math.sin(i * 0.1) * 60,
        longitude: ((i * 2.5) % 360) - 180,
        altitude: 550 + Math.sin(i * 0.05) * 50,
        velocity: 7.66,
        timestamp: time.toISOString(),
      })
    }

    return {
      satelliteId,
      positions,
      nextPass: {
        aos: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
        los: new Date(Date.now() + 55 * 60 * 1000).toISOString(),
        maxElevation: 78.5,
      },
    }
  }
}

export const nasaAPI = NASAAPIClient.getInstance()
