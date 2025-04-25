import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, FileText, MessageSquare, CheckCircle2, Bell, Shield, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-teal-50/30">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-teal-100 p-1.5">
              <FileText className="h-5 w-5 text-teal-600" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              MediScan
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
            >
              How It Works
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-teal-600 hover:bg-teal-50">
                Log In
              </Button>
            </Link>
            <Link href="/login?register=true">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,200,180,0.1),transparent_60%)]"></div>
        <div className="container relative">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="flex-1 space-y-6 max-w-2xl">
              <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 px-3 py-1 text-sm mb-2">
                Simplify Your Health
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Manage Your Medications with Ease
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Simply scan your prescription, and we'll organize your medication. Never miss a dose with
                MediScan's intelligent AI-powered assistant.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login?register=true">
                  <Button
                    size="lg"
                    className="gap-2 bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-200 transition-all hover:shadow-xl"
                  >
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-6">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-teal-200 border-2 border-white flex items-center justify-center text-xs font-medium text-teal-700">
                    JD
                  </div>
                  <div className="h-8 w-8 rounded-full bg-teal-300 border-2 border-white flex items-center justify-center text-xs font-medium text-teal-700">
                    MC
                  </div>
                  <div className="h-8 w-8 rounded-full bg-teal-400 border-2 border-white flex items-center justify-center text-xs font-medium text-teal-700">
                    SJ
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Joined by <span className="font-medium">10,000+</span> users
                </p>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-300 opacity-30 blur-xl"></div>
              <div className="relative bg-white p-6 rounded-xl shadow-xl border border-teal-100">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Today's Schedule</h3>
                    <Badge variant="outline" className="text-teal-600 border-teal-200">
                      3 Medications
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {[
                      { time: "8:00 AM", name: "Lisinopril", dose: "10mg", status: "Taken" },
                      { time: "1:00 PM", name: "Metformin", dose: "500mg", status: "Due in 2h" },
                      { time: "8:00 PM", name: "Atorvastatin", dose: "20mg", status: "Upcoming" },
                    ].map((med, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              med.status === "Taken"
                                ? "bg-green-100 text-green-600"
                                : med.status.includes("Due")
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {med.status === "Taken" ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : med.status.includes("Due") ? (
                              <Clock className="h-5 w-5" />
                            ) : (
                              <Bell className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-sm text-gray-500">
                              {med.dose} • {med.time}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`${
                            med.status === "Taken"
                              ? "bg-green-100 text-green-700"
                              : med.status.includes("Due")
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {med.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Tools for Medication Management</h2>
            <p className="text-gray-600">
              Our comprehensive suite of features designed to make managing your medications simple and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="h-6 w-6 text-teal-600" />,
                title: "OCR Prescription Scanning",
                description:
                  "Upload a photo of your prescription and our advanced OCR technology will extract all medication details automatically.",
              },
              {
                icon: <Clock className="h-6 w-6 text-teal-600" />,
                title: "Get accurate results",
                description:
                  "Receive accurate medication results based on your prescription.",
              },              
              {
                icon: <MessageSquare className="h-6 w-6 text-teal-600" />,
                title: "AI Medical Assistant",
                description:
                  "Chat with our AI assistant to get answers about your medications, potential side effects, and general health questions.",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="group hover:shadow-md transition-all duration-300 border-teal-100/60 overflow-hidden"
              >
                <CardContent className="p-6 pt-6">
                  <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-teal-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Three-Step Process</h2>
            <p className="text-gray-600">Getting started with MediScan is quick and easy. Here's how it works:</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200 -z-10"></div>

            {[
              {
                step: 1,
                title: "Upload Your Prescription",
                description: "Take a photo of your prescription or upload an existing image.",
              },
              {
                step: 2,
                title: "Review Extracted Information",
                description:
                  "Our system extracts medication names, dosages, and instructions. Verify and make any needed adjustments.",
              },
              {
                step: 3,
                title: "Get Accurate Details",
                description: "View your personalized medication schedule.",
              },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="h-16 w-16 rounded-full bg-teal-600 text-white flex items-center justify-center mb-6 text-xl font-bold shadow-lg shadow-teal-200 group-hover:scale-110 transition-transform">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-teal-700 transition-colors">{step.title}</h3>
                <p className="text-gray-600 max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10,000+", label: "Active Users", icon: <Users className="h-5 w-5 text-teal-600" /> },
              { value: "98%", label: "Accuracy Rate", icon: <CheckCircle2 className="h-5 w-5 text-teal-600" /> },
              { value: "24/7", label: "AI Support", icon: <MessageSquare className="h-5 w-5 text-teal-600" /> },
              { value: "100%", label: "Secure & Private", icon: <Shield className="h-5 w-5 text-teal-600" /> },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="mb-2 p-2 rounded-full bg-teal-100">{stat.icon}</div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Simplify Your Medication Management?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have made medication management easier with MediScan.
          </p>
          <Link href="/login?register=true">
            <Button size="lg" variant="secondary" className="gap-2 bg-white text-teal-700 hover:bg-gray-100 shadow-lg">
              Get Started Today <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="rounded-full bg-teal-100 p-1.5">
                <FileText className="h-5 w-5 text-teal-600" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                MediScan
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-teal-600 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} MediScan. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
