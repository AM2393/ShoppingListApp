import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

// Definice props pro Sidebar komponentu
interface SidebarProps {
  lists: { id: number; name: string }[];
  activeListId: number;
  onSelectList: (id: number) => void;
  onAddNewList: (name: string) => void;
}

// Komponenta postranního panelu
const Sidebar: React.FC<SidebarProps> = ({ lists, activeListId, onSelectList, onAddNewList }) => {
  const [newListName, setNewListName] = useState('');

  // Funkce pro vytvoření nového seznamu
  const handleCreateNewList = () => {
    if (newListName.trim()) {
      onAddNewList(newListName);
      setNewListName('');
    }
  };

  return (
    <div className="sidebar">
      <h2>Mé seznamy</h2>
      <ul>
        {lists.map(list => (
          <li 
            key={list.id} 
            className={activeListId === list.id ? 'active' : ''}
            onClick={() => onSelectList(list.id)}
          >
            {list.name}
          </li>
        ))}
      </ul>
      <input 
        type="text" 
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        placeholder="Název nového seznamu"
      />
      <Button onClick={handleCreateNewList}>+ Vytvořit</Button>
    </div>
  );
};

export default Sidebar;

