"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecycleIcon, Star, UserPlus, Home, Plus, Trash2 } from 'lucide-react'
import CreateListDialog from "./create-list-dialog"
import DeleteListDialog from "./delete-list-dialog"
import { Switch } from "@/components/ui/switch"

interface ShoppingList {
  id: string
  name: string
  itemCount: number
  archived: boolean
  ownerId: string
}

export default function ShoppingListsOverview() {
  const [lists, setLists] = useState<ShoppingList[]>([
    { id: "1", name: "Týdenní nákup", itemCount: 5, archived: false, ownerId: "user1" },
    { id: "2", name: "Párty", itemCount: 8, archived: false, ownerId: "user2" },
    { id: "3", name: "Kancelářské potřeby", itemCount: 3, archived: true, ownerId: "user1" },
  ])
  const [listToDelete, setListToDelete] = useState<ShoppingList | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const currentUserId = "user1" // Simulace přihlášeného uživatele

  const handleCreateList = (name: string) => {
    const newList: ShoppingList = { 
      id: Date.now().toString(), 
      name, 
      itemCount: 0, 
      archived: false, 
      ownerId: currentUserId 
    }
    setLists([...lists, newList])
  }

  const handleDeleteList = (list: ShoppingList) => {
    if (list.ownerId === currentUserId) {
      setListToDelete(list)
    } else {
      alert("Nemáte oprávnění smazat tento seznam.")
    }
  }

  const confirmDelete = () => {
    if (listToDelete) {
      setLists(lists.filter(list => list.id !== listToDelete.id))
      setListToDelete(null)
    }
  }

  const filteredLists = showArchived ? lists : lists.filter(list => !list.archived)

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto grid grid-cols-[250px,1fr] min-h-screen">
        {/* Sidebar */}
        <div className="p-6 border-r bg-white shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-700">Moje seznamy</h2>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-indigo-50"
              onClick={() => setShowArchived(!showArchived)}
            >
              <RecycleIcon className="mr-2 h-4 w-4" />
              {showArchived ? "Skrýt archivované" : "Zobrazit archivované"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-indigo-50"
            >
              <Star className="mr-2 h-4 w-4" />
              Aktivní seznamy
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-indigo-50"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Přidat uživatele
            </Button>
          </div>
          <Button className="mt-4 w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-600">
            <Home className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-indigo-800">Nákupní seznamy</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLists.map((list) => (
              <Card key={list.id} className={`bg-white border-2 border-indigo-100 ${list.archived ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-indigo-700">{list.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Počet položek: {list.itemCount}</p>
                  <p className="text-sm text-gray-500">{list.archived ? 'Archivováno' : 'Aktivní'}</p>
                  <div className="flex justify-between mt-4">
                    <Link href={`/shopping-lists/${list.id}`}>
                      <Button variant="outline" className="hover:bg-indigo-50">Zobrazit detail</Button>
                    </Link>
                    {list.ownerId === currentUserId && (
                      <Button variant="destructive" onClick={() => handleDeleteList(list)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <CreateListDialog onCreateList={handleCreateList} />
          <DeleteListDialog
            list={listToDelete}
            onConfirm={confirmDelete}
            onCancel={() => setListToDelete(null)}
          />
        </div>
      </div>
    </div>
  )
}

