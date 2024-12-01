import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  name: String,
  completed: Boolean
});

const ShoppingListSchema = new mongoose.Schema({
  name: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  items: [ItemSchema],
  created_at: { type: Date, default: Date.now }
});

// Složený index pro efektivní vyhledávání a řazení
ShoppingListSchema.index({ owner: 1, members: 1, created_at: -1 });

const ShoppingList = mongoose.models.ShoppingList || mongoose.model('ShoppingList', ShoppingListSchema);

export default ShoppingList;

