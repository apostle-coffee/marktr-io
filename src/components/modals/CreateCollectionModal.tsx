import { useState } from 'react'
import { Modal } from '../ui/modal'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

interface CreateCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: { name: string; description?: string }) => Promise<string | null> | void
}

export default function CreateCollectionModal({
  isOpen,
  onClose,
  onCreate,
}: CreateCollectionModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Collection name is required')
      return
    }
    setIsCreating(true)
    try {
      const result = await onCreate({ name: name.trim(), description: description.trim() || undefined })
      setName('')
      setDescription('')
      setError('')
      onClose()
      return result
    } catch (err) {
      setError('Failed to create collection')
      return null
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Collection" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Collection Name *</label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="e.g., Q1 2024 ICPs"
            className={error ? 'border-red-500' : ''}
            autoFocus
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for this collection"
            rows={3}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="bg-button-green text-text-dark font-fraunces font-bold"
          >
            {isCreating ? 'Creating...' : 'Create Collection'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

