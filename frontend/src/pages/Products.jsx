import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/ui/Spinner';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const gender = searchParams.get('gender') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    categoryService.getAll().then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    productService.getAll({ page: currentPage, search, gender, category, minPrice, maxPrice })
      .then(({ data }) => { setProducts(data.products); setTotal(data.total); setPages(data.pages); })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500 text-sm mt-1">{total} resultados</p>
        </div>
        <button onClick={() => setFiltersOpen(!filtersOpen)} className="md:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm">
          <SlidersHorizontal size={16} /> Filtros
        </button>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filtros</h3>
              <button onClick={clearFilters} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                <X size={12} /> Limpiar
              </button>
            </div>

            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 block mb-2">Buscar</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nombre..."
                  value={search}
                  onChange={(e) => setParam('search', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 block mb-2">Género</label>
              {['', 'men', 'women', 'unisex', 'kids'].map((g) => (
                <label key={g} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input type="radio" name="gender" checked={gender === g} onChange={() => setParam('gender', g)} className="text-indigo-600" />
                  <span className="text-sm text-gray-600 capitalize">{g || 'Todos'}</span>
                </label>
              ))}
            </div>

            <div className="mb-5">
              <label className="text-sm font-medium text-gray-700 block mb-2">Categoría</label>
              <select value={category} onChange={(e) => setParam('category', e.target.value)} className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Todas</option>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Precio</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setParam('minPrice', e.target.value)} className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setParam('maxPrice', e.target.value)} className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No se encontraron productos</p>
              <button onClick={clearFilters} className="mt-4 text-indigo-600 hover:underline text-sm">Limpiar filtros</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: p })}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === currentPage ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-400'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
