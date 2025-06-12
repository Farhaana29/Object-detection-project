"use client"

import { useState, useEffect } from "react"
import { Folder, FolderPlus, Search, Filter, MoreHorizontal, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

export default function CaseManagement() {
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      fetchCases()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchCases = () => {
    setIsLoading(true)
    try {
      const userId = localStorage.getItem("userId")
      // Get cases from localStorage
      const storedCases = localStorage.getItem("userCases")
      if (storedCases) {
        const parsedCases = JSON.parse(storedCases) as Case[]
        // Filter cases for current user
        const userCases = parsedCases.filter((c) => c.userId === userId)
        setCases(userCases)
      }
    } catch (error) {
      console.error("Error fetching cases:", error)
      toast({
        title: "Error",
        description: "Could not fetch cases",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPDF = (caseItem: Case) => {
    try {
      // Create a new PDF document
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()

      // Add title
      doc.setFontSize(20)
      doc.setTextColor(128, 64, 0) // Brown color
      doc.text(caseItem.caseName, pageWidth / 2, 20, { align: "center" })

      // Add date
      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: "center" })
      doc.text(`Case Date: ${new Date(caseItem.createdAt).toLocaleString()}`, pageWidth / 2, 38, { align: "center" })

      // Add image if available
      if (caseItem.imageUrl) {
        doc.addImage(caseItem.imageUrl, "JPEG", 20, 45, 170, 80)
        doc.setDrawColor(200, 200, 200)
        doc.rect(20, 45, 170, 80)
      }

      // Add description
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text("Scene Description", 20, 135)

      doc.setFontSize(10)
      const description = caseItem.description || "No description available"
      const splitDescription = doc.splitTextToSize(description, pageWidth - 40)
      doc.text(splitDescription, 20, 145)

      // Add detected objects
      const yPos = 145 + splitDescription.length * 5 + 10
      doc.setFontSize(14)
      doc.text("Detected Objects", 20, yPos)

      // Create a table for detected objects
      const detectedObjects = caseItem.detectedObjects || []
      const tableData = detectedObjects.map((obj, index) => [`${index + 1}`, obj])

      if (tableData.length === 0) {
        tableData.push(["", "No objects detected"])
      }

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
      doc.save(`${caseItem.caseName.replace(/\s+/g, "_")}.pdf`)

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

  const handleExportText = (caseItem: Case) => {
    // Create a text representation of the case
    const caseText = `
Case Name: ${caseItem.caseName}
Date: ${new Date(caseItem.createdAt).toLocaleString()}
---
Description:
${caseItem.description || "No description available"}

---
Detected Objects:
${caseItem.detectedObjects?.join("\n") || "No objects detected"}
    `.trim()

    // Create a blob and download it
    const blob = new Blob([caseText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${caseItem.caseName.replace(/\s+/g, "_")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Case exported successfully",
    })
  }

  const filteredCases = cases.filter((c) => c.caseName.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card className="border-gray-800 bg-gray-900/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-200">Case Management</CardTitle>
        <Button size="sm" className="bg-brown-700 hover:bg-brown-800 text-white" onClick={fetchCases}>
          <FolderPlus className="h-4 w-4 mr-2" />
          Refresh Cases
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search cases..."
              className="pl-9 bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-6">
              <div className="w-8 h-8 border-t-2 border-red-500 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-400">Loading cases...</p>
            </div>
          ) : filteredCases.length > 0 ? (
            filteredCases.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-md bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 text-brown-500" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-200">{c.caseName}</h3>
                    <p className="text-xs text-gray-400">Created: {new Date(c.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{c.detectedObjects?.length || 0} items</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => handleExportPDF(c)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Export PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportText(c)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Text
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400">
              {searchTerm
                ? "No cases found matching your search."
                : "No cases found. Analyze an image to create a case."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

