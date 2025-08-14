import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Satellite, Shield, TrendingUp, Globe, Zap, Users } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4e6aff] rounded-lg flex items-center justify-center">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-space-grotesk">OrbitEdge Global</h1>
                <p className="text-xs text-gray-600">Pioneering Sustainable LEO Commerce</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-[#4e6aff] transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-[#4e6aff] transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-gray-600 hover:text-[#4e6aff] transition-colors">
                About
              </a>
              {user ? (
                <Link href="/dashboard">
                  <Button className="bg-[#4e6aff] hover:bg-[#3d54e6] text-white">Dashboard</Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button className="bg-[#4e6aff] hover:bg-[#3d54e6] text-white">Get Started</Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-[#4e6aff]/10 text-[#4e6aff] border-[#4e6aff]/20">
            NASA Space Apps Challenge 2025
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-space-grotesk leading-tight">
            Satellite Inspection-as-a-Service for <span className="text-[#4e6aff]">Sustainable LEO</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Real-time satellite monitoring, risk analysis, and compliance solutions for the $447B global space economy.
            Powered by NASA open data and advanced analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-[#4e6aff] hover:bg-[#3d54e6] text-white px-8 py-3">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-[#4e6aff] hover:bg-[#3d54e6] text-white px-8 py-3">
                  Start Free Trial
                </Button>
              </Link>
            )}
            <Button
              size="lg"
              variant="outline"
              className="border-[#4e6aff] text-[#4e6aff] hover:bg-[#4e6aff] hover:text-white px-8 py-3 bg-transparent"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space-grotesk">Comprehensive LEO Solutions</h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage and optimize your Low Earth Orbit operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center mb-4">
                  <Satellite className="w-6 h-6 text-[#4e6aff]" />
                </div>
                <CardTitle className="text-xl font-space-grotesk">Real-time Monitoring</CardTitle>
                <CardDescription>
                  Track satellite positions, orbital parameters, and health status using NASA TLE data and advanced
                  algorithms
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#4e6aff]" />
                </div>
                <CardTitle className="text-xl font-space-grotesk">Risk Analysis</CardTitle>
                <CardDescription>
                  Debris collision prediction, ISO 24113 compliance monitoring, and automated risk assessment reports
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-[#4e6aff]" />
                </div>
                <CardTitle className="text-xl font-space-grotesk">Financial Analytics</CardTitle>
                <CardDescription>
                  Business model optimization, ROI projections, and market analysis for sustainable LEO operations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-[#4e6aff]" />
                </div>
                <CardTitle className="text-xl font-space-grotesk">Global Coverage</CardTitle>
                <CardDescription>
                  Worldwide satellite tracking with support for commercial space stations like Axiom and Starlab
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-[#4e6aff]" />
                </div>
                <CardTitle className="text-xl font-space-grotesk">Microgravity Simulation</CardTitle>
                <CardDescription>
                  Advanced physics modeling for LEO environment analysis and mission planning optimization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#4e6aff]/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#4e6aff]" />
                </div>
                <CardTitle className="text-xl font-space-grotesk">Team Collaboration</CardTitle>
                <CardDescription>
                  Multi-user dashboards, role-based access, and integrated communication tools for space operations
                  teams
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space-grotesk">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">
              Scalable solutions for organizations of all sizes in the space industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-gray-200 hover:border-[#4e6aff]/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl font-space-grotesk">Starter</CardTitle>
                <CardDescription>Perfect for small teams and startups</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">$50</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#4e6aff] rounded-full"></div>
                    Up to 10 satellites monitored
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#4e6aff] rounded-full"></div>
                    Basic risk analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#4e6aff] rounded-full"></div>
                    Monthly compliance reports
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#4e6aff] rounded-full"></div>
                    Email support
                  </li>
                </ul>
                <Link href={user ? "/dashboard" : "/auth/sign-up"}>
                  <Button className="w-full mt-6 bg-[#4e6aff] hover:bg-[#3d54e6] text-white">
                    {user ? "Upgrade Plan" : "Start Free Trial"}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#4e6aff] relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#4e6aff] text-white">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl font-space-grotesk">Enterprise</CardTitle>
                <CardDescription>For large organizations and space agencies</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">$500</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#4e6aff] rounded-full"></div>
                    Unlimited satellite monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#4e6aff] rounded-full"></div>
                    Advanced AI-powered analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#4e6aff] rounded-full"></div>
                    Real-time compliance monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#4e6aff] rounded-full"></div>
                    24/7 priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#4e6aff] rounded-full"></div>
                    Custom integrations
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-[#4e6aff] hover:bg-[#3d54e6] text-white">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space-grotesk">About AIBA Space Web</h2>
            <p className="text-xl text-gray-600">NASA Space Apps Challenge 2025 - Sylhet Team</p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-space-grotesk">Our Mission</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    We're a team of BBA students from Army IBA Sylhet, passionate about combining business analytics
                    with space technology to create sustainable solutions for the growing LEO economy.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Team Members:</strong>
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Md Golam Mubasshir Rafi</li>
                      <li>• Mashrura Meshkat Punno</li>
                      <li>• Al Razi</li>
                      <li>• Rukaiya Binte Amin</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-[#4e6aff]/5 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Challenge Focus</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Addressing the "Commercializing Low Earth Orbit" challenge by creating scalable business models for
                    sustainable LEO operations, targeting the $447B global space economy with innovative satellite
                    inspection services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#4e6aff] rounded-lg flex items-center justify-center">
                  <Satellite className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold font-space-grotesk">OrbitEdge Global</span>
              </div>
              <p className="text-gray-400 text-sm">
                Pioneering sustainable LEO commerce through innovative satellite inspection services.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Challenge</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="https://www.spaceappschallenge.org/" className="hover:text-white transition-colors">
                    NASA Space Apps
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.spaceappschallenge.org/2025/locations/sylhet/"
                    className="hover:text-white transition-colors"
                  >
                    Sylhet Location
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Open Source
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 OrbitEdge Global by AIBA Space Web. NASA Space Apps Challenge 2025 Submission.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
