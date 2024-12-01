import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface ShoppingList {
  _id: string;
  name: string;
  items: { _id: string; name: string; completed: boolean }[];
}

const ShoppingLists: React.FC = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch('/api/shopping-lists');
      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
    }
  };

  const createList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const response = await fetch('/api/shopping-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newListName }),
      });
      const newList = await response.json();
      setLists([...lists, newList]);
      setNewListName('');
    } catch (error) {
      console.error('Error creating shopping list:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Shopping Lists</h2>
      <form onSubmit={createList} className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Enter new list name"
            className="flex-grow"
          />
          <Button type="submit">Create List</Button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map((list) => (
          <Card key={list._id}>
            <CardHeader>
              <CardTitle>{list.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Items: {list.items.length}</p>
              <Link to={`/list/${list._id}`}>
                <Button variant="outline" className="mt-2">View List</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShoppingLists;

