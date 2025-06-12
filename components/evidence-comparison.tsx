"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeftRight, ZoomIn, ZoomOut, Maximize2, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EvidenceComparison() {
  const [zoomLevel, setZoomLevel] = useState(100)
  const [splitPosition, setSplitPosition] = useState(50)

  return (
    <Card className="border-gray-800 bg-gray-900/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-200">Image Comparison</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Swap Images
          </Button>
          <Button size="sm" className="bg-brown-700 hover:bg-brown-800 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="side-by-side" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
            <TabsTrigger value="overlay">Overlay</TabsTrigger>
            <TabsTrigger value="split">Split View</TabsTrigger>
          </TabsList>

          <TabsContent value="side-by-side">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative bg-black rounded-md overflow-hidden h-[300px]">
                <Image src="/placeholder.svg?height=300&width=400" alt="Evidence A" fill className="object-contain" />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Image A
                </div>
              </div>
              <div className="relative bg-black rounded-md overflow-hidden h-[300px]">
                <Image src="/placeholder.svg?height=300&width=400" alt="Evidence B" fill className="object-contain" />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Image B
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="overlay">
            <div className="relative bg-black rounded-md overflow-hidden h-[300px]">
              <Image
                src="/placeholder.svg?height=300&width=600"
                alt="Evidence A"
                fill
                className="object-contain opacity-100"
              />
              <Image
                src="/placeholder.svg?height=300&width=600"
                alt="Evidence B"
                fill
                className="object-contain opacity-50"
              />
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-white">Opacity</span>
                  <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="split">
            <div className="relative bg-black rounded-md overflow-hidden h-[300px]">
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${splitPosition}%` }}>
                <Image src="/placeholder.svg?height=300&width=600" alt="Evidence A" fill className="object-contain" />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Image A
                </div>
              </div>
              <div className="absolute inset-0 overflow-hidden" style={{ left: `${splitPosition}%` }}>
                <Image
                  src="/placeholder.svg?height=300&width=600"
                  alt="Evidence B"
                  fill
                  className="object-contain"
                  style={{ objectPosition: `${-splitPosition}% 0` }}
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Image B
                </div>
              </div>
              <div
                className="absolute h-full w-1 bg-white left-1/2 transform -translate-x-1/2 cursor-ew-resize"
                style={{ left: `${splitPosition}%` }}
              />
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-white">Split Position</span>
                  <Slider
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    className="w-full"
                    onValueChange={(value) => setSplitPosition(value[0])}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Slider
              defaultValue={[100]}
              min={50}
              max={200}
              step={10}
              className="w-32"
              onValueChange={(value) => setZoomLevel(value[0])}
            />
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <span className="text-xs text-gray-400 ml-2">{zoomLevel}%</span>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

