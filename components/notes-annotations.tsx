"use client"

import { useState, useEffect } from "react"
import { Trash, Save, FileText, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

interface Note {
  id: string
  userId: string
  title: string
  content: string
  createdAt: Date
}

export default function NotesAnnotations() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Get userId from localStorage
    const id = localStorage.getItem("userId")
    setUserId(id)

    if (id) {
      fetchNotes()
    }
  }, [])

  const fetchNotes = () => {
    setIsLoading(true)
    try {
      // Get notes from localStorage
      const storedNotes = localStorage.getItem("userNotes")
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes) as Note[]
        // Filter notes for current user
        const userNotes = parsedNotes.filter((note) => note.userId === userId)
        setNotes(userNotes)
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
      toast({
        title: "Error",
        description: "Could not fetch notes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNote = () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to create notes",
        variant: "destructive",
      })
      return
    }

    if (!newNote.content.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create new note
      const newNoteObj: Note = {
        id: Date.now().toString(),
        userId: userId,
        title: newNote.title || "Untitled Note",
        content: newNote.content,
        createdAt: new Date(),
      }

      // Get existing notes from localStorage
      const storedNotes = localStorage.getItem("userNotes")
      const existingNotes = storedNotes ? (JSON.parse(storedNotes) as Note[]) : []

      // Add new note to existing notes
      const updatedNotes = [newNoteObj, ...existingNotes]

      // Save updated notes to localStorage
      localStorage.setItem("userNotes", JSON.stringify(updatedNotes))

      // Update state
      setNotes((prev) => [newNoteObj, ...prev])
      setNewNote({ title: "", content: "" })

      toast({
        title: "Success",
        description: "Note created successfully",
      })
    } catch (error) {
      console.error("Error creating note:", error)
      toast({
        title: "Error",
        description: "Could not create note",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteNote = (noteId: string) => {
    setIsLoading(true)

    try {
      // Get existing notes from localStorage
      const storedNotes = localStorage.getItem("userNotes")
      if (storedNotes) {
        const existingNotes = JSON.parse(storedNotes) as Note[]

        // Filter out the note to delete
        const updatedNotes = existingNotes.filter((note) => note.id !== noteId)

        // Save updated notes to localStorage
        localStorage.setItem("userNotes", JSON.stringify(updatedNotes))

        // Update state
        setNotes((prev) => prev.filter((note) => note.id !== noteId))

        toast({
          title: "Success",
          description: "Note deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: "Could not delete note",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-gray-800 bg-gray-900/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-200">Notes & Annotations</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchNotes} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Create New Note</h3>
          <div className="space-y-3">
            <Input
              placeholder="Note Title (Optional)"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="bg-gray-800/50 border-gray-700 text-gray-200"
            />
            <Textarea
              placeholder="Enter your notes here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="min-h-[120px] bg-gray-800/50 border-gray-700 text-gray-200"
            />
            <Button
              onClick={handleCreateNote}
              className="w-full bg-brown-700 hover:bg-brown-800 text-white"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Note
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Your Notes</h3>

          {isLoading && notes.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-t-2 border-red-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading notes...</p>
            </div>
          ) : notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="bg-gray-800/30 border border-gray-800 rounded-md p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-200">{note.title || "Untitled Note"}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteNote(note.id)}
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{note.content}</p>
                  <p className="text-gray-500 text-xs">{new Date(note.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">No notes yet. Create one to get started!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

