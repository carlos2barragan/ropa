import { useState } from 'react';
import { Shuffle, Bookmark, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { garmentService, outfitService } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORY_LABELS = { top: 'Top', bottom: 'Inferior', shoes: 'Zapatos', outerwear: 'Chaqueta', accessory: 'Accesorio' };
const CATEGORY_EMOJIS = { top: '👕', bottom: '👖', shoes: '👟', outerwear: '🧥', accessory: '👜' };

function Carousel({ items }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(null);

  const go = (dir) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + items.length) % items.length);
  };

  const [category, garment] = items[current];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full flex items-center justify-center gap-3">
        <button
          onClick={() => go(-1)}
          disabled={items.length <= 1}
          className="flex-shrink-0 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:border-violet-400 hover:text-violet-600 transition-all disabled:opacity-30 shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex-1 max-w-xs overflow-hidden">
          <div
            key={`${current}-${category}`}
            className="animate-slide-in"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
              <div className="aspect-[3/4] bg-gray-50 relative">
                {garment.imageUrl ? (
                  <img
                    src={`http://localhost:4000${garment.imageUrl}`}
                    alt={garment.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl">
                    {CATEGORY_EMOJIS[category]}
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {CATEGORY_LABELS[category]}
                </span>
              </div>
              <div className="p-4 text-center">
                <p className="font-bold text-gray-900 text-lg truncate">{garment.name}</p>
                {garment.color && (
                  <p className="text-sm text-gray-400 capitalize mt-1">{garment.color}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => go(1)}
          disabled={items.length <= 1}
          className="flex-shrink-0 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:border-violet-400 hover:text-violet-600 transition-all disabled:opacity-30 shadow-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'w-6 h-2.5 bg-violet-600' : 'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300'}`}
          />
        ))}
      </div>

      {/* Mini preview strip */}
      <div className="flex gap-2 mt-4">
        {items.map(([cat, g], i) => (
          <button
            key={cat}
            onClick={() => setCurrent(i)}
            className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${i === current ? 'border-violet-500 scale-110' : 'border-transparent opacity-50 hover:opacity-80'}`}
          >
            {g.imageUrl ? (
              <img src={`http://localhost:4000${g.imageUrl}`} alt={g.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-lg">
                {CATEGORY_EMOJIS[cat]}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

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
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Sortear Outfit</h1>
        <p className="text-gray-400">Presiona el botón y combinaremos tu ropa al azar</p>
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
        <div className="flex flex-col gap-6">
          <Carousel items={outfitEntries} />

          <div className="flex flex-col gap-3">
            {showNameInput ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  placeholder="Nombre del outfit (opcional)"
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button onClick={handleSave} disabled={saving} className="bg-violet-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors">
                  {saving ? '...' : 'Guardar'}
                </button>
                <button onClick={() => setShowNameInput(false)} className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={generateOutfit} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-3.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <Shuffle size={16} /> Otro outfit
                </button>
                <button onClick={() => setShowNameInput(true)} className="flex-1 flex items-center justify-center gap-2 bg-violet-50 text-violet-700 py-3.5 rounded-xl text-sm font-semibold hover:bg-violet-100 transition-colors">
                  <Bookmark size={16} /> Guardar outfit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!outfit && !loading && (
        <div className="text-center text-gray-300 py-8">
          <Shuffle size={64} className="mx-auto mb-4 opacity-20" />
          <p className="text-sm">Tu outfit aparecerá aquí</p>
        </div>
      )}
    </div>
  );
}
