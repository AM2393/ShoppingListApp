import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingList as ShoppingListModel } from '../models/ShoppingList';
import clientPromise from '../lib/mongodb';

interface ShoppingListProps {
  list: {
    _id: string;
    name: string;
    items: { _id: string; name: string; completed: boolean }[];
  };
}

const ShoppingList: React.FC<ShoppingListProps> = ({ list }) => {
  const [items, setItems] = useState(list.items);
  const [newItemName, setNewItemName] = useState('');

  const updateDatabase = async (updatedItems: typeof items) => {
    await clientPromise;
    await ShoppingListModel.findByIdAndUpdate(list._id, { items: updatedItems });
  };

  const toggleItem = async (id: string) => {
    const updatedItems = items.map(item =>
      item._id === id ? { ...item, completed: !item.completed } : item
    );
    setItems(updatedItems);
    await updateDatabase(updatedItems);
  };

  const deleteItem = async (id: string) => {
    const updatedItems = items.filter(item => item._id !== id);
    setItems(updatedItems);
    await updateDatabase(updatedItems);
  };

  const addItem = async () => {
    if (newItemName.trim()) {
      await clientPromise;
      const updatedList = await ShoppingListModel.findByIdAndUpdate(
        list._id,
        { $push: { items: { name: newItemName, completed: false } } },
        { new: true }
      );
      setItems(updatedList.items);
      setNewItemName('');
    }
  };

  return (
    <div className="shopping-list">
      <h2>{list.name}</h2>
      <div className="items">
        {items.map(item => (
          <div key={item._id} className="item">
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => toggleItem(item._id)}
            />
            <span className={item.completed ? 'completed' : ''}>{item.name}</span>
            <Button variant="ghost" size="icon" onClick={() => deleteItem(item._id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="add-item">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Nová položka"
        />
        <Button onClick={addItem}>
          <Plus className="w-4 h-4 mr-2" />
          Přidat položku
        </Button>
      </div>
    </div>
  );
};

export default ShoppingList;

