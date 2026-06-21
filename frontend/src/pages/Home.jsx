import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/ui/Spinner';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getAll({ limit: 8 }),
      categoryService.getAll(),
    ]).then(([pRes, cRes]) => {
      setFeatured(pRes.data.products);
      setCategories(cRes.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gray-900 text-white min-h-[70vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400"
            alt="Hero"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <p className="text-indigo-400 font-medium mb-4 tracking-widest text-sm uppercase">Nueva Colección 2026</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Viste con<br />
            <span className="text-indigo-400">estilo propio</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-md">
            Descubre nuestra colección de ropa diseñada para cada momento de tu vida.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-indigo-500 transition-colors text-lg"
          >
            Ver Colección <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.name}`}
              className="group bg-gray-50 rounded-xl p-6 text-center hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-all"
            >
              <p className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Destacados</h2>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Envío gratis en compras +$150.000</h2>
          <p className="text-indigo-200 mb-8">A todo el país. Entrega en 3-5 días hábiles.</p>
          <Link to="/products" className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block">
            Comprar ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
