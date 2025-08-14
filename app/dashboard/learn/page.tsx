import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Play, CheckCircle, Clock, Users, Award, Rocket, Globe, Shield, Calculator } from "lucide-react"

export default function LearnPage() {
  const learningPaths = [
    {
      id: 1,
      title: "LEO Operations Fundamentals",
      description: "Master the basics of Low Earth Orbit operations and satellite management",
      modules: 8,
      duration: "4 hours",
      difficulty: "Beginner",
      progress: 0,
      icon: Rocket,
      topics: ["Orbital Mechanics", "Satellite Types", "LEO Environment", "Mission Planning"],
    },
    {
      id: 2,
      title: "Space Commerce & Business Models",
      description: "Understand the economics of space and commercial LEO opportunities",
      modules: 6,
      duration: "3 hours",
      difficulty: "Intermediate",
      progress: 25,
      icon: Globe,
      topics: ["Market Analysis", "Revenue Models", "Cost Structures", "Investment Strategies"],
    },
    {
      id: 3,
      title: "Risk Analysis & Compliance",
      description: "Learn space debris mitigation and regulatory compliance (ISO 24113)",
      modules: 10,
      duration: "5 hours",
      difficulty: "Advanced",
      progress: 60,
      icon: Shield,
      topics: ["Debris Tracking", "Collision Prediction", "ISO Standards", "Risk Mitigation"],
    },
    {
      id: 4,
      title: "Financial Modeling for Space",
      description: "Advanced financial analysis and ROI calculations for space ventures",
      modules: 7,
      duration: "4 hours",
      difficulty: "Advanced",
      progress: 0,
      icon: Calculator,
      topics: ["ROI Analysis", "Cost Modeling", "Revenue Forecasting", "Investment Planning"],
    },
  ]

  const quickTutorials = [
    {
      title: "Getting Started with Satellite Tracking",
      duration: "15 min",
      type: "Video Tutorial",
      completed: false,
    },
    {
      title: "Understanding TLE Data",
      duration: "10 min",
      type: "Interactive Guide",
      completed: true,
    },
    {
      title: "Risk Assessment Basics",
      duration: "20 min",
      type: "Step-by-step",
      completed: false,
    },
    {
      title: "Financial Dashboard Overview",
      duration: "12 min",
      type: "Video Tutorial",
      completed: true,
    },
  ]

  const resources = [
    {
      title: "NASA LEO Economy Report 2025",
      type: "Research Paper",
      description: "Comprehensive analysis of the $447B LEO market opportunity",
    },
    {
      title: "ISO 24113 Compliance Guide",
      type: "Documentation",
      description: "Complete guide to space debris mitigation standards",
    },
    {
      title: "Orbital Mechanics Calculator",
      type: "Tool",
      description: "Interactive calculator for orbital parameters and predictions",
    },
    {
      title: "Space Industry Glossary",
      type: "Reference",
      description: "Essential terminology for space commerce professionals",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Hub</h1>
          <p className="text-gray-600 mt-2">Master LEO operations and space commerce with expert-designed courses</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-[#4e6aff]/10 text-[#4e6aff] border-[#4e6aff]/20">
            <Award className="w-4 h-4 mr-1" />4 Certificates Available
          </Badge>
        </div>
      </div>

      {/* Learning Paths */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Learning Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learningPaths.map((path) => {
            const IconComponent = path.icon
            return (
              <Card key={path.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#4e6aff]/10 rounded-lg">
                        <IconComponent className="w-6 h-6 text-[#4e6aff]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{path.title}</CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {path.modules} modules
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {path.duration}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {path.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{path.description}</CardDescription>

                  {path.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-[#4e6aff] font-medium">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Topics covered:</p>
                    <div className="flex flex-wrap gap-2">
                      {path.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#4e6aff] hover:bg-[#4e6aff]/90"
                    variant={path.progress > 0 ? "default" : "default"}
                  >
                    {path.progress > 0 ? "Continue Learning" : "Start Learning"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Quick Tutorials */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTutorials.map((tutorial, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-[#4e6aff]/10 rounded-lg">
                    <Play className="w-5 h-5 text-[#4e6aff]" />
                  </div>
                  {tutorial.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{tutorial.duration}</span>
                  <Badge variant="outline" className="text-xs">
                    {tutorial.type}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant={tutorial.completed ? "outline" : "default"}
                  className={tutorial.completed ? "" : "bg-[#4e6aff] hover:bg-[#4e6aff]/90"}
                >
                  {tutorial.completed ? "Review" : "Start"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Resources Library */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Resources Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-[#4e6aff]" />
                      <Badge variant="secondary" className="text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#4e6aff] text-[#4e6aff] hover:bg-[#4e6aff] hover:text-white bg-transparent"
                    >
                      Access Resource
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Section */}
      <Card className="bg-gradient-to-r from-[#4e6aff]/5 to-[#4e6aff]/10 border-[#4e6aff]/20">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Join the Space Commerce Community</h3>
              <p className="text-gray-600 mb-4">
                Connect with industry experts, share insights, and collaborate on LEO projects
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  2,847 members
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  156 discussions
                </span>
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  23 expert mentors
                </span>
              </div>
            </div>
            <Button className="bg-[#4e6aff] hover:bg-[#4e6aff]/90">Join Community</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
