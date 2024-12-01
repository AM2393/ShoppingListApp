"use client"

import { useState } from "react"
import { Plus, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface CreateListDialogProps {
  onCreateList: (name: string) => Promise<{id: string}>
}

export default function CreateListDialog({ onCreateList }: CreateListDialogProps) {
  const [open, setOpen] = useState(false)
  const [listName, setListName] = useState("")
  const [members, setMembers] = useState<string[]>([])
  const [memberInput, setMemberInput] = useState("")

  const handleCreate = async () => {
    if (listName.trim()) {
      const newList = await onCreateList(listName)
      for (const member of members) {
        await fetch(`/api/shopping-lists/${newList.id}?action=invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: member }),
        })
      }
      setOpen(false)
      setListName("")
      setMembers([])
      setMemberInput("")
    }
  }

  const addMember = () => {
    if (memberInput.trim() && !members.includes(memberInput)) {
      setMembers([...members, memberInput])
      setMemberInput("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-6 bg-purple-600 hover:bg-purple-700">
          +Create
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#7FFFD4]/20 border-none">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Create new list</DialogTitle>
        </DialogHeader>
        <div className="bg-blue-200/50 p-6 rounded-lg space-y-4">
          <Input
            placeholder="Enter name list"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="bg-white"
          />
          <div className="space-y-2">
            {members.map((member, index) => (
              <div key={index} className="bg-white p-2 rounded flex justify-between items-center">
                <span>{member}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMembers(members.filter((_, i) => i !== index))}
                >
                  ×
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button 
                onClick={addMember}
                className="w-full bg-white text-black hover:bg-gray-100 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Add member
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-white text-black hover:bg-gray-100"
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

