"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("register") ? "register" : "login"
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [email, setEmail] = useState("")

  const handleLogin = () => {
    // Save email to localStorage
    if (email) {
      localStorage.setItem("userEmail", email)
    }
    window.location.href = "/dashboard"
  }

  const handleRegister = () => {
    // Save email to localStorage
    if (email) {
      localStorage.setItem("userEmail", email)
    }
    window.location.href = "/dashboard"
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <FileText className="h-6 w-6 text-teal-600" />
        <span className="text-xl font-bold">MediScan</span>
      </Link>

      <Tabs defaultValue={activeTab} className="w-full max-w-md" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-teal-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleLogin}>
                Login
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Enter your information to create a MediScan account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleRegister}>
                Create account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="mt-4 text-center text-sm text-gray-600">
        By continuing, you agree to MediScan's{" "}
        <Link href="#" className="text-teal-600 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-teal-600 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}