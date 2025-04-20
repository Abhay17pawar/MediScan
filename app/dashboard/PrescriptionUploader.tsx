"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function PrescriptionUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    
    // Get user email from localStorage
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      formData.append("user_email", userEmail);
    }

    try {
      const response = await fetch("http://localhost:8000/extract-text", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Prescription processed successfully",
        });
        console.log("Extracted data:", data);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to process prescription",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while uploading the file",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <input
          id="prescription-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="file:bg-primary file:text-primary-foreground file:hover:bg-primary/90 file:rounded-lg file:border-0 file:px-4 file:py-2 file:mr-4 file:cursor-pointer cursor-pointer border rounded-lg"
        />
        <p className="text-sm text-muted-foreground">
          Upload a PDF prescription file
        </p>
      </div>
      <Button onClick={handleUpload} disabled={!file || isLoading}>
        {isLoading ? "Processing..." : "Upload Prescription"}
      </Button>
    </div>
  );
}