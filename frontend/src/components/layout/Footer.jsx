import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">STYLE<span className="text-indigo-400">CO</span></h3>
            <p className="text-sm leading-relaxed">Tu destino de moda. Ropa de calidad para todos los estilos y ocasiones.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Categorías</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/products?gender=women" className="hover:text-white transition-colors">Mujer</Link>
              <Link to="/products?gender=men" className="hover:text-white transition-colors">Hombre</Link>
              <Link to="/products?gender=kids" className="hover:text-white transition-colors">Niños</Link>
              <Link to="/products?gender=unisex" className="hover:text-white transition-colors">Unisex</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Mi Cuenta</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/profile" className="hover:text-white transition-colors">Perfil</Link>
              <Link to="/orders" className="hover:text-white transition-colors">Mis Pedidos</Link>
              <Link to="/cart" className="hover:text-white transition-colors">Carrito</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} StyleCo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
