import mongoose from 'mongoose';

// Toto je adresa naší MongoDB databáze
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping-list';

// Toto je funkce, která se připojí k databázi
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Úspěšně připojeno k MongoDB!');
  } catch (error) {
    console.error('Chyba při připojování k MongoDB:', error);
  }
}

export default connectToDatabase;

