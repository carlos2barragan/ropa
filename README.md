# miarmario

App web para organizar tu ropa y generar outfits al azar. Sube tus prendas con foto, presiona un botón y la app combina tu ropa automáticamente mostrándola en una silueta de cuerpo.

## Funcionalidades

- **Registro e inicio de sesión** — cada usuario tiene su armario privado
- **Mi Armario** — sube prendas con foto, nombre, categoría y color. Edita o elimina cuando quieras
- **Sortear Outfit** — un clic genera una combinación aleatoria de tus prendas, mostradas en posición corporal (chaqueta → top → pantalón → zapatos)
- **Guardar Outfits** — guarda las combinaciones que más te gusten y consúltalas después

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js + Express |
| ORM | Sequelize |
| Base de datos | PostgreSQL |
| Auth | JWT + bcrypt |
| Imágenes | Multer (almacenamiento local) |

## Estructura del proyecto

```
clothing-store/
├── backend/
│   └── src/
│       ├── config/        # BD y configuración de multer
│       ├── controllers/   # Lógica de negocio
│       ├── middlewares/   # Autenticación JWT
│       ├── models/        # User, Garment, Outfit
│       ├── routes/        # auth, garments, outfits
│       └── index.js
└── frontend/
    └── src/
        ├── components/    # Navbar, Footer, Spinner
        ├── context/       # AuthContext
        ├── pages/         # Home, Wardrobe, Randomizer, SavedOutfits, ...
        └── services/      # Llamadas a la API
```

## Instalación y configuración

### Requisitos

- Node.js 18+
- PostgreSQL

### 1. Clonar el repositorio

```bash
git clone https://github.com/carlos2barragan/ropa.git
cd ropa
```

### 2. Configurar el backend

```bash
cd backend
cp .env.example .env
```

Editar `.env` con tus datos:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clothing_store
DB_USER=postgres
DB_PASSWORD=tu_password
JWT_SECRET=un_secreto_seguro
NODE_ENV=development
```

### 3. Crear la base de datos

```bash
psql postgres -c "CREATE DATABASE clothing_store;"
```

### 4. Instalar dependencias e iniciar el backend

```bash
cd backend
npm install
npm run dev
```

Las tablas se crean automáticamente al iniciar.

### 5. Instalar dependencias e iniciar el frontend

```bash
cd frontend
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`

## Scripts disponibles

### Backend

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor en modo desarrollo con nodemon |
| `npm start` | Servidor en producción |

### Frontend

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build para producción |

## API Endpoints

### Autenticación
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
```

### Prendas (requiere token)
```
GET    /api/garments              # listar prendas del usuario
GET    /api/garments/random-outfit # generar outfit aleatorio
POST   /api/garments              # subir prenda (multipart/form-data)
PUT    /api/garments/:id          # editar prenda
DELETE /api/garments/:id          # eliminar prenda
```

### Outfits guardados (requiere token)
```
GET    /api/outfits
POST   /api/outfits
DELETE /api/outfits/:id
```

## Categorías de prendas

| Valor | Descripción |
|---|---|
| `top` | Camisetas, blusas, suéteres |
| `bottom` | Pantalones, faldas, shorts |
| `shoes` | Zapatos, zapatillas, botas |
| `outerwear` | Chaquetas, abrigos, blazers |
| `accessory` | Bolsos, cinturones, gorras |
