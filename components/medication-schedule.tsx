"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Check, Bell, BellOff, Calendar, AlertCircle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for medications
const mockMedications = [
  {
    id: 1,
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "3 times daily",
    timing: "After meals",
    schedule: [
      { time: "8:00 AM", label: "Morning", taken: true },
      { time: "2:00 PM", label: "Afternoon", taken: false },
      { time: "8:00 PM", label: "Evening", taken: false },
    ],
    startDate: "2025-04-01",
    endDate: "2025-04-07",
    remainingDays: 5,
    remindersEnabled: true,
    instructions: "Take with a full glass of water",
    color: "teal",
  },
  {
    id: 2,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    timing: "Morning",
    schedule: [{ time: "9:00 AM", label: "Morning", taken: true }],
    startDate: "2025-04-01",
    endDate: "2025-04-25",
    remainingDays: 25,
    remindersEnabled: true,
    instructions: "Take on an empty stomach",
    color: "blue",
  },
  {
    id: 3,
    name: "Ibuprofen",
    dosage: "400mg",
    frequency: "Every 6 hours as needed",
    timing: "With food",
    schedule: [{ time: "As needed", label: "As needed", taken: null }],
    startDate: "2025-04-01",
    endDate: "2025-04-05",
    remainingDays: 3,
    remindersEnabled: false,
    instructions: "Do not take on empty stomach",
    color: "amber",
  },
  {
    id: 4,
    name: "Loratadine",
    dosage: "10mg",
    frequency: "Once daily",
    timing: "Morning",
    schedule: [{ time: "10:00 AM", label: "Morning", taken: false }],
    startDate: "2025-04-01",
    endDate: "2025-04-14",
    remainingDays: 14,
    remindersEnabled: true,
    instructions: "May cause drowsiness",
    color: "purple",
  },
]

// Color mapping for medication cards
const colorMap: Record<string, { light: string; border: string; dark: string }> = {
  teal: { light: "bg-teal-50", border: "border-teal-200", dark: "bg-teal-500" },
  blue: { light: "bg-blue-50", border: "border-blue-200", dark: "bg-blue-500" },
  amber: { light: "bg-amber-50", border: "border-amber-200", dark: "bg-amber-500" },
  purple: { light: "bg-purple-50", border: "border-purple-200", dark: "bg-purple-500" },
  pink: { light: "bg-pink-50", border: "border-pink-200", dark: "bg-pink-500" },
}

export function MedicationSchedule() {
  const [medications, setMedications] = useState(mockMedications)

  const toggleReminder = (id: number) => {
    setMedications(
      medications.map((med) => (med.id === id ? { ...med, remindersEnabled: !med.remindersEnabled } : med)),
    )
  }

  const markAsTaken = (medId: number, timeIndex: number) => {
    setMedications(
      medications.map((med) => {
        if (med.id === medId) {
          const updatedSchedule = [...med.schedule]
          updatedSchedule[timeIndex] = {
            ...updatedSchedule[timeIndex],
            taken: !updatedSchedule[timeIndex].taken,
          }
          return { ...med, schedule: updatedSchedule }
        }
        return med
      }),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Prescribed Medications</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Click on a time slot to mark a dose as taken</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {medications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No medications in your schedule</div>
      ) : (
        <div className="grid gap-6">
          {medications.map((med) => {
            const colorStyle = colorMap[med.color] || colorMap.teal

            return (
              <Card key={med.id} className={`overflow-hidden border ${colorStyle.border}`}>
                <div className={`h-1 ${colorStyle.dark}`}></div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{med.name}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {med.dosage} - {med.frequency}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleReminder(med.id)}
                      title={med.remindersEnabled ? "Disable reminders" : "Enable reminders"}
                    >
                      {med.remindersEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {med.schedule.map((time, idx) =>
                      time.taken !== null ? (
                        <div
                          key={idx}
                          className={`px-4 py-3 rounded-md flex items-center justify-between cursor-pointer transition-colors ${
                            time.taken
                              ? "bg-green-50 border border-green-200 text-green-700"
                              : `${colorStyle.light} border`
                          }`}
                          onClick={() => markAsTaken(med.id, idx)}
                        >
                          <div className="mr-3">
                            <p className="font-medium">{time.label}</p>
                            <p className="text-xs text-gray-500">{time.time}</p>
                          </div>
                          {time.taken && <Check className="h-4 w-4 text-green-600" />}
                        </div>
                      ) : (
                        <div key={idx} className="px-4 py-3 rounded-md border bg-gray-50">
                          <p className="font-medium">{time.label}</p>
                          <p className="text-xs text-gray-500">{time.time}</p>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm">
                          {med.startDate} to {med.endDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Remaining</p>
                        <p className="text-sm">{med.remainingDays} days</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end md:justify-start gap-2">
                      {med.remainingDays <= 3 ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Refill soon
                        </Badge>
                      ) : (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-1">Special Instructions</p>
                    <p className="text-sm">{med.instructions}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

