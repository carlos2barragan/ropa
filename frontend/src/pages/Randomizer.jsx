import { useState } from 'react';
import { Shuffle, Bookmark, RefreshCw } from 'lucide-react';
import { garmentService, outfitService } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORY_LABELS = {
  outerwear: 'Chaqueta',
  top: 'Top',
  bottom: 'Pantalón / Falda',
  shoes: 'Zapatos',
  accessory: 'Accesorio',
};

const CATEGORY_EMOJIS = {
  outerwear: '🧥',
  top: '👕',
  bottom: '👖',
  shoes: '👟',
  accessory: '👜',
};

// Aspect ratios and sizes per body zone
const SLOT_STYLES = {
  outerwear: 'aspect-[4/3] w-52',
  top:       'aspect-[4/3] w-44',
  bottom:    'aspect-[3/4] w-44',
  shoes:     'aspect-[3/2] w-36',
  accessory: 'aspect-square w-20',
};

function GarmentSlot({ category, garment, highlight, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 ${SLOT_STYLES[category]} ${highlight ? 'border-violet-500 shadow-lg shadow-violet-100' : 'border-transparent hover:border-violet-300'}`}
    >
      {garment.imageUrl ? (
        <img
          src={`http://localhost:4000${garment.imageUrl}`}
          alt={garment.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">
          {CATEGORY_EMOJIS[category]}
        </div>
      )}

      {/* Hover label */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-2">
        <p className="text-white text-xs font-bold uppercase tracking-wide leading-none">{CATEGORY_LABELS[category]}</p>
        <p className="text-white/80 text-xs truncate w-full text-center mt-0.5">{garment.name}</p>
      </div>
    </div>
  );
}

function BodyOutfit({ outfit, selected, onSelect }) {
  const bodyOrder = ['outerwear', 'top', 'bottom', 'shoes'];
  const bodyItems  = bodyOrder.filter(c => outfit[c]);
  const sideItems  = ['accessory'].filter(c => outfit[c]);

  return (
    <div className="flex justify-center gap-4 items-end">
      {/* Main body column */}
      <div className="flex flex-col items-center" style={{ gap: '2px' }}>
        {bodyItems.map(cat => (
          <GarmentSlot
            key={cat}
            category={cat}
            garment={outfit[cat]}
            highlight={selected === cat}
            onClick={() => onSelect(cat === selected ? null : cat)}
          />
        ))}
      </div>

      {/* Accessories on the side */}
      {sideItems.length > 0 && (
        <div className="flex flex-col gap-2 mb-4 self-center">
          {sideItems.map(cat => (
            <GarmentSlot
              key={cat}
              category={cat}
              garment={outfit[cat]}
              highlight={selected === cat}
              onClick={() => onSelect(cat === selected ? null : cat)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GarmentDetail({ category, garment }) {
  return (
    <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 flex items-center gap-4 animate-slide-in">
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        {garment.imageUrl ? (
          <img src={`http://localhost:4000${garment.imageUrl}`} alt={garment.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">{CATEGORY_EMOJIS[category]}</div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-violet-600 uppercase tracking-wide">{CATEGORY_LABELS[category]}</p>
        <p className="font-semibold text-gray-900 truncate">{garment.name}</p>
        {garment.color && <p className="text-xs text-gray-400 capitalize">{garment.color}</p>}
      </div>
    </div>
  );
}

export default function Randomizer() {
  const [outfit, setOutfit]             = useState(null);
  const [loading, setLoading]           = useState(false);
  const [saving, setSaving]             = useState(false);
  const [outfitName, setOutfitName]     = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [selectedCat, setSelectedCat]  = useState(null);

  const generateOutfit = async () => {
    setLoading(true);
    setOutfit(null);
    setSelectedCat(null);
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

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Sortear Outfit</h1>
        <p className="text-gray-400 text-sm">Toca una prenda para ver el detalle</p>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={generateOutfit}
          disabled={loading}
          className="flex items-center gap-3 bg-violet-600 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-violet-700 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-violet-200"
        >
          {loading ? <RefreshCw size={22} className="animate-spin" /> : <Shuffle size={22} />}
          {loading ? 'Combinando...' : 'Sortear outfit'}
        </button>
      </div>

      {outfit && (
        <div className="flex flex-col gap-5">
          <BodyOutfit outfit={outfit} selected={selectedCat} onSelect={setSelectedCat} />

          {selectedCat && outfit[selectedCat] && (
            <GarmentDetail category={selectedCat} garment={outfit[selectedCat]} />
          )}

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
              <button onClick={() => setShowNameInput(false)} className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-400 hover:bg-gray-50 transition-colors">
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
      )}

      {!outfit && !loading && (
        <div className="text-center text-gray-300 py-12">
          <Shuffle size={56} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">Tu outfit aparecerá aquí</p>
        </div>
      )}
    </div>
  );
}
