import DashboardHeader from "@/components/dashboard/dashboard-header"
import SatelliteOverview from "@/components/dashboard/satellite-overview"
import LiveSatelliteMap from "@/components/dashboard/live-satellite-map"
import RiskAlerts from "@/components/dashboard/risk-alerts"
import RecentActivity from "@/components/dashboard/recent-activity"
import RevenueOverview from "@/components/dashboard/financial/revenue-overview"
import BusinessModelCalculator from "@/components/dashboard/financial/business-model-calculator"
import MarketAnalysis from "@/components/dashboard/financial/market-analysis"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, DollarSign, Satellite as SatelliteIcon, Globe, Zap, Users, Activity } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  // Mock user for demo purposes
  const user = {
    email: "demo@orbitbiz.com",
    id: "demo-user"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.email?.split("@")[0]}</h1>
              <p className="text-gray-600">Monitor your LEO satellites and track orbital compliance in real-time</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live Data Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <SatelliteOverview />

        {/* Quick Access Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Link href="/dashboard/satellites">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <SatelliteIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Live Tracking</CardTitle>
                    <p className="text-sm text-gray-600">Real-time monitoring</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/analytics">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Analytics</CardTitle>
                    <p className="text-sm text-gray-600">Financial insights</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/compliance">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Compliance</CardTitle>
                    <p className="text-sm text-gray-600">Risk management</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/map">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Global Map</CardTitle>
                    <p className="text-sm text-gray-600">Worldwide coverage</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Live Satellite Map - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <LiveSatelliteMap />
            
            {/* Financial Overview Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <RevenueOverview />
              <MarketAnalysis />
            </div>
          </div>

          {/* Sidebar with Alerts, Activity, and Business Tools */}
          <div className="space-y-6">
            <RiskAlerts />
            <RecentActivity />
            
            {/* Business Model Calculator Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-lg">Business Tools</CardTitle>
                  </div>
                  <Link href="/dashboard/analytics">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Link href="/dashboard/analytics">
                    <Button variant="ghost" className="w-full justify-start text-left h-auto p-3 bg-gray-50 hover:bg-gray-100">
                      <div>
                        <div className="font-medium">ROI Calculator</div>
                        <div className="text-sm text-gray-600">Investment projections</div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/dashboard/analytics">
                    <Button variant="ghost" className="w-full justify-start text-left h-auto p-3 bg-gray-50 hover:bg-gray-100">
                      <div>
                        <div className="font-medium">Break-Even Analysis</div>
                        <div className="text-sm text-gray-600">Financial planning</div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/dashboard/analytics">
                    <Button variant="ghost" className="w-full justify-start text-left h-auto p-3 bg-gray-50 hover:bg-gray-100">
                      <div>
                        <div className="font-medium">Market Analysis</div>
                        <div className="text-sm text-gray-600">Industry insights</div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">64K+</div>
                    <div className="text-sm text-gray-600">Objects Tracked</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">24/7</div>
                    <div className="text-sm text-gray-600">Monitoring</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">Real-time</div>
                    <div className="text-sm text-gray-600">Updates</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
