"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import jsPDF from "jspdf"
import "jspdf-autotable"

interface Case {
  id: string
  userId: string
  caseName: string
  imageUrl?: string
  detectedObjects?: string[]
  description?: string
  createdAt: Date
}

export default function Results() {
  const router = useRouter()
  const [detectedObjects, setDetectedObjects] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [imageData, setImageData] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Get image from localStorage
    const storedImage = localStorage.getItem("analyzedImage")
    setImageData(storedImage)

    // Simulate API response with detected objects
    const mockObjects = [
      "Coffee cup",
      "Table",
      
    ]

    const mockDescription =
      "The image shows what appears to be an indoor scene.There is a white cup of coffee or beverage spotted " +
      "The coffee cup is on a wooden table " 

    // Simulate loading time
    const timer = setTimeout(() => {
      setDetectedObjects(mockObjects)
      setDescription(mockDescription)

      // Get userId from localStorage
      const userId = localStorage.getItem("userId")

      // Save the case to history if userId exists
      if (userId && storedImage) {
        // Create new case
        const newCase: Case = {
          id: Date.now().toString(),
          userId,
          caseName: `Case Analysis ${new Date().toLocaleString()}`,
          imageUrl: storedImage,
          detectedObjects: mockObjects,
          description: mockDescription,
          createdAt: new Date(),
        }

        // Get existing cases from localStorage
        const storedCases = localStorage.getItem("userCases")
        const existingCases = storedCases ? (JSON.parse(storedCases) as Case[]) : []

        // Add new case to existing cases
        const updatedCases = [newCase, ...existingCases]

        // Save updated cases to localStorage
        localStorage.setItem("userCases", JSON.stringify(updatedCases))
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const generatePDF = () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()

      // Add title
      doc.setFontSize(20)
      doc.setTextColor(128, 64, 0) // Brown color
      doc.text("Crime Scene Analysis Report", pageWidth / 2, 20, { align: "center" })

      // Add date
      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: "center" })

      // Add image if available
      if (imageData) {
        doc.addImage(imageData, "JPEG", 20, 40, 170, 80)
        doc.setDrawColor(200, 200, 200)
        doc.rect(20, 40, 170, 80)
      }

      // Add description
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text("Scene Description", 20, 130)

      doc.setFontSize(10)
      const splitDescription = doc.splitTextToSize(description, pageWidth - 40)
      doc.text(splitDescription, 20, 140)

      // Add detected objects
      const yPos = 140 + splitDescription.length * 5 + 10
      doc.setFontSize(14)
      doc.text("Detected Objects", 20, yPos)

      // Create a table for detected objects
      const tableData = detectedObjects.map((obj, index) => [`${index + 1}`, obj])

      // @ts-ignore - jspdf-autotable types
      doc.autoTable({
        startY: yPos + 5,
        head: [["#", "Object"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [128, 64, 0], textColor: [255, 255, 255] },
        margin: { left: 20, right: 20 },
      })

      // Save the PDF
      doc.save(`crime_scene_analysis_${new Date().getTime()}.pdf`)

      toast({
        title: "PDF Generated",
        description: "Your report has been downloaded successfully",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-brown-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brown-500">Analysis Results</h1>
            <p className="text-gray-400 text-sm md:text-base">Object detection and scene description</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-800 bg-gray-900/50 shadow-lg overflow-hidden">
              <div className="relative w-full h-[300px] md:h-[400px]">
                {imageData ? (
                  <img
                    src={imageData || "/placeholder.svg"}
                    alt="Analyzed evidence image"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800/50">
                    <div className="w-8 h-8 border-t-2 border-red-500 rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Overlay with detected object markers */}
                {imageData && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* These would be positioned based on actual detection coordinates */}
                    <div className="absolute top-[20%] left-[30%] h-8 w-8 border-2 border-brown-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white bg-brown-500 px-1 rounded">1</span>
                    </div>
                    <div className="absolute top-[40%] left-[60%] h-8 w-8 border-2 border-brown-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white bg-brown-500 px-1 rounded">2</span>
                    </div>
                    <div className="absolute top-[70%] left-[25%] h-8 w-8 border-2 border-brown-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white bg-brown-500 px-1 rounded">3</span>
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    <span>Save Image</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={generatePDF}
                    disabled={!imageData || !description}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Export Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-200">Scene Description</CardTitle>
                <CardDescription className="text-gray-400">
                BART-generated description of the analyzed scene
                </CardDescription>
              </CardHeader>
              <CardContent>
                {description ? (
                  <p className="text-gray-300 leading-relaxed">{description}</p>
                ) : (
                  <div className="h-20 flex items-center justify-center">
                    <div className="w-8 h-8 border-t-2 border-red-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-gray-800 bg-gray-900/50 shadow-lg sticky top-4">
              <CardHeader>
                <CardTitle className="text-gray-200">Detected Objects</CardTitle>
                <CardDescription className="text-gray-400">
                  {detectedObjects.length} items identified in the scene
                </CardDescription>
              </CardHeader>
              <CardContent>
                {detectedObjects.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {detectedObjects.map((object, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-800/50 text-gray-200 hover:bg-gray-700">
                          {object}
                        </Badge>
                      ))}
                    </div>

                    <Separator className="bg-gray-800" />

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-300">Object Details</h3>
                      {detectedObjects.map((object, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-brown-500/20 border border-brown-500 flex items-center justify-center">
                            <span className="text-xs text-brown-500">{index + 1}</span>
                          </div>
                          <span className="text-sm text-gray-300">{object}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center">
                    <div className="w-8 h-8 border-t-2 border-red-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

