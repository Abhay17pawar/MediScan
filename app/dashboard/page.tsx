"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Bell, Calendar, MessageSquare, Upload, User, LogOut } from "lucide-react";
import { MedicationSchedule } from "@/components/medication-schedule";
import { PrescriptionUploader } from "./PrescriptionUploader";
import Home from "@/components/chat-bot";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("schedule");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-bold">MediScan</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Link href="/">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container flex-1 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-64">
            <nav className="space-y-2">
              <Button
                variant={activeTab === "schedule" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("schedule")}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Medication Schedule
              </Button>
              <Button
                variant={activeTab === "upload" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("upload")}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Prescription
              </Button>
              <Button
                variant={activeTab === "chat" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("chat")}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Medical Assistant
              </Button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {activeTab === "schedule" && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Medication Schedule</CardTitle>
                  <CardDescription>View and manage your prescribed medications</CardDescription>
                </CardHeader>
                <CardContent>
                  <MedicationSchedule />
                </CardContent>
              </Card>
            )}

            {activeTab === "upload" && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Prescription</CardTitle>
                  <CardDescription>
                    Upload a photo of your prescription to automatically extract medication details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PrescriptionUploader/>
                </CardContent>
              </Card>
            )}

            {activeTab === "chat" && (
              <Card>
                <CardHeader>
                  <CardTitle>Medical Assistant</CardTitle>
                  <CardDescription>
                    Chat with our AI assistant about your medications and health questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Home/>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

