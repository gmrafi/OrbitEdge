import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import ComplianceOverview from "@/components/dashboard/compliance/compliance-overview"
import RiskMatrix from "@/components/dashboard/compliance/risk-matrix"
import ComplianceReports from "@/components/dashboard/compliance/compliance-reports"
import DebrisTracking from "@/components/dashboard/compliance/debris-tracking"

export default async function CompliancePage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Analysis & Compliance</h1>
          <p className="text-gray-600">
            ISO 24113 compliance monitoring, debris collision analysis, and automated risk assessment
          </p>
        </div>

        {/* Compliance Overview */}
        <ComplianceOverview />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <RiskMatrix />
          <DebrisTracking />
        </div>

        {/* Compliance Reports */}
        <div className="mt-8">
          <ComplianceReports />
        </div>
      </main>
    </div>
  )
}
