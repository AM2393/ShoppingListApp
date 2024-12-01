import React from 'react';

interface SidebarProps {
  showArchived: boolean;
  setShowArchived: (show: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ showArchived, setShowArchived }) => {
  return (
    <aside className="sidebar">
      <button className="create-list-btn">+ Vytvořit</button>
      <nav>
        <ul>
          <li>Aktivní seznamy</li>
          <li onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? 'Skrýt archivované' : 'Zobrazit archivované'}
          </li>
          <li>Přidat uživatele</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

