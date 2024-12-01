import React, { useState } from 'react';
import ShoppingList from './ShoppingList';
import CreateListForm from './CreateListForm';

interface ShoppingListWrapperProps {
  showArchived: boolean;
}

const ShoppingListWrapper: React.FC<ShoppingListWrapperProps> = ({ showArchived }) => {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateList = (newList) => {
    setLists([...lists, newList]);
    setActiveListId(newList.id);
    setShowCreateForm(false);
  };

  return (
    <div className="shopping-list-wrapper">
      {showCreateForm ? (
        <CreateListForm onSubmit={handleCreateList} onCancel={() => setShowCreateForm(false)} />
      ) : (
        <>
          <button onClick={() => setShowCreateForm(true)}>+ Vytvořit nový seznam</button>
          {activeListId ? (
            <ShoppingList listId={activeListId} />
          ) : (
            <p>Vyberte nebo vytvořte nákupní seznam</p>
          )}
        </>
      )}
    </div>
  );
};

export default ShoppingListWrapper;

