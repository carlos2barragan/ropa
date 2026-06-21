import { useState } from 'react';
import { Shuffle, Bookmark, RefreshCw } from 'lucide-react';
import { garmentService, outfitService } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORY_LABELS = { top: 'Top', bottom: 'Inferior', shoes: 'Zapatos', outerwear: 'Chaqueta', accessory: 'Accesorio' };
const CATEGORY_EMOJIS = { top: '👕', bottom: '👖', shoes: '👟', outerwear: '🧥', accessory: '👜' };

export default function Randomizer() {
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const generateOutfit = async () => {
    setLoading(true);
    setOutfit(null);
    setShowNameInput(false);
    try {
      const { data } = await garmentService.getRandomOutfit();
      if (Object.keys(data).length === 0) {
        toast.error('No tienes prendas en tu armario. ¡Agrega algunas primero!');
      } else {
        setOutfit(data);
      }
    } catch {
      toast.error('Error al generar outfit');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!outfit) return;
    setSaving(true);
    try {
      const garmentIds = Object.values(outfit).map(g => g.id);
      await outfitService.save({ name: outfitName || 'Outfit del día', garmentIds });
      toast.success('Outfit guardado');
      setShowNameInput(false);
      setOutfitName('');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const outfitEntries = outfit ? Object.entries(outfit) : [];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Sortear Outfit</h1>
        <p className="text-gray-500">Presiona el botón y combinaremos tu ropa al azar</p>
      </div>

      <div className="flex justify-center mb-10">
        <button
          onClick={generateOutfit}
          disabled={loading}
          className="flex items-center gap-3 bg-violet-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-violet-700 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-violet-200"
        >
          {loading ? <RefreshCw size={26} className="animate-spin" /> : <Shuffle size={26} />}
          {loading ? 'Combinando...' : 'Sortear outfit'}
        </button>
      </div>

      {outfit && outfitEntries.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <h2 className="font-bold text-gray-900 text-lg">Tu outfit de hoy</h2>
          </div>

          <div className="divide-y divide-gray-50">
            {outfitEntries.map(([category, garment]) => (
              <div key={category} className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {garment.imageUrl ? (
                    <img src={`http://localhost:4000${garment.imageUrl}`} alt={garment.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">{CATEGORY_EMOJIS[category]}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-0.5">{CATEGORY_LABELS[category]}</p>
                  <p className="font-semibold text-gray-900 truncate">{garment.name}</p>
                  {garment.color && <p className="text-xs text-gray-400 capitalize mt-0.5">{garment.color}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-gray-50 flex flex-col gap-3">
            {showNameInput ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  placeholder="Nombre del outfit (opcional)"
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button onClick={handleSave} disabled={saving} className="bg-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors">
                  {saving ? '...' : 'Guardar'}
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={generateOutfit} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <Shuffle size={16} /> Otro outfit
                </button>
                <button onClick={() => setShowNameInput(true)} className="flex-1 flex items-center justify-center gap-2 bg-violet-50 text-violet-700 py-3 rounded-xl text-sm font-semibold hover:bg-violet-100 transition-colors">
                  <Bookmark size={16} /> Guardar outfit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!outfit && !loading && (
        <div className="text-center text-gray-300 py-8">
          <Shuffle size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm">Tu outfit aparecerá aquí</p>
        </div>
      )}
    </div>
  );
}
