import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, total, updateItem, removeItem, clearCart } = useCart();
  const { user } = useAuth();

  const formatted = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito espera</h2>
        <p className="text-gray-500 mb-8">Inicia sesión para ver tu carrito.</p>
        <Link to="/login" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors">Ingresar</Link>
      </div>
    );
  }

  const items = cart?.CartItems || [];

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-8">Agrega productos para comenzar.</p>
        <Link to="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors">Ver productos</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Carrito</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
          <Trash2 size={14} /> Vaciar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 items-center">
              <img
                src={item.Product?.imageUrl || 'https://via.placeholder.com/100x120?text=Img'}
                alt={item.Product?.name}
                className="w-20 h-24 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.Product?.name}</h3>
                <div className="flex gap-3 text-sm text-gray-500 mt-1">
                  {item.size && <span>Talla: {item.size}</span>}
                  {item.color && <span>Color: {item.color}</span>}
                </div>
                <p className="font-bold text-gray-900 mt-2">{formatted(item.Product?.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors font-bold">-</button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button onClick={() => updateItem(item.id, item.quantity + 1)} className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors font-bold">+</button>
              </div>
              <button onClick={() => removeItem(item.id)} className="p-2 text-red-400 hover:text-red-600 transition-colors ml-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-fit sticky top-20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen</h2>
          <div className="flex justify-between text-gray-600 mb-3">
            <span>Subtotal</span>
            <span>{formatted(total)}</span>
          </div>
          <div className="flex justify-between text-gray-600 mb-4">
            <span>Envío</span>
            <span className={total >= 150000 ? 'text-green-600 font-medium' : ''}>{total >= 150000 ? 'Gratis' : formatted(15000)}</span>
          </div>
          {total < 150000 && (
            <p className="text-xs text-gray-400 mb-4">Agrega {formatted(150000 - total)} más para envío gratis</p>
          )}
          <div className="border-t border-gray-100 pt-4 mb-6">
            <div className="flex justify-between font-bold text-gray-900 text-lg">
              <span>Total</span>
              <span>{formatted(total >= 150000 ? total : total + 15000)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            Finalizar compra <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
