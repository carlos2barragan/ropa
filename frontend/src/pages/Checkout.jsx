import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { orderService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, total, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shippingAddress: user?.address || '',
    notes: '',
  });

  const formatted = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shippingAddress.trim()) return toast.error('Ingresa una dirección de envío');
    setLoading(true);
    try {
      const { data } = await orderService.create(form);
      await fetchCart();
      toast.success('Orden creada exitosamente');
      navigate(`/orders/${data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear orden');
    } finally {
      setLoading(false);
    }
  };

  const items = cart?.CartItems || [];
  if (items.length === 0) return navigate('/cart');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Información de Envío</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" value={user?.name} readOnly className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de envío *</label>
              <textarea
                rows={3}
                required
                value={form.shippingAddress}
                onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                placeholder="Calle, número, barrio, ciudad..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Instrucciones especiales..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50 text-lg"
          >
            <CheckCircle size={20} />
            {loading ? 'Procesando...' : 'Confirmar Pedido'}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Tu Pedido</h2>
          <div className="flex flex-col gap-3 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <img src={item.Product?.imageUrl} alt={item.Product?.name} className="w-14 h-16 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{item.Product?.name}</p>
                  <p className="text-xs text-gray-500">{item.size} · {item.color} · ×{item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{formatted(item.Product?.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Subtotal</span><span>{formatted(total)}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Envío</span><span className={total >= 150000 ? 'text-green-600' : ''}>{total >= 150000 ? 'Gratis' : formatted(15000)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-100">
              <span>Total</span><span>{formatted(total >= 150000 ? total : total + 15000)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
