import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    addToCart(product.id, 1, product.sizes?.[0], product.colors?.[0]);
  };

  const formatted = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price);

  return (
    <Link to={`/products/${product.id}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300x400?text=Sin+imagen'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/70 px-3 py-1 rounded">Sin stock</span>
          </div>
        )}
        <button
          onClick={handleAddToCart}
          disabled={loading || product.stock === 0}
          className="absolute bottom-3 right-3 bg-white text-gray-900 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600 hover:text-white disabled:opacity-50"
        >
          <ShoppingBag size={18} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{product.Category?.name}</p>
        <h3 className="font-medium text-gray-900 text-sm mb-2 truncate">{product.name}</h3>
        <p className="font-bold text-gray-900">{formatted}</p>
        {product.colors?.length > 0 && (
          <div className="flex gap-1 mt-2">
            {product.colors.slice(0, 4).map((c) => (
              <span key={c} className="text-xs text-gray-400">{c}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
