import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping-list-app';

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define schemas
const ItemSchema = new mongoose.Schema({
  name: String,
  completed: Boolean
});

const ShoppingListSchema = new mongoose.Schema({
  name: String,
  items: [ItemSchema],
  created_at: { type: Date, default: Date.now }
});

// Define models
const ShoppingList = mongoose.model('ShoppingList', ShoppingListSchema);

// Routes

// Get all shopping lists
app.get('/api/shopping-lists', async (req, res) => {
  try {
    const lists = await ShoppingList.find().sort({ created_at: -1 });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shopping lists' });
  }
});

// Create a new shopping list
app.post('/api/shopping-lists', async (req, res) => {
  try {
    const { name } = req.body;
    const newList = new ShoppingList({ name, items: [] });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ message: 'Error creating shopping list' });
  }
});

// Get a specific shopping list
app.get('/api/shopping-lists/:id', async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shopping list' });
  }
});

// Add an item to a shopping list
app.post('/api/shopping-lists/:id/items', async (req, res) => {
  try {
    const { name } = req.body;
    const list = await ShoppingList.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }
    list.items.push({ name, completed: false });
    await list.save();
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to shopping list' });
  }
});

// Update an item in a shopping list
app.put('/api/shopping-lists/:listId/items/:itemId', async (req, res) => {
  try {
    const { completed } = req.body;
    const list = await ShoppingList.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }
    const item = list.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    item.completed = completed;
    await list.save();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item in shopping list' });
  }
});

// Delete an item from a shopping list
app.delete('/api/shopping-lists/:listId/items/:itemId', async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }
    list.items.id(req.params.itemId).remove();
    await list.save();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item from shopping list' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Test the server
console.log('Testing the server...');

// Function to test API endpoints
async function testAPI() {
  try {
    // Create a new shopping list
    const createListResponse = await fetch(`http://localhost:${PORT}/api/shopping-lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Shopping List' })
    });
    const newList = await createListResponse.json();
    console.log('Created new shopping list:', newList);

    // Add an item to the shopping list
    const addItemResponse = await fetch(`http://localhost:${PORT}/api/shopping-lists/${newList._id}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Item' })
    });
    const updatedList = await addItemResponse.json();
    console.log('Added item to shopping list:', updatedList);

    // Get all shopping lists
    const getListsResponse = await fetch(`http://localhost:${PORT}/api/shopping-lists`);
    const allLists = await getListsResponse.json();
    console.log('All shopping lists:', allLists);

  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the test after a short delay to ensure the server is up
setTimeout(testAPI, 1000);