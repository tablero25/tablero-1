# 🔐 SISTEMA DE AUTENTICACIÓN - TABLERO HOSPITALARIO

## 📋 Requisitos Previos

1. **MySQL/MariaDB** instalado y ejecutándose
2. **Node.js** (versión 14 o superior)
3. **npm** o **yarn**

## 🚀 Instalación y Configuración

### 1. Configurar Base de Datos

```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Configurar la base de datos (ejecutar solo la primera vez)
npm run setup-db
```

### 2. Configurar Credenciales de Base de Datos

Editar `backend/config/database.js` y actualizar las credenciales:

```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',           // Tu usuario de MySQL
  password: 'tu_password', // Tu contraseña de MySQL
  database: 'tablero_hospitalario',
  // ...
};
```

### 3. Iniciar Servicios

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 👤 Usuarios por Defecto

### Administrador
- **DNI**: `admin`
- **Contraseña**: `admin123`
- **Rol**: Administrador del sistema
- **Acceso**: Todos los establecimientos

### Gerente
- **Rol**: Gerente de establecimiento
- **Acceso**: Solo su establecimiento asignado
- **Registro**: Los usuarios se registran como gerentes

## 🔧 Estructura de Base de Datos

### Tablas Principales

#### `usuarios`
- `id` - ID único
- `dni` - DNI del usuario (único)
- `nombre_completo` - Nombre completo
- `email` - Email (único)
- `password` - Contraseña hasheada
- `funcion` - Función del usuario
- `establecimiento_id` - ID del establecimiento
- `rol_id` - ID del rol
- `activo` - Estado activo/inactivo

#### `establecimientos`
- `id` - ID único
- `codigo` - Código del establecimiento
- `nombre` - Nombre del establecimiento
- `zona` - Zona geográfica
- `activo` - Estado activo/inactivo

#### `roles`
- `id` - ID único
- `nombre` - Nombre del rol (admin, gerente)
- `descripcion` - Descripción del rol
- `activo` - Estado activo/inactivo

## 🎯 Funcionalidades

### Login
- Autenticación por DNI
- Validación de contraseña
- Generación de token JWT
- Persistencia de sesión

### Registro
- Validación de campos requeridos
- Verificación de DNI único
- Verificación de email único
- Selección de establecimiento
- Hasheo seguro de contraseñas

### Seguridad
- Tokens JWT con expiración (24h)
- Contraseñas hasheadas con bcrypt
- Validación de tokens en cada petición
- Middleware de autenticación

## 📱 Interfaz de Usuario

### Pantalla de Login
- Campo DNI
- Campo contraseña
- Botón de inicio de sesión
- Enlace para registro

### Pantalla de Registro
- DNI (único)
- Nombre completo
- Email (único)
- Función
- Establecimiento (dropdown)
- Contraseña
- Confirmar contraseña
- Validaciones en tiempo real

### Información del Usuario
- Nombre del usuario logueado
- Establecimiento asignado
- Botón de cerrar sesión

## 🔄 Flujo de Autenticación

1. **Carga inicial**: Verifica token existente
2. **Sin token**: Muestra pantalla de login
3. **Login exitoso**: Guarda token y datos del usuario
4. **Acceso a rutas**: Verifica token en cada petición
5. **Logout**: Elimina token y redirige a login

## 🛠️ Endpoints de la API

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `GET /auth/verify` - Verificar token
- `GET /auth/establecimientos` - Listar establecimientos
- `POST /auth/logout` - Cerrar sesión

## 🎨 Estilos

- Diseño moderno y responsive
- Animaciones suaves
- Colores corporativos (#0073b7)
- Tipografía Montserrat
- Validaciones visuales

## 🔍 Troubleshooting

### Error de conexión a MySQL
```bash
# Verificar que MySQL esté ejecutándose
sudo service mysql status

# Verificar credenciales en config/database.js
```

### Error de permisos
```bash
# Dar permisos al usuario MySQL
mysql -u root -p
GRANT ALL PRIVILEGES ON tablero_hospitalario.* TO 'tu_usuario'@'localhost';
FLUSH PRIVILEGES;
```

### Puerto ocupado
```bash
# Verificar puertos en uso
netstat -an | grep :5000
netstat -an | grep :3000
```

## 📞 Soporte

Para problemas técnicos:
1. Verificar logs del backend
2. Verificar conexión a MySQL
3. Verificar credenciales de base de datos
4. Revisar configuración de CORS

---

**¡Sistema de autenticación listo para usar!** 🎉 