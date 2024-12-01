"use client"

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ShoppingListView } from '@/components/shopping-list-view'
import { CreateListModal } from '@/components/create-list-modal'
import { MembersList } from '@/components/members-list'
import { AddMemberModal } from '@/components/add-member-modal'
import { ShoppingList, ShoppingItem, Member } from '@/types'
import { Button } from "@/components/ui/button"
import { UserPlus } from 'lucide-react'

const initialList: ShoppingList = {
  id: '1',
  name: 'Grocery List',
  items: [
    { id: '1', name: 'Milk', completed: false },
    { id: '2', name: 'Bread', completed: true },
    { id: '3', name: 'Eggs', completed: false },
  ],
  members: [
    { id: '1', name: 'Me', isOwner: true },
    { id: '2', name: 'John', isOwner: false },
  ],
}

export default function Home() {
  const [activeList, setActiveList] = useState<ShoppingList>(initialList)
  const [archivedLists, setArchivedLists] = useState<ShoppingList[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [view, setView] = useState<'list' | 'members'>('list')

  const handleAddItem = (name: string) => {
    const newItem: ShoppingItem = { id: Date.now().toString(), name, completed: false }
    setActiveList(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  const handleToggleItem = (id: string) => {
    setActiveList(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }))
  }

  const handleRemoveItem = (id: string) => {
    setActiveList(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  const handleRecycleItem = (id: string) => {
    // Implement recycle logic here
    console.log('Recycle item:', id)
  }

  const handleCreateList = (name: string) => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      items: [],
      members: [{ id: '1', name: 'Me', isOwner: true }],
    }
    setActiveList(newList)
    setShowCreateModal(false)
  }

  const handleAddMember = (name: string) => {
    const newMember: Member = {
      id: Date.now().toString(),
      name,
      isOwner: false,
    }
    setActiveList(prev => ({
      ...prev,
      members: [...prev.members, newMember]
    }))
    setShowAddMemberModal(false)
  }

  const handleRemoveMember = (id: string) => {
    setActiveList(prev => ({
      ...prev,
      members: prev.members.filter(member => member.id !== id)
    }))
  }

  const handleArchiveList = () => {
    setArchivedLists(prev => [...prev, activeList])
    setActiveList({
      id: Date.now().toString(),
      name: 'New List',
      items: [],
      members: [{ id: '1', name: 'Me', isOwner: true }],
    })
  }

  return (
    <div className="flex h-screen bg-emerald-200">
      <Sidebar
        onCreateList={() => setShowCreateModal(true)}
        onShowArchived={() => setShowArchived(true)}
        onShowActiveList={() => setShowArchived(false)}
        onAddUser={() => setView('members')}
      />
      <main className="flex-1 p-4 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Shopping List</h1>
        {view === 'list' ? (
          <ShoppingListView
            list={activeList}
            onAddItem={handleAddItem}
            onToggleItem={handleToggleItem}
            onRemoveItem={handleRemoveItem}
            onRecycleItem={handleRecycleItem}
            onArchiveList={handleArchiveList}
          />
        ) : (
          <>
            <MembersList
              members={activeList.members}
              onRemoveMember={handleRemoveMember}
            />
            <Button
              onClick={() => setShowAddMemberModal(true)}
              className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </>
        )}
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            +Create
          </Button>
        </div>
      </main>
      <CreateListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateList={handleCreateList}
      />
      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onAddMember={handleAddMember}
      />
    </div>
  )
}

