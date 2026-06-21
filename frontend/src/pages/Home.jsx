import { Link } from 'react-router-dom';
import { Shirt, Shuffle, BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: Shirt, title: 'Sube tu ropa', desc: 'Agrega cada prenda con foto, categoría y color. Construye tu armario digital.' },
  { icon: Shuffle, title: 'Sortea un outfit', desc: 'Un clic y la app combina aleatoriamente tus prendas para crear un look.' },
  { icon: BookOpen, title: 'Guarda los que te gustan', desc: 'Guarda tus outfits favoritos para volver a ellos cuando quieras.' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-violet-600 font-semibold text-sm tracking-widest uppercase mb-4">Tu armario, reinventado</p>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Combina tu ropa<br />
          <span className="text-violet-600">al instante</span>
        </h1>
        <p className="text-gray-500 text-xl mb-10 max-w-lg mx-auto">
          Sube tus prendas, presiona un botón y descubre nuevas combinaciones de tu propio armario.
        </p>
        <Link
          to={user ? '/randomizer' : '/register'}
          className="inline-flex items-center gap-2 bg-violet-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-violet-700 transition-colors"
        >
          {user ? 'Sortear outfit' : 'Empezar gratis'} <ArrowRight size={20} />
        </Link>
        {!user && (
          <p className="mt-4 text-sm text-gray-400">
            ¿Ya tienes cuenta? <Link to="/login" className="text-violet-600 hover:underline">Inicia sesión</Link>
          </p>
        )}
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 border border-gray-100">
                <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-5">
                  <Icon size={24} className="text-violet-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
