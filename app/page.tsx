import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, FileText, MessageSquare } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-bold">MediScan</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/login?register=true">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-teal-50 to-white">
        <div className="container flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">Manage Your Medications with Ease</h1>
            <p className="text-lg text-gray-600">
              Simply scan your prescription, and we'll organize your medication schedule. Never miss a dose with
              MediScan's intelligent reminders and assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login?register=true">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <img src="/placeholder.svg?height=400&width=500" alt="MediScan App Demo" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
              <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">OCR Prescription Scanning</h3>
              <p className="text-gray-600">
                Upload a photo of your prescription and our advanced OCR technology will extract all medication details
                automatically.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
              <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Medication Schedule</h3>
              <p className="text-gray-600">
                Get a personalized medication schedule with timely reminders to ensure you never miss a dose.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
              <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Medical Assistant</h3>
              <p className="text-gray-600">
                Chat with our AI assistant to get answers about your medications, potential side effects, and general
                health questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-teal-600 text-white flex items-center justify-center mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Upload Your Prescription</h3>
              <p className="text-gray-600">Take a photo of your prescription or upload an existing image.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-teal-600 text-white flex items-center justify-center mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Review Extracted Information</h3>
              <p className="text-gray-600">
                Our system extracts medication names, dosages, and instructions. Verify and make any needed adjustments.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-teal-600 text-white flex items-center justify-center mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Access Your Schedule</h3>
              <p className="text-gray-600">
                View your personalized medication schedule and set up reminders for each dose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border bg-white shadow-sm">
              <p className="italic mb-4">
                "MediScan has completely transformed how I manage my medications. The OCR feature is incredibly
                accurate, and the reminders ensure I never miss a dose."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div>
                  <p className="font-bold">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">MediScan User</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-lg border bg-white shadow-sm">
              <p className="italic mb-4">
                "As someone who takes multiple medications, keeping track was always a challenge. MediScan's AI
                assistant has been incredibly helpful in answering my questions about potential interactions."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div>
                  <p className="font-bold">Michael Chen</p>
                  <p className="text-sm text-gray-600">MediScan User</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Simplify Your Medication Management?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have made medication management easier with MediScan.
          </p>
          <Link href="/login?register=true">
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started Today <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <FileText className="h-6 w-6 text-teal-600" />
              <span className="text-xl font-bold">MediScan</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link href="#" className="text-sm text-gray-600 hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:underline">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:underline">
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

