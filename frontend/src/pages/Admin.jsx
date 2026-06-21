import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingCart, DollarSign, Plus, Edit2, Eye } from 'lucide-react';
import { adminService, productService, orderService, categoryService } from '../services/api';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

const statusColors = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
const statusLabels = { pending: 'Pendiente', processing: 'En proceso', shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado' };

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '', imageUrl: '', gender: 'unisex', CategoryId: '', sizes: '', colors: '' });

  const formatted = (price) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  useEffect(() => {
    Promise.all([
      adminService.getStats(),
      orderService.getAll(),
      productService.getAll({ limit: 50 }),
      categoryService.getAll(),
    ]).then(([s, o, p, c]) => {
      setStats(s.data);
      setOrders(o.data);
      setProducts(p.data.products);
      setCategories(c.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      sizes: productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: productForm.colors.split(',').map((c) => c.trim()).filter(Boolean),
    };
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, payload);
        toast.success('Producto actualizado');
      } else {
        await productService.create(payload);
        toast.success('Producto creado');
      }
      const { data } = await productService.getAll({ limit: 50 });
      setProducts(data.products);
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', stock: '', imageUrl: '', gender: 'unisex', CategoryId: '', sizes: '', colors: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name, description: product.description || '', price: product.price, stock: product.stock,
      imageUrl: product.imageUrl || '', gender: product.gender, CategoryId: product.CategoryId || '',
      sizes: product.sizes?.join(', ') || '', colors: product.colors?.join(', ') || '',
    });
    setShowProductForm(true);
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      setOrders(orders.map((o) => o.id === orderId ? { ...o, status } : o));
      toast.success('Estado actualizado');
    } catch {
      toast.error('Error al actualizar');
    }
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
        {['dashboard', 'products', 'orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab === 'dashboard' ? 'Resumen' : tab === 'products' ? 'Productos' : 'Pedidos'}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && stats && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Clientes', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
              { label: 'Productos', value: stats.totalProducts, icon: Package, color: 'bg-green-50 text-green-600' },
              { label: 'Pedidos', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-purple-50 text-purple-600' },
              { label: 'Ingresos', value: formatted(stats.totalRevenue), icon: DollarSign, color: 'bg-indigo-50 text-indigo-600' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Pedidos Recientes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Cliente</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50">
                      <td className="py-3 font-medium">#{order.id}</td>
                      <td className="py-3 text-gray-600">{order.User?.name}</td>
                      <td className="py-3 font-semibold">{formatted(order.total)}</td>
                      <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>{statusLabels[order.status]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-500 text-sm">{products.length} productos</p>
            <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: '', stock: '', imageUrl: '', gender: 'unisex', CategoryId: '', sizes: '', colors: '' }); setShowProductForm(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors">
              <Plus size={16} /> Nuevo Producto
            </button>
          </div>

          {showProductForm && (
            <div className="bg-white rounded-xl border border-indigo-100 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-5">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[['name', 'Nombre *'], ['description', 'Descripción'], ['price', 'Precio *', 'number'], ['stock', 'Stock *', 'number'], ['imageUrl', 'URL Imagen']].map(([key, label, type = 'text']) => (
                  <div key={key} className={key === 'description' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} required={label.includes('*')} value={productForm[key]} onChange={(e) => setProductForm({ ...productForm, [key]: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select value={productForm.CategoryId} onChange={(e) => setProductForm({ ...productForm, CategoryId: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Sin categoría</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                  <select value={productForm.gender} onChange={(e) => setProductForm({ ...productForm, gender: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {['men', 'women', 'unisex', 'kids'].map((g) => <option key={g} value={g} className="capitalize">{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tallas (separadas por coma)</label>
                  <input value={productForm.sizes} onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })} placeholder="XS, S, M, L, XL" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colores (separados por coma)</label>
                  <input value={productForm.colors} onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })} placeholder="negro, blanco, azul" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="md:col-span-2 flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowProductForm(false)} className="px-5 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">{editingProduct ? 'Actualizar' : 'Crear'}</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="px-5 py-3 font-medium">Producto</th>
                  <th className="px-5 py-3 font-medium">Precio</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Categoría</th>
                  <th className="px-5 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-12 object-cover rounded-lg" />
                        <span className="font-medium text-gray-900 truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold">{formatted(p.price)}</td>
                    <td className="px-5 py-3">
                      <span className={`font-medium ${p.stock === 0 ? 'text-red-500' : p.stock < 5 ? 'text-yellow-500' : 'text-green-600'}`}>{p.stock}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{p.Category?.name || '-'}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleEdit(p)} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium">#{order.id}</td>
                  <td className="px-5 py-3 text-gray-600">{order.User?.name}<br /><span className="text-xs text-gray-400">{order.User?.email}</span></td>
                  <td className="px-5 py-3 font-semibold">{formatted(order.total)}</td>
                  <td className="px-5 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString('es-CO')}</td>
                  <td className="px-5 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs px-2 py-1.5 rounded-lg font-medium border-0 cursor-pointer focus:outline-none ${statusColors[order.status]}`}
                    >
                      {Object.entries(statusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
