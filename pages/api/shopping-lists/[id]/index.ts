import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/lib/mongodb'
import ShoppingList from '@/models/ShoppingList'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  const { id } = req.query

  // Delete shopping list
  if (req.method === 'DELETE') {
    try {
      const { userId } = req.body
      const list = await ShoppingList.findById(id)

      if (!list) {
        return res.status(404).json({ message: 'Shopping list not found' })
      }

      if (list.owner.toString() !== userId) {
        return res.status(403).json({ message: 'Only owner can delete the list' })
      }

      await ShoppingList.findByIdAndDelete(id)
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ message: 'Error deleting shopping list' })
    }
  }
  // Get shopping list detail
  else if (req.method === 'GET') {
    try {
      const list = await ShoppingList.findById(id)
      if (!list) {
        return res.status(404).json({ message: 'Shopping list not found' })
      }
      res.status(200).json(list)
    } catch (error) {
      res.status(500).json({ message: 'Error fetching shopping list' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

