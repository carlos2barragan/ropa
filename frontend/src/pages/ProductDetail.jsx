import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Package } from 'lucide-react';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, loading } = useCart();
  const [product, setProduct] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    productService.getOne(id).then(({ data }) => {
      setProduct(data);
      setSelectedSize(data.sizes?.[0] || '');
      setSelectedColor(data.colors?.[0] || '');
    }).catch(() => navigate('/products'))
      .finally(() => setPageLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) return navigate('/login');
    addToCart(product.id, quantity, selectedSize, selectedColor);
  };

  const formatted = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  if (pageLoading) return <Spinner size="lg" />;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft size={18} /> Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/500x600?text=Sin+imagen'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-indigo-600 font-medium text-sm mb-2">{product.Category?.name}</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-gray-900 mb-6">{formatted(product.price)}</p>

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          {product.colors?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Color: <span className="font-normal capitalize">{selectedColor}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-lg text-sm border-2 capitalize transition-all ${selectedColor === c ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Talla: <span className="font-normal">{selectedSize}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 rounded-lg text-sm border-2 font-medium transition-all ${selectedSize === s ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 text-gray-700 hover:border-indigo-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-3">Cantidad</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center font-bold hover:border-gray-400 transition-colors">-</button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center font-bold hover:border-gray-400 transition-colors">+</button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
            <Package size={16} />
            <span>{product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={loading || product.stock === 0}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            <ShoppingBag size={20} />
            {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}
