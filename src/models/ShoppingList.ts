import mongoose from 'mongoose';

// Schéma pro položku v seznamu
const ItemSchema = new mongoose.Schema({
  name: String,
  completed: Boolean
});

// Schéma pro celý nákupní seznam
const ShoppingListSchema = new mongoose.Schema({
  name: String,
  items: [ItemSchema]
});

// Vytvoření modelu
const ShoppingList = mongoose.models.ShoppingList || mongoose.model('ShoppingList', ShoppingListSchema);

export default ShoppingList;

