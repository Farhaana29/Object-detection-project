"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simple authentication - hardcoded default user
    if (formData.username === "user" && formData.password === "123") {
      // Store user ID in localStorage
      localStorage.setItem("userId", "user-123")
      localStorage.setItem("username", formData.username)

      // Simulate network delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid credentials",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-gray-800 bg-gray-900/50 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-gray-200">Authentication Required</CardTitle>
        <CardDescription className="text-gray-400">Enter your credentials to access the system</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                className="pl-9 bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="pl-9 bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-brown-700 hover:bg-brown-800 text-white" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2">Authenticating</span>
                <span className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"></span>
              </>
            ) : (
              "Login to System"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

