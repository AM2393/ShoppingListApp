import React, { useState } from 'react';

interface CreateListFormProps {
  onSubmit: (newList: { id: string; name: string }) => void;
  onCancel: () => void;
}

const CreateListForm: React.FC<CreateListFormProps> = ({ onSubmit, onCancel }) => {
  const [listName, setListName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (listName.trim()) {
      onSubmit({ id: Date.now().toString(), name: listName });
      setListName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-list-form">
      <input
        type="text"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        placeholder="Název nového seznamu"
        required
      />
      <button type="submit">Vytvořit</button>
      <button type="button" onClick={onCancel}>Zrušit</button>
    </form>
  );
};

export default CreateListForm;

