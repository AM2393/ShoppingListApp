import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/lib/mongodb'
import ShoppingList from '@/models/ShoppingList'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await connectToDatabase()
    const { userId } = req.query

    const lists = await ShoppingList.find({
      $or: [
        { owner: userId },
        { members: userId }
      ]
    }).sort({ created_at: -1 })

    res.status(200).json(lists)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shopping lists' })
  }
}

