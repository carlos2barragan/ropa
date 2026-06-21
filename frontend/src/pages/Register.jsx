import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Cuenta creada exitosamente');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        required={['name', 'email', 'password'].includes(key)}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Crear Cuenta</h1>
          <p className="text-gray-500 mt-2 text-sm">Únete a StyleCo y empieza a comprar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {field('name', 'Nombre completo *', 'text', 'Tu nombre')}
          {field('email', 'Email *', 'email', 'tu@email.com')}
          {field('password', 'Contraseña *', 'password', 'Mínimo 6 caracteres')}
          {field('address', 'Dirección (opcional)', 'text', 'Calle, ciudad...')}
          {field('phone', 'Teléfono (opcional)', 'tel', '300-000-0000')}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
