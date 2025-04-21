"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { UploadCloudIcon, FileTextIcon, XIcon, CheckCircleIcon, AlertCircleIcon, ArrowUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function PrescriptionUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setUploadStatus("idle")
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile)
        setUploadStatus("idle")
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setUploadProgress(0)
    setUploadStatus("idle")

    const formData = new FormData()
    formData.append("file", file)

    // Get user email from localStorage
    const userEmail = localStorage.getItem("userEmail")
    if (userEmail) {
      formData.append("user_email", userEmail)
    }

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          return newProgress > 90 ? 90 : newProgress
        })
      }, 300)

      const response = await fetch("http://localhost:8000/extract-text", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (response.ok) {
        setUploadStatus("success")
        toast({
          title: "Success",
          description: "Prescription processed successfully",
        })
        console.log("Extracted data:", data)
      } else {
        setUploadStatus("error")
        toast({
          title: "Error",
          description: data.message || "Failed to process prescription",
          variant: "destructive",
        })
      }
    } catch (error) {
      setUploadStatus("error")
      toast({
        title: "Error",
        description: "An error occurred while uploading the file",
        variant: "destructive",
      })
      console.error("Upload error:", error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }

  const clearFile = () => {
    setFile(null)
    setUploadStatus("idle")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Reset progress when component unmounts
  useEffect(() => {
    return () => {
      setUploadProgress(0)
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Prescription Upload
            </h2>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`upload-area-${isDragging ? "dragging" : "idle"}`}
                  initial={{ opacity: 0.8, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "relative border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden group",
                    isDragging
                      ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,0,0,0.1)]"
                      : "border-gray-200 hover:border-primary/50 dark:border-gray-700",
                    file ? "bg-gray-50/80 dark:bg-gray-800/30" : "",
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {/* Background gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <input
                    ref={fileInputRef}
                    id="prescription-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {!file ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 relative z-10">
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 2,
                          repeatType: "reverse",
                        }}
                        className="mb-3"
                      >
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-md opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="relative bg-white dark:bg-gray-800 rounded-full p-3">
                            <UploadCloudIcon className="h-10 w-10 text-primary group-hover:text-primary/80 transition-colors duration-300" />
                          </div>
                        </div>
                      </motion.div>

                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4 group-hover:text-primary transition-colors duration-300">
                        Upload Prescription
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center max-w-xs">
                        Drag and drop your PDF file here or click to browse
                      </p>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="mt-5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="relative overflow-hidden group-hover:border-primary/50 transition-colors duration-300"
                        >
                          <ArrowUpIcon className="mr-2 h-4 w-4" />
                          Select PDF File
                          <span className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-5 relative z-10">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          initial={{ rotate: -10, scale: 0.9 }}
                          animate={{ rotate: 0, scale: 1 }}
                          className="relative"
                        >
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary/60 to-purple-600/60 rounded-lg blur-sm opacity-70" />
                          <div className="relative bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <FileTextIcon className="h-8 w-8 text-primary" />
                          </div>
                        </motion.div>

                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[180px]">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.size / 1024).toFixed(1)} KB • PDF
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e : any) => {
                          e.stopPropagation()
                          clearFile()
                        }}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <XIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Uploading prescription...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-purple-600 rounded-full"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {uploadStatus === "success" && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg p-3 flex items-center text-green-700 dark:text-green-400"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p className="text-sm">Prescription processed successfully!</p>
                  </motion.div>
                )}

                {uploadStatus === "error" && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg p-3 flex items-center text-red-700 dark:text-red-400"
                  >
                    <AlertCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p className="text-sm">Error processing prescription. Please try again.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleUpload}
                  disabled={!file || isLoading}
                  className="w-full relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Upload Prescription"
                    )}
                  </span>
                </Button>
              </motion.div>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 px-4">
                We accept PDF prescriptions only. Your data is processed securely and encrypted.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
