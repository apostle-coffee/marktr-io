import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { User, Mail, CreditCard, Bell, Shield } from 'lucide-react'
import { useState } from 'react'

export default function Account() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
  })

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 p-8 max-w-4xl">
        <h1 className="font-fraunces text-4xl font-bold text-text-dark mb-8">My Account</h1>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-button-green" />
                <CardTitle className="font-fraunces text-2xl">Profile Settings</CardTitle>
              </div>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <Button className="bg-button-green text-text-dark font-fraunces font-bold">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-button-green" />
                <CardTitle className="font-fraunces text-2xl">Subscription</CardTitle>
              </div>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-accent-grey/30 rounded-design">
                <div>
                  <div className="font-semibold text-text-dark">Free Plan</div>
                  <div className="text-sm text-text-dark/60">3 ICPs • Basic features</div>
                </div>
                <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-button-green" />
                <CardTitle className="font-fraunces text-2xl">Notifications</CardTitle>
              </div>
              <CardDescription>Configure your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-text-dark">Email Notifications</div>
                  <div className="text-sm text-text-dark/60">Receive updates via email</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-text-dark">Product Updates</div>
                  <div className="text-sm text-text-dark/60">Get notified about new features</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-button-green" />
                <CardTitle className="font-fraunces text-2xl">Security</CardTitle>
              </div>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button className="bg-button-green text-text-dark font-fraunces font-bold">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

