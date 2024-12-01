"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

interface ShoppingItem {
  _id: string
  name: string
  completed: boolean
}

interface ShoppingList {
  _id: string
  name: string
  items: ShoppingItem[]
}

export function ShoppingListDetail({ id }: { id: string }) {
  const [list, setList] = useState<ShoppingList | null>(null)
  const [newItemName, setNewItemName] = useState('')

  useEffect(() => {
    fetchList()
  }, [id])

  const fetchList = async () => {
    try {
      const response = await fetch(`/api/shopping-lists/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch shopping list')
      }
      const data = await response.json()
      setList(data)
    } catch (error) {
      console.error('Error fetching shopping list:', error)
    }
  }

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName.trim()) return

    try {
      const response = await fetch(`/api/shopping-lists/${id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItemName }),
      })
      if (!response.ok) {
        throw new Error('Failed to add item to shopping list')
      }
      const updatedList = await response.json()
      setList(updatedList)
      setNewItemName('')
    } catch (error) {
      console.error('Error adding item to shopping list:', error)
    }
  }

  const toggleItem = async (itemId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/shopping-lists/${id}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })
      if (!response.ok) {
        throw new Error('Failed to update item')
      }
      const updatedList = await response.json()
      setList(updatedList)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const deleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/shopping-lists/${id}/items/${itemId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete item')
      }
      const updatedList = await response.json()
      setList(updatedList)
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  if (!list) return <div>Načítání...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{list.name}</h2>
        <Link href="/" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Zpět na seznamy
          </Button>
        </Link>
      </div>
      <form onSubmit={addItem} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Název nové položky"
            className="flex-grow"
          />
          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" /> Přidat položku
          </Button>
        </div>
      </form>
      <ul className="space-y-2">
        {list.items.map((item) => (
          <li key={item._id} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
            <Checkbox
              checked={item.completed}
              onCheckedChange={(checked) => toggleItem(item._id, checked as boolean)}
              id={`item-${item._id}`}
            />
            <label
              htmlFor={`item-${item._id}`}
              className={`flex-grow ${item.completed ? 'line-through text-gray-500' : ''}`}
            >
              {item.name}
            </label>
            <Button variant="destructive" size="sm" onClick={() => deleteItem(item._id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

