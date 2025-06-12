"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Upload,
  FileUp,
  LogOut,
  LayoutDashboard,
  FolderOpen,
  Clock,
  SplitSquareVertical,
  FileText,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageUploader from "@/components/image-uploader"
import CaseManagement from "@/components/case-management"
import TimelineVisualization from "@/components/timeline-visualization"
import EvidenceComparison from "@/components/evidence-comparison"
import NotesAnnotations from "@/components/notes-annotations"
import { useToast } from "@/hooks/use-toast"
import UserProfile from "@/components/user-profile"

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Add a useEffect at the beginning of the component to check authentication
  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem("userId")
    if (!userId) {
      // Redirect to login page if not logged in
      router.push("/")
      toast({
        title: "Authentication Required",
        description: "Please log in to access the dashboard",
        variant: "destructive",
      })
    }

    // Clear any previous image analysis
    localStorage.removeItem("analyzedImage")
  }, [])

  // Update the handleLogout function
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userId")
    localStorage.removeItem("username")
    localStorage.removeItem("analyzedImage")

    // Redirect to login page
    router.push("/")
  }

  const handleImageAnalysis = () => {
    // Check if an image has been uploaded
    const imageData = localStorage.getItem("analyzedImage")
    if (!imageData) {
      toast({
        title: "No Image",
        description: "Please upload an image before analyzing",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false)
      router.push("/dashboard/results")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-brown-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brown-500">Object detection System</h1>
            <p className="text-gray-400 text-sm md:text-base">Upload and analyze scene Image</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </header>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-8 grid grid-cols-6">
            <TabsTrigger value="dashboard" className="flex flex-col items-center gap-1 py-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex flex-col items-center gap-1 py-2">
              <FolderOpen className="h-4 w-4" />
              <span className="text-xs">Cases</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex flex-col items-center gap-1 py-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex flex-col items-center gap-1 py-2">
              <SplitSquareVertical className="h-4 w-4" />
              <span className="text-xs">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex flex-col items-center gap-1 py-2">
              <FileText className="h-4 w-4" />
              <span className="text-xs">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col items-center gap-1 py-2">
              <User className="h-4 w-4" />
              <span className="text-xs">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="border-gray-800 bg-gray-900/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-200">Upload Image</CardTitle>
                    <CardDescription className="text-gray-400">
                      Upload an image from the scene for object detection and analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImageUploader />
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full gap-2 bg-brown-700 hover:bg-brown-800"
                      onClick={handleImageAnalysis}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Upload className="h-4 w-4 animate-pulse" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <FileUp className="h-4 w-4" />
                          <span>Analyze Image</span>
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card className="border-gray-800 bg-gray-900/50 shadow-lg h-full">
                  <CardHeader>
                    <CardTitle className="text-gray-200">Analysis Guidelines</CardTitle>
                    <CardDescription className="text-gray-400">Best practices for Image analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-300 space-y-4">
                    <p>Upload clear, high-resolution images for the best detection results.</p>
                    <p>Ensure proper lighting conditions in the original image for accurate object identification.</p>
                    <p>The system can detect common objects and provide a detailed description of the scene.</p>
                    <p>All uploaded evidence is processed securely and confidentially.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cases">
            <CaseManagement />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineVisualization />
          </TabsContent>

          <TabsContent value="compare">
            <EvidenceComparison />
          </TabsContent>

          <TabsContent value="notes">
            <NotesAnnotations />
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

