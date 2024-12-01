import React, { useState, useEffect } from 'react';

interface ShoppingListProps {
  listId: string;
}

interface Item {
  id: string;
  name: string;
  isChecked: boolean;
  quantity: number;
  unit: string;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ listId }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    // Zde by byla logika pro načtení položek seznamu z API
    // Pro demonstraci použijeme mock data
    setItems([
      { id: '1', name: 'Mléko', isChecked: false, quantity: 1, unit: 'l' },
      { id: '2', name: 'Chléb', isChecked: true, quantity: 1, unit: 'ks' },
    ]);
  }, [listId]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      const newItem: Item = {
        id: Date.now().toString(),
        name: newItemName,
        isChecked: false,
        quantity: 1,
        unit: 'ks',
      };
      setItems([...items, newItem]);
      setNewItemName('');
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="shopping-list">
      <h2>Nákupní seznam</h2>
      <form onSubmit={addItem}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Přidat novou položku"
        />
        <button type="submit">Přidat</button>
      </form>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={item.isChecked}
              onChange={() => toggleItem(item.id)}
            />
            <span className={item.isChecked ? 'checked' : ''}>{item.name}</span>
            <span>{item.quantity} {item.unit}</span>
            <button onClick={() => removeItem(item.id)}>Odstranit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;

