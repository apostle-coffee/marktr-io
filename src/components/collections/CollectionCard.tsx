import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { MoreVertical, Edit, Trash2, FolderOpen } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'

interface Collection {
  id: string
  name: string
  description?: string
  icpCount: number
  createdAt: string
}

interface CollectionCardProps {
  collection: Collection
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function CollectionCard({ collection, onEdit, onDelete }: CollectionCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <Link to={`/collections/${collection.id}`}>
      <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 bg-button-green/20 rounded-design flex items-center justify-center flex-shrink-0">
                <FolderOpen className="h-6 w-6 text-button-green" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="font-fraunces text-xl mb-1 truncate">{collection.name}</CardTitle>
                {collection.description && (
                  <CardDescription className="line-clamp-2">{collection.description}</CardDescription>
                )}
              </div>
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  setShowMenu(!showMenu)
                }}
                className="h-8 w-8"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
              {showMenu && (
                <div
                  className="absolute right-0 top-10 bg-neutral-light border border-accent-grey rounded-design shadow-lg z-10 min-w-[150px] animate-scale-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        onEdit?.(collection.id)
                        setShowMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-accent-grey flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        onDelete?.(collection.id)
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
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-dark/60">
              {collection.icpCount} {collection.icpCount === 1 ? 'ICP' : 'ICPs'}
            </span>
            <span className="text-xs text-text-dark/40">
              {new Date(collection.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

