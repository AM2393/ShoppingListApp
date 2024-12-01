import { ShoppingListDetail } from '@/components/ShoppingListDetail'

export default function ListDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto p-4">
      <ShoppingListDetail id={params.id} />
    </main>
  )
}

