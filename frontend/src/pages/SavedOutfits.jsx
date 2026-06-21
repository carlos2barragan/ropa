import { useEffect, useState } from 'react';
import { Trash2, BookOpen } from 'lucide-react';
import { outfitService } from '../services/api';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

const CATEGORY_EMOJIS = { top: '👕', bottom: '👖', shoes: '👟', outerwear: '🧥', accessory: '👜' };

export default function SavedOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    outfitService.getAll().then(({ data }) => setOutfits(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este outfit?')) return;
    try {
      await outfitService.delete(id);
      setOutfits(outfits.filter(o => o.id !== id));
      toast.success('Outfit eliminado');
    } catch {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Outfits Guardados</h1>

      {outfits.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen size={56} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No tienes outfits guardados</p>
          <p className="text-sm mt-1">Sortea un outfit y guarda los que más te gusten</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {outfits.map((outfit) => (
            <div key={outfit.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between p-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-900">{outfit.name}</h3>
                <button onClick={() => handleDelete(outfit.id)} className="p-1.5 text-gray-300 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {outfit.Garments?.slice(0, 4).map((g) => (
                    <div key={g.id} className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                      {g.imageUrl ? (
                        <img src={`http://localhost:4000${g.imageUrl}`} alt={g.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">{CATEGORY_EMOJIS[g.category]}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {outfit.Garments?.map((g) => (
                    <span key={g.id} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full truncate max-w-[120px]">{g.name}</span>
                  ))}
                </div>
              </div>

              <p className="px-4 pb-3 text-xs text-gray-300">
                {new Date(outfit.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
