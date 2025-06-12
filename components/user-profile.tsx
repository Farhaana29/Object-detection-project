"use client"

import { useState } from "react"
import { User, Mail, Shield, Bell, Key, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState({
    name: "user123",
    email: "user123@gmail.com",
    department: "Criminal Investigation",
    badgeNumber: "PD-5529",
  })

  const [notifications, setNotifications] = useState({
    caseUpdates: true,
    newEvidence: true,
    systemAlerts: false,
    reportGeneration: true,
  })

  return (
    <Card className="border-gray-800 bg-gray-900/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-200">User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                  <AvatarFallback className="bg-brown-700 text-white text-xl">JD</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="name"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                        className="pl-9 bg-gray-800/50 border-gray-700 text-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        className="pl-9 bg-gray-800/50 border-gray-700 text-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-gray-300">
                      Department
                    </Label>
                    <Input
                      id="department"
                      value={userInfo.department}
                      onChange={(e) => setUserInfo({ ...userInfo, department: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 text-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="badgeNumber" className="text-gray-300">
                      Badge Number
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="badgeNumber"
                        value={userInfo.badgeNumber}
                        onChange={(e) => setUserInfo({ ...userInfo, badgeNumber: e.target.value })}
                        className="pl-9 bg-gray-800/50 border-gray-700 text-gray-200"
                      />
                    </div>
                  </div>
                </div>

                <Button className="bg-brown-700 hover:bg-brown-800 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-300">
                  Current Password
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="currentPassword"
                    type="password"
                    className="pl-9 bg-gray-800/50 border-gray-700 text-gray-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-300">
                  New Password
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="newPassword"
                    type="password"
                    className="pl-9 bg-gray-800/50 border-gray-700 text-gray-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="pl-9 bg-gray-800/50 border-gray-700 text-gray-200"
                  />
                </div>
              </div>

              <Button className="bg-brown-700 hover:bg-brown-800 text-white">Update Password</Button>

              <div className="pt-4 border-t border-gray-800">
                <h3 className="text-sm font-medium text-gray-300 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Enhance your account security</p>
                    <p className="text-xs text-gray-400 mt-1">
                      We'll ask for a verification code in addition to your password
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-300">Email Notifications</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-gray-300">Case Updates</Label>
                    <p className="text-xs text-gray-400">Receive notifications when cases are updated</p>
                  </div>
                  <Switch
                    checked={notifications.caseUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, caseUpdates: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-gray-300">New Evidence</Label>
                    <p className="text-xs text-gray-400">Get notified when new evidence is added</p>
                  </div>
                  <Switch
                    checked={notifications.newEvidence}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newEvidence: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-gray-300">System Alerts</Label>
                    <p className="text-xs text-gray-400">Receive system maintenance and update notifications</p>
                  </div>
                  <Switch
                    checked={notifications.systemAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm text-gray-300">Report Generation</Label>
                    <p className="text-xs text-gray-400">Get notified when reports are generated</p>
                  </div>
                  <Switch
                    checked={notifications.reportGeneration}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, reportGeneration: checked })}
                  />
                </div>
              </div>

              <Button className="bg-brown-700 hover:bg-brown-800 text-white mt-4">
                <Bell className="h-4 w-4 mr-2" />
                Save Notification Preferences
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

