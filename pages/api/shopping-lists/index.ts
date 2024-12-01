import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/lib/mongodb'
import ShoppingList from '@/models/ShoppingList'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
    const { userId } = req.query
    const lists = await ShoppingList.find({
      $or: [
        { owner: userId },
        { members: userId }
      ]
    }).sort({ created_at: -1 })
    res.status(200).json(lists)
  } else if (req.method === 'POST') {
    const { name, ownerId } = req.body
    const newList = new ShoppingList({ 
      name, 
      owner: ownerId, 
      members: [ownerId],
      items: []
    })
    await newList.save()
    res.status(201).json(newList)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

