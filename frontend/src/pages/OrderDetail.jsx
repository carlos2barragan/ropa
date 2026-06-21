import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { orderService } from '../services/api';
import Spinner from '../components/ui/Spinner';

const statusColors = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
const statusLabels = { pending: 'Pendiente', processing: 'En proceso', shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado' };

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOne(id).then(({ data }) => setOrder(data)).finally(() => setLoading(false));
  }, [id]);

  const formatted = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  if (loading) return <Spinner />;
  if (!order) return <div className="text-center py-16 text-gray-400">Orden no encontrada</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors text-sm">
        <ArrowLeft size={16} /> Mis pedidos
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pedido #{order.id}</h1>
        <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Productos</h2>
        <div className="flex flex-col gap-4">
          {order.OrderItems?.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <img src={item.Product?.imageUrl} alt={item.Product?.name} className="w-16 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.Product?.name}</p>
                <p className="text-sm text-gray-500">Talla: {item.size} · Color: {item.color} · ×{item.quantity}</p>
                <p className="font-semibold text-gray-900 mt-1">{formatted(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-gray-400" />
            <h3 className="font-bold text-gray-900">Envío</h3>
          </div>
          <p className="text-gray-600 text-sm">{order.shippingAddress}</p>
          {order.notes && <p className="text-gray-400 text-xs mt-2">Nota: {order.notes}</p>}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Resumen</h3>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Fecha</span>
            <span>{new Date(order.createdAt).toLocaleDateString('es-CO')}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-100 pt-3 mt-3">
            <span>Total</span>
            <span>{formatted(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
