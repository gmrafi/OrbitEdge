import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import RevenueOverview from "@/components/dashboard/financial/revenue-overview"
import BusinessModelCalculator from "@/components/dashboard/financial/business-model-calculator"
import MarketAnalysis from "@/components/dashboard/financial/market-analysis"
import ROIProjections from "@/components/dashboard/financial/roi-projections"
import CostOptimization from "@/components/dashboard/financial/cost-optimization"

export default async function AnalyticsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Analytics</h1>
          <p className="text-gray-600">
            Business model optimization and revenue projections for sustainable LEO operations
          </p>
        </div>

        {/* Revenue Overview */}
        <RevenueOverview />

        {/* Main Analytics Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <BusinessModelCalculator />
          <MarketAnalysis />
        </div>

        {/* ROI and Cost Analysis */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <ROIProjections />
          <CostOptimization />
        </div>
      </main>
    </div>
  )
}
