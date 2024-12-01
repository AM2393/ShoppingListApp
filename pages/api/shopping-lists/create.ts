import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/lib/mongodb'
import ShoppingList from '@/models/ShoppingList'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await connectToDatabase()
    const { name, ownerId } = req.body

    if (!name || !ownerId) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const newList = new ShoppingList({
      name,
      owner: ownerId,
      members: [ownerId],
      items: [],
      created_at: new Date()
    })

    await newList.save()
    res.status(201).json(newList)
  } catch (error) {
    res.status(500).json({ message: 'Error creating shopping list' })
  }
}

