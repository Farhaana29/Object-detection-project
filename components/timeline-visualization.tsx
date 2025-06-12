"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, Camera, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TimelineEvent {
  id: string
  time: string
  date: string
  title: string
  description: string
  type: "photo" | "document" | "location" | "note"
  location?: string
}

export default function TimelineVisualization() {
  const [events] = useState<TimelineEvent[]>([
    {
      id: "event-1",
      time: "08:30",
      date: "2024-03-15",
      title: "Initial Scene Documentation",
      description: "First responders arrived and documented the scene",
      type: "photo",
    },
    {
      id: "event-2",
      time: "09:15",
      date: "2024-03-15",
      title: "Evidence Collection - Item #1",
      description: "Fingerprints collected from entry point",
      type: "document",
    },
    {
      id: "event-3",
      time: "10:45",
      date: "2024-03-15",
      title: "Witness Statement",
      description: "Statement taken from neighbor who reported unusual activity",
      type: "note",
    },
    {
      id: "event-4",
      time: "13:20",
      date: "2024-03-15",
      title: "Secondary Location Identified",
      description: "Connected location identified based on evidence",
      type: "location",
      location: "42.3601° N, 71.0589° W",
    },
    {
      id: "event-5",
      time: "15:40",
      date: "2024-03-15",
      title: "Evidence Collection - Item #2",
      description: "Tool marks documented and photographed",
      type: "photo",
    },
  ])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "photo":
        return <Camera className="h-5 w-5 text-blue-400" />
      case "document":
        return <FileText className="h-5 w-5 text-green-400" />
      case "location":
        return <MapPin className="h-5 w-5 text-red-400" />
      case "note":
        return <FileText className="h-5 w-5 text-yellow-400" />
      default:
        return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <Card className="border-gray-800 bg-gray-900/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-200">Event Timeline</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Filter by Date
          </Button>
          <Button size="sm" className="bg-brown-700 hover:bg-brown-800 text-white">
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="timeline">Chronological View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline" className="space-y-0">
            <div className="relative pl-8 border-l border-gray-700 space-y-6 py-2">
              {events.map((event) => (
                <div key={event.id} className="relative">
                  <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-brown-700 border-4 border-gray-900 flex items-center justify-center">
                    {/* Timeline node */}
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-400">{event.time}</span>
                    <span className="text-xs text-gray-500">|</span>
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-400">{event.date}</span>
                  </div>
                  <div className="bg-gray-800/30 rounded-md p-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getEventIcon(event.type)}</div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-200">{event.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">{event.description}</p>
                        {event.location && (
                          <div className="flex items-center gap-1 mt-2">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-400">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="map">
            <div className="bg-gray-800/30 rounded-md p-4 h-[300px] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-10 w-10 text-brown-500 mx-auto mb-2" />
                <p className="text-gray-400">Map view would display event locations here</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

