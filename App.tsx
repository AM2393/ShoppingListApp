import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ShoppingList from './components/ShoppingList';
import Sidebar from './components/Sidebar';
import './App.css';
import clientPromise from './lib/mongodb';
import { ShoppingList as ShoppingListModel } from './models/ShoppingList';
import ShoppingListsOverview from './components/shopping-lists-overview';
import { ShoppingListDetail } from './components/shopping-list-detail';

interface ShoppingItem {
  _id: string;
  name: string;
  completed: boolean;
}

interface ShoppingListData {
  _id: string;
  name: string;
  items: ShoppingItem[];
}

function App() {
  const [shoppingLists, setShoppingLists] = useState<ShoppingListData[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      await clientPromise; // Zajistí, že jsme připojeni k MongoDB
      const lists = await ShoppingListModel.find();
      setShoppingLists(lists);
      if (lists.length > 0) {
        setActiveListId(lists[0]._id);
      }
    };
    fetchLists();
  }, []);

  const addNewList = async (name: string) => {
    await clientPromise;
    const newList = new ShoppingListModel({ name, items: [] });
    await newList.save();
    setShoppingLists([...shoppingLists, newList]);
    setActiveListId(newList._id);
  };

  const activeList = shoppingLists.find(list => list._id === activeListId);

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/" component={ShoppingListsOverview} />
          <Route 
            path="/list/:id" 
            render={({ match }) => <ShoppingListDetail listId={match.params.id} />} 
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

