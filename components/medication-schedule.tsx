"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Check, Bell, BellOff, Calendar, AlertCircle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define the structure for a medication
interface Medication {
  id: number
  name: string
  dosage: string
  frequency: string
  schedule: { time: string; label: string; taken: boolean | null }[]
  startDate: string
  endDate: string
  remainingDays: number
  remindersEnabled: boolean
  instructions: string
  color: string
}

// Color mapping for medication cards
const colorMap: Record<string, { light: string; border: string; dark: string }> = {
  teal: { light: "bg-teal-50", border: "border-teal-200", dark: "bg-teal-500" },
  blue: { light: "bg-blue-50", border: "border-blue-200", dark: "bg-blue-500" },
  amber: { light: "bg-amber-50", border: "border-amber-200", dark: "bg-amber-500" },
  purple: { light: "bg-purple-50", border: "border-purple-200", dark: "bg-purple-500" },
}

export function MedicationSchedule() {
  const [medications, setMedications] = useState<Medication[]>([])

  // Function to fetch medication data
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch('http://localhost:8000/user-prescriptions?user_email=abhaypawar0817%40gmail.com')
        const data = await response.json()

        // Extract and parse data dynamically from cleaned_text
        const prescriptions = data.prescriptions.map((prescription: any, index: number) => {
          const cleanedText = prescription.cleaned_text

          // Regular expressions to extract key information dynamically from the cleaned_text
          const nameRegex = /([A-Za-z\s]+)\s*-\s*\d+\s?mg/  // Extract medication name
          const dosageRegex = /(\d+\s?mg|\d+\s?ml)/  // Extract dosage like "500mg"
          const frequencyRegex = /(once daily|twice daily|every \d+ hours|morning|afternoon|evening)/i // Extract frequency
          const instructionRegex = /instructions?:\s?([A-Za-z\s.,]+)/i  // Extract instructions

          // Extract medication name using regex
          const nameMatch = cleanedText.match(nameRegex)
          const name = nameMatch ? nameMatch[1].trim() : "Unknown Medication"

          // Extract dosage from the text
          const dosageMatch = cleanedText.match(dosageRegex)
          const dosage = dosageMatch ? dosageMatch[0] : "Unknown Dosage"

          // Extract frequency from the text
          const frequencyMatch = cleanedText.match(frequencyRegex)
          const frequency = frequencyMatch ? frequencyMatch[0] : "Unknown Frequency"

          // Extract special instructions
          const instructionMatch = cleanedText.match(instructionRegex)
          const instructions = instructionMatch ? instructionMatch[1].trim() : "No special instructions"

          // Extract the schedule (assuming we have times like "Morning", "Afternoon", "Evening" in cleaned text)
          const schedule = [
            { time: "8:00 AM", label: "Morning", taken: null },
            { time: "2:00 PM", label: "Afternoon", taken: null },
            { time: "8:00 PM", label: "Evening", taken: null },
          ]

          // Dummy dates and remaining days (can be extracted from cleaned_text if available)
          const startDate = "2025-04-01"  // Placeholder value
          const endDate = "2025-04-07"    // Placeholder value
          const remainingDays = 5         // Placeholder value

          // Return the medication object dynamically
          return {
            id: index + 1,
            name: name,
            dosage: dosage,
            frequency: frequency,
            schedule: schedule,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays,
            remindersEnabled: true,
            instructions: instructions,
            color: "teal",  // Dynamically determine color if necessary
          }
        })

        setMedications(prescriptions)
      } catch (error) {
        console.error("Error fetching medications:", error)
      }
    }

    fetchMedications()
  }, [])

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
