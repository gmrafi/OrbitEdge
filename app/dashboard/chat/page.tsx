"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Send, Bot, User, Satellite, Rocket, Globe, Zap, Sparkles, MessageSquare, 
  TrendingUp, Shield, Clock, Download, Trash2, Copy, ThumbsUp, ThumbsDown, 
  RefreshCw, Mic, Image, FileText, Settings, Moon, Sun, BarChart3, 
  BookOpen, Code, Share2, Star, Bookmark, History, PieChart
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  liked?: boolean
  disliked?: boolean
  bookmarked?: boolean
  category?: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
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

const AI_FEATURES = [
  { name: "Real-time Tracking", icon: Satellite, description: "64,000+ satellites monitored" },
  { name: "Risk Analysis", icon: Shield, description: "ISO 24113 compliance" },
  { name: "Market Insights", icon: TrendingUp, description: "$447B space economy" },
  { name: "Financial Models", icon: PieChart, description: "ROI & cost analysis" },
  { name: "Orbital Mechanics", icon: Rocket, description: "SGP4 calculations" },
  { name: "Data Visualization", icon: BarChart3, description: "Interactive charts" },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm OrbitEdge AI, your space commerce assistant. I can help you with satellite tracking, LEO business opportunities, space debris analysis, and orbital mechanics. What would you like to know about the space economy?",
      sender: "ai",
      timestamp: new Date(),
      category: "greeting"
    },
  ])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [messageCount, setMessageCount] = useState(0)
  const [totalConversations, setTotalConversations] = useState(0)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    setMessageCount(messages.length)
    setTotalConversations(conversations.length)
  }, [messages, conversations])

  const toggleLike = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, liked: !msg.liked, disliked: false }
          : msg
      )
    )
  }

  const toggleDislike = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, disliked: !msg.disliked, liked: false }
          : msg
      )
    )
  }

  const toggleBookmark = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, bookmarked: !msg.bookmarked }
          : msg
      )
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Optional: Add toast notification
  }

  const exportConversation = () => {
    const conversationText = messages
      .map((msg) => `[${msg.timestamp.toLocaleString()}] ${msg.sender === "user" ? "You" : "OrbitEdge AI"}: ${msg.content}`)
      .join("\n\n")
    
    const blob = new Blob([conversationText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orbitedge-chat-${new Date().toISOString()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearConversation = () => {
    if (confirm("Are you sure you want to clear this conversation?")) {
      setMessages([
        {
          id: Date.now().toString(),
          content: "Conversation cleared. How can I assist you today?",
          sender: "ai",
          timestamp: new Date(),
          category: "system"
        },
      ])
    }
  }

  const saveConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Conversation ${conversations.length + 1}`,
      messages: [...messages],
      timestamp: new Date(),
    }
    setConversations((prev) => [newConversation, ...prev])
  }

  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId)
    if (conversation) {
      setMessages(conversation.messages)
      setCurrentConversationId(conversationId)
      setShowHistory(false)
    }
  }

  const startNewConversation = () => {
    saveConversation()
    setMessages([
      {
        id: Date.now().toString(),
        content: "New conversation started! What would you like to discuss?",
        sender: "ai",
        timestamp: new Date(),
        category: "greeting"
      },
    ])
    setCurrentConversationId(null)
  }

  const toggleVoiceInput = () => {
    setIsRecording(!isRecording)
    // Placeholder for voice input functionality
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        setInputMessage("Voice input: Tell me about satellite constellations")
      }, 3000)
    }
  }

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
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="rounded-xl hover:bg-blue-50"
                >
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startNewConversation}
                  className="rounded-xl hover:bg-green-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                  className="rounded-xl hover:bg-purple-50"
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">Online</span>
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
                        <div className="flex flex-col gap-2 max-w-[75%]">
                          <div
                            className={`rounded-2xl p-4 shadow-lg transition-all hover:shadow-xl ${
                              message.sender === "user"
                                ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                                : "bg-white border border-gray-100"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm leading-relaxed flex-1 ${message.sender === "ai" ? "text-gray-700" : ""}`}>
                                {message.content}
                              </p>
                              {message.category && (
                                <Badge variant="secondary" className="text-xs shrink-0">
                                  {message.category}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 opacity-60" />
                              <p className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                            </div>
                          </div>
                          
                          {/* Message Actions */}
                          {message.sender === "ai" && (
                            <div className="flex items-center gap-2 px-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-blue-50"
                                onClick={() => toggleLike(message.id)}
                              >
                                <ThumbsUp className={`h-3.5 w-3.5 ${message.liked ? "fill-blue-500 text-blue-500" : "text-gray-400"}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-red-50"
                                onClick={() => toggleDislike(message.id)}
                              >
                                <ThumbsDown className={`h-3.5 w-3.5 ${message.disliked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-yellow-50"
                                onClick={() => toggleBookmark(message.id)}
                              >
                                <Bookmark className={`h-3.5 w-3.5 ${message.bookmarked ? "fill-yellow-500 text-yellow-500" : "text-gray-400"}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-green-50"
                                onClick={() => copyToClipboard(message.content)}
                              >
                                <Copy className="h-3.5 w-3.5 text-gray-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-purple-50"
                              >
                                <Share2 className="h-3.5 w-3.5 text-gray-400" />
                              </Button>
                            </div>
                          )}
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
                  {/* Toolbar */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportConversation}
                      className="h-8 text-xs rounded-lg hover:bg-blue-50"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearConversation}
                      className="h-8 text-xs rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Clear
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={saveConversation}
                      className="h-8 text-xs rounded-lg hover:bg-green-50"
                    >
                      <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                      Save
                    </Button>
                    <div className="flex-1"></div>
                    <Badge variant="secondary" className="text-xs">
                      {messages.length} messages
                    </Badge>
                  </div>

                  {/* Input Area */}
                  <div className="flex gap-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleVoiceInput}
                        className={`h-12 w-12 p-0 rounded-xl ${isRecording ? "bg-red-50 border-red-300" : ""}`}
                      >
                        <Mic className={`h-5 w-5 ${isRecording ? "text-red-500 animate-pulse" : "text-gray-600"}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-12 w-12 p-0 rounded-xl"
                        title="Attach Image"
                      >
                        <Image className="h-5 w-5 text-gray-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-12 w-12 p-0 rounded-xl"
                        title="Attach File"
                      >
                        <FileText className="h-5 w-5 text-gray-600" />
                      </Button>
                    </div>
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
            {/* Conversation History */}
            {showHistory && (
              <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                        <History className="h-4 w-4 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        History
                      </span>
                    </div>
                    <Badge variant="secondary">{conversations.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 max-h-[300px] overflow-y-auto">
                  {conversations.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No saved conversations yet</p>
                  ) : (
                    <div className="space-y-2">
                      {conversations.map((conv) => (
                        <Button
                          key={conv.id}
                          variant="outline"
                          size="sm"
                          className="w-full justify-between h-auto p-3 text-left hover:bg-purple-50"
                          onClick={() => loadConversation(conv.id)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{conv.title}</p>
                            <p className="text-xs text-gray-500">{conv.timestamp.toLocaleDateString()}</p>
                          </div>
                          <MessageSquare className="h-4 w-4 text-purple-500 shrink-0" />
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
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
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <Rocket className="h-4 w-4 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      AI Capabilities
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">6 Features</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {AI_FEATURES.map((feature, index) => {
                  const Icon = feature.icon
                  const colors = [
                    { bg: "from-blue-50 to-purple-50", border: "border-blue-100", icon: "from-blue-500 to-blue-600" },
                    { bg: "from-green-50 to-emerald-50", border: "border-green-100", icon: "from-green-500 to-emerald-600" },
                    { bg: "from-purple-50 to-pink-50", border: "border-purple-100", icon: "from-purple-500 to-pink-600" },
                    { bg: "from-yellow-50 to-orange-50", border: "border-yellow-100", icon: "from-yellow-500 to-orange-600" },
                    { bg: "from-red-50 to-rose-50", border: "border-red-100", icon: "from-red-500 to-rose-600" },
                    { bg: "from-cyan-50 to-blue-50", border: "border-cyan-100", icon: "from-cyan-500 to-blue-600" },
                  ]
                  const color = colors[index % colors.length]
                  
                  return (
                    <div key={index} className={`flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r ${color.bg} border ${color.border} hover:shadow-md transition-shadow cursor-pointer`}>
                      <div className={`p-2 bg-gradient-to-br ${color.icon} rounded-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-800">{feature.name}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{feature.description}</p>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500 shrink-0" />
                    </div>
                  )
                })}
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
              <CardContent className="space-y-3 p-4">
                <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-xl rounded-xl hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Messages</span>
                  </div>
                  <span className="text-2xl font-bold">{messageCount}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-xl rounded-xl hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span className="text-sm font-medium">Conversations</span>
                  </div>
                  <span className="text-2xl font-bold">{totalConversations}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-xl rounded-xl hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Avg Response</span>
                  </div>
                  <span className="text-2xl font-bold">~1s</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-xl rounded-xl hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">Accuracy</span>
                  </div>
                  <span className="text-2xl font-bold">98.5%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur-xl rounded-xl hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    <span className="text-sm font-medium">Bookmarked</span>
                  </div>
                  <span className="text-2xl font-bold">{messages.filter(m => m.bookmarked).length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Knowledge Base */}
            <Card className="bg-white/80 backdrop-blur-xl border-white/20 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Knowledge Base
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2 hover:bg-green-50">
                  <Code className="h-4 w-4 mr-2 text-green-600" />
                  API Documentation
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2 hover:bg-blue-50">
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-600" />
                  Market Reports
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2 hover:bg-purple-50">
                  <Shield className="h-4 w-4 mr-2 text-purple-600" />
                  Compliance Guides
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2 hover:bg-orange-50">
                  <Rocket className="h-4 w-4 mr-2 text-orange-600" />
                  Launch Calculators
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
