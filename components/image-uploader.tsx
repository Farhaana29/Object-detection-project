"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function ImageUploader() {
  const [image, setImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageData = e.target.result as string
        setImage(imageData)

        // Store the image in localStorage for result page
        try {
          localStorage.setItem("analyzedImage", imageData)
        } catch (error) {
          console.error("Error storing image in localStorage:", error)
          toast({
            title: "Storage Error",
            description: "The image is too large to store locally. Please use a smaller image.",
            variant: "destructive",
          })
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImage(null)
    localStorage.removeItem("analyzedImage")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {!image ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? "border-red-500 bg-red-500/10" : "border-gray-700 hover:border-gray-600 bg-gray-800/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-10 w-10 text-gray-500 mb-2" />
            <p className="text-sm font-medium text-gray-300 mb-1">Drag and drop an image, or click to browse</p>
            <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP (max 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-700">
          <img src={image || "/placeholder.svg"} alt="Uploaded evidence" className="w-full h-[250px] object-cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

