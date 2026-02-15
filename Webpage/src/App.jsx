import { useState } from 'react';

// You can easily add or remove items here to test your layout
const MOCK_DATA = [
  {
    id: 1,
    title: "Truffle Mushroom Risotto",
    category: "Italian",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800",
    description: "A creamy, earthy Italian classic featuring arborio rice, fresh porcini mushrooms, and a hint of white truffle oil.",
    time: "45 mins"
  },
  {
    id: 2,
    title: "Spicy Ahi Poke Bowl",
    category: "Hawaiian",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
    description: "Fresh tuna cubes marinated in sriracha mayo, served over warm jasmine rice with avocado and pickled ginger.",
    time: "20 mins"
  },
  {
    id: 3,
    title: "Honey Garlic Glazed Salmon",
    category: "Seafood",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800",
    description: "Pan-seared salmon fillets finished with a sticky honey garlic reduction and steamed asparagus.",
    time: "25 mins"
  }
];

function App() {
  const [recipes] = useState(MOCK_DATA);

  return (
    <div className="min-h-screen bg-stone-50 p-8 text-stone-900">
      <header className="max-w-6xl mx-auto flex justify-between items-end mb-12 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-4xl font-serif font-bold italic">The Kitchen Draft</h1>
          <p className="text-stone-500">Curating flavors, one prototype at a time.</p>
        </div>
        <nav className="flex gap-6 font-medium">
          <a href="#" className="hover:text-orange-600">Browse</a>
          <a href="#" className="hover:text-orange-600">Submit</a>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {recipes.map(recipe => (
            <article key={recipe.id} className="group cursor-pointer">
              <div className="overflow-hidden rounded-sm mb-4">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
                  {recipe.category}
                </span>
                <span className="text-xs text-stone-400">{recipe.time}</span>
              </div>
              <h2 className="text-2xl font-serif mb-3 group-hover:text-orange-700 transition-colors">
                {recipe.title}
              </h2>
              <p className="text-stone-600 leading-relaxed text-sm">
                {recipe.description}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;