import { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, X, Upload } from 'lucide-react';
import { garmentService } from '../services/api';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: '', label: 'Todo' },
  { value: 'top', label: 'Tops' },
  { value: 'bottom', label: 'Pantalones/Faldas' },
  { value: 'shoes', label: 'Zapatos' },
  { value: 'outerwear', label: 'Chaquetas/Abrigos' },
  { value: 'accessory', label: 'Accesorios' },
];

const CATEGORY_LABELS = { top: 'Top', bottom: 'Inferior', shoes: 'Zapatos', outerwear: 'Chaqueta', accessory: 'Accesorio' };

function GarmentForm({ onClose, onSaved, editing }) {
  const [form, setForm] = useState({ name: editing?.name || '', category: editing?.category || 'top', color: editing?.color || '', description: editing?.description || '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(editing?.imageUrl ? `http://localhost:4000${editing.imageUrl}` : null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);

      if (editing) await garmentService.update(editing.id, fd);
      else await garmentService.create(fd);

      toast.success(editing ? 'Prenda actualizada' : 'Prenda agregada');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{editing ? 'Editar prenda' : 'Agregar prenda'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div
            onClick={() => fileRef.current.click()}
            className="w-full aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all overflow-hidden"
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-400">
                <Upload size={32} className="mx-auto mb-2" />
                <p className="text-sm">Clic para subir foto</p>
                <p className="text-xs mt-1">JPG, PNG · máx 5MB</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Camiseta blanca de algodón" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {CATEGORIES.filter(c => c.value).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="Ej: azul marino" className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Notas adicionales..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50">
            {loading ? 'Guardando...' : editing ? 'Actualizar' : 'Agregar al armario'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Wardrobe() {
  const [garments, setGarments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await garmentService.getAll(filter ? { category: filter } : {});
      setGarments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta prenda?')) return;
    try {
      await garmentService.delete(id);
      setGarments(garments.filter(g => g.id !== id));
      toast.success('Prenda eliminada');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showForm && (
        <GarmentForm
          editing={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); load(); }}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Armario</h1>
          <p className="text-gray-400 text-sm mt-1">{garments.length} prendas</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
          <Plus size={18} /> Agregar prenda
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === value ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : garments.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={36} className="text-gray-300" />
          </div>
          <p className="text-lg font-medium">No tienes prendas aún</p>
          <p className="text-sm mt-1">Agrega tu primera prenda para comenzar</p>
          <button onClick={() => setShowForm(true)} className="mt-6 bg-violet-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
            Agregar prenda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {garments.map((g) => (
            <div key={g.id} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setEditing(g); setShowForm(true); }}>
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {g.imageUrl ? (
                  <img src={`http://localhost:4000${g.imageUrl}`} alt={g.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">👕</div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(g.id); }}
                  className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
                <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                  {CATEGORY_LABELS[g.category]}
                </span>
              </div>
              <div className="p-3">
                <p className="font-medium text-gray-900 text-sm truncate">{g.name}</p>
                {g.color && <p className="text-xs text-gray-400 mt-0.5 capitalize">{g.color}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
