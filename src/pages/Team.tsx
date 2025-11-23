import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Users, UserPlus, Mail, Crown, Shield, User } from 'lucide-react'
import { useState } from 'react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  status: 'active' | 'pending'
}

const mockMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'owner',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    status: 'active',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'member',
    status: 'pending',
  },
]

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>(mockMembers)
  const [inviteEmail, setInviteEmail] = useState('')

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: 'member',
      status: 'pending',
    }
    setMembers([...members, newMember])
    setInviteEmail('')
  }

  const handleRemove = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setMembers(members.filter(m => m.id !== id))
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow" />
      case 'admin':
        return <Shield className="h-4 w-4 text-button-green" />
      default:
        return <User className="h-4 w-4 text-text-dark/60" />
    }
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 p-8 max-w-4xl">
        <h1 className="font-fraunces text-4xl font-bold text-text-dark mb-8">Team Settings</h1>

        <div className="space-y-6">
          {/* Invite Member */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-button-green" />
                <CardTitle className="font-fraunces text-2xl">Invite Team Member</CardTitle>
              </div>
              <CardDescription>Add new members to your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleInvite}
                  className="bg-button-green text-text-dark font-fraunces font-bold"
                >
                  Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-button-green" />
                <CardTitle className="font-fraunces text-2xl">Team Members</CardTitle>
              </div>
              <CardDescription>{members.length} members in your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-accent-grey rounded-design"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-button-green/20 rounded-design flex items-center justify-center">
                        {getRoleIcon(member.role)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-text-dark">{member.name}</span>
                          {member.status === 'pending' && (
                            <span className="text-xs bg-warning-amber/20 text-warning-amber px-2 py-1 rounded-full">
                              Pending
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-text-dark/60 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                        <div className="text-xs text-text-dark/40 mt-1 capitalize">
                          {member.role}
                        </div>
                      </div>
                    </div>
                    {member.role !== 'owner' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(member.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

