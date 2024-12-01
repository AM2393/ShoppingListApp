import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/lib/mongodb'
import { ShoppingList } from '@/models/ShoppingList'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  const { id } = req.query

  if (req.method === 'POST' && req.query.action === 'invite') {
    // Invite user to shopping list
    const { userId } = req.body
    const list = await ShoppingList.findByIdAndUpdate(id, { $addToSet: { members: userId } }, { new: true })
    res.status(200).json(list)
  } else if (req.method === 'POST' && req.query.action === 'addProduct') {
    // Add product to shopping list
    const { productName } = req.body
    const list = await ShoppingList.findByIdAndUpdate(id, { $push: { items: { name: productName, completed: false } } }, { new: true })
    res.status(200).json(list)
  } else if (req.method === 'DELETE' && req.query.action === 'removeProduct') {
    // Remove product from shopping list
    const { productId } = req.body
    const list = await ShoppingList.findByIdAndUpdate(id, { $pull: { items: { _id: productId } } }, { new: true })
    res.status(200).json(list)
  } else if (req.method === 'DELETE' && req.query.action === 'removeUser') {
    // Remove user from shopping list
    const { userId } = req.body
    const list = await ShoppingList.findByIdAndUpdate(id, { $pull: { members: userId } }, { new: true })
    res.status(200).json(list)
  } else if (req.method === 'DELETE') {
    // Delete entire shopping list
    await ShoppingList.findByIdAndDelete(id)
    res.status(204).end()
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

