"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Satellite, Rocket, Globe, Zap, Sparkles, MessageSquare, TrendingUp, Shield, Clock } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

const SAMPLE_QUESTIONS = [
  "What are the current risks in LEO operations?",
  "How can I start a satellite business?",
  "What's the debris situation in Low Earth Orbit?",
  "Explain satellite constellation economics",
  "What are the best LEO business opportunities?",
  "How do I calculate satellite launch costs?",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm OrbitEdge AI, your space commerce assistant. I can help you with satellite tracking, LEO business opportunities, space debris analysis, and orbital mechanics. What would you like to know about the space economy?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response with space-focused content
    const responses = {
      risk: "Current LEO risks include space debris collisions (27,000+ tracked objects), orbital congestion in popular altitudes (500-800km), and regulatory compliance challenges. The Kessler Syndrome remains a key concern for sustainable space operations.",
      business:
        "Starting a satellite business requires: 1) Market analysis ($447B space economy), 2) Regulatory compliance (FCC licensing), 3) Launch partnerships (SpaceX, Rocket Lab), 4) Ground station access, and 5) Insurance coverage. Consider CubeSat constellations for cost-effective entry.",
      debris:
        "Space debris in LEO includes 34,000+ objects >10cm, 900,000+ objects 1-10cm. High-risk zones: 800-1000km altitude. Mitigation strategies include active debris removal, collision avoidance maneuvers, and end-of-life disposal protocols per ISO 24113 standards.",
      constellation:
        "Satellite constellation economics depend on: Coverage requirements, Inter-satellite links, Ground infrastructure costs, Launch economies of scale, and Revenue per satellite. Starlink's model shows ~$500K revenue/satellite/year potential in mature markets.",
      opportunity:
        "Top LEO business opportunities: 1) IoT connectivity ($1.1T market), 2) Earth observation ($4.2B), 3) Space manufacturing ($12B by 2030), 4) Satellite servicing ($4.5B), 5) Space tourism ($8B by 2030). Focus on underserved markets and emerging technologies.",
      launch:
        "Launch cost calculation: Payload mass × $/kg rate + integration fees + insurance + regulatory costs. Current rates: SpaceX Falcon 9 (~$2,700/kg), Rocket Lab Electron (~$18,000/kg). Consider rideshare options for cost reduction.",
    }

    const lowerMessage = userMessage.toLowerCase()
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }

    return "I specialize in space commerce, satellite operations, and LEO business opportunities. I can help with market analysis, risk assessment, regulatory compliance, and technical guidance for space ventures. Could you be more specific about what aspect of space business interests you?"
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const aiResponse = await generateAIResponse(inputMessage)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      setIsLoading(false)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm experiencing technical difficulties. Please try again or contact support.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleQuestionClick = (question: string) => {
    setInputMessage(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Gradient */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-10 blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      OrbitEdge AI
                    </h1>
                    <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                  </div>
                  <p className="text-gray-600 font-medium">Your Intelligent Space Commerce Assistant</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">Online & Ready</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                  <Satellite className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Space Expert</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[650px] flex flex-col bg-white/80 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Conversation
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                  <div className="space-y-6">
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {message.sender === "ai" && (
                          <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              <Bot className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[75%] rounded-2xl p-4 shadow-lg transition-all hover:shadow-xl ${
                            message.sender === "user"
                              ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                              : "bg-white border border-gray-100"
                          }`}
                        >
                          <p className={`text-sm leading-relaxed ${message.sender === "ai" ? "text-gray-700" : ""}`}>
                            {message.content}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 opacity-60" />
                            <p className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                          </div>
                        </div>
                        {message.sender === "user" && (
                          <Avatar className="h-10 w-10 ring-2 ring-purple-100">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-4">
                        <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <Bot className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-lg">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"></div>
                            <div
                              className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="border-t bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                  <div className="flex gap-3">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="✨ Ask about satellites, LEO business, space debris, and more..."
                      className="flex-1 bg-white border-2 border-blue-100 focus:border-blue-400 rounded-xl h-12 px-4 shadow-sm"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl h-12 px-6 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-orange-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    Quick Start
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                {SAMPLE_QUESTIONS.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-3 text-xs bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-100 hover:to-purple-100 border-gray-200 hover:border-blue-300 transition-all hover:shadow-md group"
                    onClick={() => handleQuestionClick(question)}
                  >
                    <Sparkles className="h-3 w-3 mr-2 text-blue-500 group-hover:text-purple-500 transition-colors" />
                    <span className="group-hover:text-blue-700">{question}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Rocket className="h-4 w-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI Capabilities
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <Satellite className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">Satellite Operations</p>
                    <p className="text-xs text-gray-600 mt-0.5">Real-time tracking, risk analysis & compliance monitoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">Market Analysis</p>
                    <p className="text-xs text-gray-600 mt-0.5">LEO business opportunities & revenue projections</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">Technical Guidance</p>
                    <p className="text-xs text-gray-600 mt-0.5">Launch planning, cost analysis & regulations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl overflow-hidden border-0">
              <CardHeader className="border-b border-white/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Live Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-xl rounded-xl">
                  <span className="text-sm font-medium">Messages Today</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{messages.length}</span>
                    <MessageSquare className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-xl rounded-xl">
                  <span className="text-sm font-medium">Avg Response</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">~1s</span>
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-xl rounded-xl">
                  <span className="text-sm font-medium">Accuracy Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">98.5%</span>
                    <Shield className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
