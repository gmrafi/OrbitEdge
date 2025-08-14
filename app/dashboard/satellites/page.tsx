import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import RealTimeTracking from "@/components/dashboard/nasa/real-time-tracking"

export default async function SatellitesPage() {
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Satellite Monitoring</h1>
          <p className="text-gray-600">
            Real-time LEO satellite tracking powered by NASA open data and advanced orbital mechanics
          </p>
        </div>

        <RealTimeTracking />
      </main>
    </div>
  )
}
