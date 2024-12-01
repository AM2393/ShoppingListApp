import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/lib/mongodb'
import ShoppingList from '@/models/ShoppingList'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  const { id } = req.query

  // Add product
  if (req.method === 'POST') {
    try {
      const { productName, userId } = req.body
      const list = await ShoppingList.findById(id)

      if (!list) {
        return res.status(404).json({ message: 'Shopping list not found' })
      }

      if (!list.members.includes(userId) && list.owner.toString() !== userId) {
        return res.status(403).json({ message: 'User is not authorized' })
      }

      list.items.push({ name: productName, completed: false })
      await list.save()
      res.status(200).json(list)
    } catch (error) {
      res.status(500).json({ message: 'Error adding product' })
    }
  }
  // Remove product
  else if (req.method === 'DELETE') {
    try {
      const { productId, userId } = req.body
      const list = await ShoppingList.findById(id)

      if (!list) {
        return res.status(404).json({ message: 'Shopping list not found' })
      }

      if (!list.members.includes(userId) && list.owner.toString() !== userId) {
        return res.status(403).json({ message: 'User is not authorized' })
      }

      list.items = list.items.filter(item => item._id.toString() !== productId)
      await list.save()
      res.status(200).json(list)
    } catch (error) {
      res.status(500).json({ message: 'Error removing product' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

