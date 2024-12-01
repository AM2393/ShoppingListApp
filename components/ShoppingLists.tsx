"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Plus } from 'lucide-react'

interface ShoppingList {
  _id: string
  name: string
  items: { _id: string; name: string; completed: boolean }[]
}

export default function ShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [newListName, setNewListName] = useState('')

  useEffect(() => {
    fetchLists()
  }, [])

  const fetchLists = async () => {
    try {
      const response = await fetch('/api/shopping-lists')
      if (!response.ok) {
        throw new Error('Failed to fetch shopping lists')
      }
      const data = await response.json()
      setLists(data)
    } catch (error) {
      console.error('Error fetching shopping lists:', error)
    }
  }

  const createList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim()) return

    try {
      const response = await fetch('/api/shopping-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName }),
      })
      if (!response.ok) {
        throw new Error('Failed to create shopping list')
      }
      const newList = await response.json()
      setLists([...lists, newList])
      setNewListName('')
    } catch (error) {
      console.error('Error creating shopping list:', error)
    }
  }

  return (
    <div>
      <form onSubmit={createList} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Název nového seznamu"
            className="flex-grow"
          />
          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" /> Vytvořit seznam
          </Button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map((list) => (
          <Card key={list._id}>
            <CardHeader>
              <CardTitle>{list.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Počet položek: {list.items.length}</p>
              <Link href={`/list/${list._id}`} passHref>
                <Button variant="outline" className="mt-2">Zobrazit seznam</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

