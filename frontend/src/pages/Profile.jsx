import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', address: user?.address || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(form);
      toast.success('Perfil actualizado');
    } catch {
      toast.error('Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <User size={28} className="text-indigo-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xl">{user?.name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium mt-1 inline-block capitalize">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Tu dirección de envío" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="300-000-0000" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>

      <Link to="/orders" className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-5 hover:border-indigo-200 transition-all">
        <Package size={20} className="text-indigo-600" />
        <span className="font-medium text-gray-900">Ver mis pedidos</span>
      </Link>
    </div>
  );
}
