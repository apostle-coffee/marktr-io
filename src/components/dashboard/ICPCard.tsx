import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { MoreVertical, Edit, Trash2, Copy } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'

interface ICP {
  id: string
  name: string
  description: string
  industry?: string
  companySize?: string
  createdAt: string
}

interface ICPCardProps {
  icp: ICP
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
}

export default function ICPCard({ icp, onEdit, onDelete, onDuplicate }: ICPCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="font-fraunces text-xl mb-2">{icp.name}</CardTitle>
            <CardDescription className="line-clamp-2">{icp.description}</CardDescription>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="h-8 w-8"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {showMenu && (
              <div className="absolute right-0 top-10 bg-neutral-light border border-accent-grey rounded-design shadow-lg z-10 min-w-[150px] animate-scale-in">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit?.(icp.id)
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent-grey flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDuplicate?.(icp.id)
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent-grey flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(icp.id)
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent-grey text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {icp.industry && (
            <div className="text-sm">
              <span className="font-semibold">Industry:</span>{' '}
              <span className="text-text-dark/80">{icp.industry}</span>
            </div>
          )}
          {icp.companySize && (
            <div className="text-sm">
              <span className="font-semibold">Company Size:</span>{' '}
              <span className="text-text-dark/80">{icp.companySize}</span>
            </div>
          )}
        </div>
        <Link
          to={`/dashboard/icp/${icp.id}`}
          className="text-button-green hover:underline text-sm font-medium"
        >
          View Details →
        </Link>
      </CardContent>
    </Card>
  )
}

