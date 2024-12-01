import React, { useState } from 'react';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
}

interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
}

const TestShoppingList: React.FC = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [currentList, setCurrentList] = useState<ShoppingList | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newItemName, setNewItemName] = useState('');

  const createNewList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      const newList: ShoppingList = {
        id: Date.now().toString(),
        name: newListName,
        items: []
      };
      setLists([...lists, newList]);
      setCurrentList(newList);
      setNewListName('');
    }
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentList && newItemName.trim()) {
      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        name: newItemName,
        completed: false
      };
      const updatedList = {
        ...currentList,
        items: [...currentList.items, newItem]
      };
      setCurrentList(updatedList);
      setLists(lists.map(list => list.id === updatedList.id ? updatedList : list));
      setNewItemName('');
    }
  };

  const toggleItem = (itemId: string) => {
    if (currentList) {
      const updatedItems = currentList.items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      const updatedList = { ...currentList, items: updatedItems };
      setCurrentList(updatedList);
      setLists(lists.map(list => list.id === updatedList.id ? updatedList : list));
    }
  };

  const deleteItem = (itemId: string) => {
    if (currentList) {
      const updatedItems = currentList.items.filter(item => item.id !== itemId);
      const updatedList = { ...currentList, items: updatedItems };
      setCurrentList(updatedList);
      setLists(lists.map(list => list.id === updatedList.id ? updatedList : list));
    }
  };

  return (
    <div className="test-shopping-list">
      <h1>Test nákupního seznamu</h1>
      
      <form onSubmit={createNewList}>
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Název nového seznamu"
        />
        <button type="submit">Vytvořit seznam</button>
      </form>

      {currentList && (
        <div>
          <h2>{currentList.name}</h2>
          <form onSubmit={addItem}>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Název nové položky"
            />
            <button type="submit">Přidat položku</button>
          </form>
          <ul>
            {currentList.items.map(item => (
              <li key={item.id}>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                />
                <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                  {item.name}
                </span>
                <button onClick={() => deleteItem(item.id)}>Smazat</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3>Všechny seznamy:</h3>
        <ul>
          {lists.map(list => (
            <li key={list.id} onClick={() => setCurrentList(list)}>
              {list.name} ({list.items.length} položek)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestShoppingList;

