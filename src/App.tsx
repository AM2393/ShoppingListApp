import React, { useState } from 'react';
import './App.css';
import MembersList from './components/MembersList';

function App() {
  const [members] = useState([
    { id: '1', name: 'John', color: 'bg-red-500' },
    { id: '2', name: 'Emily', color: 'bg-blue-500' },
    { id: '3', name: 'David', color: 'bg-green-500' },
    { id: '4', name: 'Sarah', color: 'bg-purple-500' },
  ]);

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim() !== '') {
      setItems([...items, newItem]);
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="App bg-[#7FFFD4]/20 min-h-screen p-4">
      <div className="max-w-4xl mx-auto grid grid-cols-[250px,1fr] gap-4">
        <MembersList members={members} />
        <div>
          <h1 className="text-2xl font-bold mb-4">Můj nákupní seznam</h1>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="mb-4">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="border p-2 mr-2"
                placeholder="Nová položka"
              />
              <button
                onClick={addItem}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Přidat
              </button>
            </div>
            <ul>
              {items.map((item, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded">
                  <span>{item}</span>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500"
                  >
                    Odstranit
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

