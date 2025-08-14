import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import SatelliteOverview from "@/components/dashboard/satellite-overview"
import LiveSatelliteMap from "@/components/dashboard/live-satellite-map"
import RiskAlerts from "@/components/dashboard/risk-alerts"
import RecentActivity from "@/components/dashboard/recent-activity"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.email?.split("@")[0]}</h1>
          <p className="text-gray-600">Monitor your LEO satellites and track orbital compliance in real-time</p>
        </div>

        {/* Overview Cards */}
        <SatelliteOverview />

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Live Satellite Map - Takes 2 columns */}
          <div className="lg:col-span-2">
            <LiveSatelliteMap />
          </div>

          {/* Sidebar with Alerts and Activity */}
          <div className="space-y-6">
            <RiskAlerts />
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  )
}
