import ShoppingLists from '../components/ShoppingLists'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nákupní seznamy</h1>
      <ShoppingLists />
    </main>
  )
}

