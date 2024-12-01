import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface ShoppingItem {
  _id: string;
  name: string;
  completed: boolean;
}

interface ShoppingList {
  _id: string;
  name: string;
  items: ShoppingItem[];
}

const ShoppingListDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    fetchList();
  }, [id]);

  const fetchList = async () => {
    try {
      const response = await fetch(`/api/shopping-lists/${id}`);
      const data = await response.json();
      setList(data);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      const response = await fetch(`/api/shopping-lists/${id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItemName }),
      });
      const updatedList = await response.json();
      setList(updatedList);
      setNewItemName('');
    } catch (error) {
      console.error('Error adding item to shopping list:', error);
    }
  };

  const toggleItem = async (itemId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/shopping-lists/${id}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      const updatedList = await response.json();
      setList(updatedList);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/shopping-lists/${id}/items/${itemId}`, {
        method: 'DELETE',
      });
      const updatedList = await response.json();
      setList(updatedList);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (!list) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{list.name}</h2>
      <Link to="/">
        <Button variant="outline" className="mb-4">Back to Lists</Button>
      </Link>
      <form onSubmit={addItem} className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Enter new item name"
            className="flex-grow"
          />
          <Button type="submit">Add Item</Button>
        </div>
      </form>
      <ul className="space-y-2">
        {list.items.map((item) => (
          <li key={item._id} className="flex items-center gap-2">
            <Checkbox
              checked={item.completed}
              onCheckedChange={(checked) => toggleItem(item._id, checked as boolean)}
            />
            <span className={item.completed ? 'line-through' : ''}>{item.name}</span>
            <Button variant="destructive" size="sm" onClick={() => deleteItem(item._id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingListDetail;

