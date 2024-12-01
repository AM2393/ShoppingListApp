import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/lib/mongodb'
import ShoppingList from '@/models/ShoppingList'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await connectToDatabase()
    const { id } = req.query
    const { userId, ownerId } = req.body

    const list = await ShoppingList.findById(id)
    
    if (!list) {
      return res.status(404).json({ message: 'Shopping list not found' })
    }

    if (list.owner.toString() !== ownerId) {
      return res.status(403).json({ message: 'Only owner can remove users' })
    }

    if (!list.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not a member' })
    }

    list.members = list.members.filter(memberId => memberId.toString() !== userId)
    await list.save()

    res.status(200).json(list)
  } catch (error) {
    res.status(500).json({ message: 'Error removing user' })
  }
}

