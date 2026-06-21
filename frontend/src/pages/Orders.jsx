import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { orderService } from '../services/api';
import Spinner from '../components/ui/Spinner';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels = {
  pending: 'Pendiente',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders().then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  const formatted = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Package size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No tienes pedidos aún</p>
          <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:underline text-sm">Ir a comprar</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-indigo-200 hover:shadow-sm transition-all flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-bold text-gray-900">Pedido #{order.id}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-sm text-gray-500 mt-1">{order.OrderItems?.length} producto(s)</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatted(order.total)}</p>
                <ChevronRight size={20} className="text-gray-400 ml-auto mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
