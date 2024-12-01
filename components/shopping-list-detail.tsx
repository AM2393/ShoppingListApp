"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus } from 'lucide-react'

interface ShoppingItem {
  _id: string
  name: string
  completed: boolean
}

interface ShoppingList {
  _id: string
  name: string
  items: ShoppingItem[]
  ownerId: string
}

interface ShoppingListDetailProps {
  listId: string
}

export function ShoppingListDetail({ listId }: ShoppingListDetailProps) {
  const [list, setList] = useState<ShoppingList | null>(null)
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
    // Simulace načtení dat ze serveru
    setList({
      _id: listId,
      name: "Týdenní nákup",
      items: [
        { _id: "1", name: "Mléko", completed: false },
        { _id: "2", name: "Chléb", completed: true },
        { _id: "3", name: "Jablka", completed: false },
      ],
      ownerId: "user1"
    })
  }, [listId])

  const addItem = () => {
    if (newItem.trim() && list) {
      const newItemObject: ShoppingItem = {
        _id: Date.now().toString(),
        name: newItem,
        completed: false
      }
      setList({...list, items: [...list.items, newItemObject]})
      setNewItem('')
    }
  }

  const removeItem = (itemId: string) => {
    if (list) {
      setList({...list, items: list.items.filter(item => item._id !== itemId)})
    }
  }

  const toggleItem = (itemId: string) => {
    if (list) {
      setList({
        ...list,
        items: list.items.map(item => 
          item._id === itemId ? {...item, completed: !item.completed} : item
        )
      })
    }
  }

  if (!list) return <div>Načítání...</div>

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-indigo-800">{list.name}</h2>
      <div className="mb-6 flex">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Přidat novou položku"
          className="mr-2 flex-grow"
        />
        <Button onClick={addItem} className="bg-indigo-500 hover:bg-indigo-600">
          <Plus className="h-4 w-4 mr-2" />
          Přidat
        </Button>
      </div>
      <ul className="space-y-3">
        {list.items.map((item) => (
          <li key={item._id} className="flex items-center justify-between p-3 bg-indigo-50 rounded-md shadow-sm">
            <div className="flex items-center">
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => toggleItem(item._id)}
                className="mr-3"
              />
              <span className={item.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                {item.name}
              </span>
            </div>
            <Button variant="ghost" onClick={() => removeItem(item._id)} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

