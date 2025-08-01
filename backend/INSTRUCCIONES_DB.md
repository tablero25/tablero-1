# 🔧 CONFIGURACIÓN MANUAL DE BASE DE DATOS

## 📋 Pasos para configurar MySQL

### 1. Instalar MySQL (si no está instalado)
- Descargar desde: https://dev.mysql.com/downloads/mysql/
- O usar XAMPP: https://www.apachefriends.org/

### 2. Crear la base de datos
```sql
-- Ejecutar en MySQL Workbench o línea de comandos
CREATE DATABASE tablero_hospitalario;
USE tablero_hospitalario;
```

### 3. Ejecutar el script SQL
- Abrir el archivo `setup-database-manual.sql`
- Copiar todo el contenido
- Ejecutar en MySQL Workbench o línea de comandos

### 4. Verificar la configuración
```sql
-- Verificar tablas creadas
SHOW TABLES;

-- Verificar roles
SELECT * FROM roles;

-- Verificar establecimientos
SELECT * FROM establecimientos LIMIT 5;

-- Verificar usuario admin
SELECT dni, nombre_completo, email, rol_id FROM usuarios;
```

## 🔑 Credenciales por defecto

### Usuario Administrador
- **DNI**: `admin`
- **Contraseña**: `admin123`
- **Rol**: Administrador del sistema

## 🚀 Iniciar el sistema

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

## 🌐 Acceder al sistema
- **URL**: http://localhost:3000
- **Login**: ee https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
warnOnce @ deprecations.ts:9
logDeprecation @ deprecations.ts:13
logV6DeprecationWarnings @ deprecations.ts:37
(anonymous) @ index.tsx:816
commitHookEffectListMount @ react-dom.development.js:23189
commitPassiveMountOnFiber @ react-dom.development.js:24965
commitPassiveMountEffects_complete @ react-dom.development.js:24930
commitPassiveMountEffects_begin @ react-dom.development.js:24917
commitPassiveMountEffects @ react-dom.development.js:24905
flushPassiveEffectsImpl @ react-dom.development.js:27078
flushPassiveEffects @ react-dom.development.js:27023
(anonymous) @ react-dom.development.js:26808
workLoop @ scheduler.development.js:266
flushWork @ scheduler.development.js:239
performWorkUntilDeadline @ scheduler.development.js:533Understand this warning
Register.js:23  GET http://localhost:5000/auth/establecimientos 404 (Not Found)
fetchEstablecimientos @ Register.js:23
(anonymous) @ Register.js:38
commitHookEffectListMount @ react-dom.development.js:23189
commitPassiveMountOnFiber @ react-dom.development.js:24965
commitPassiveMountEffects_complete @ react-dom.development.js:24930
commitPassiveMountEffects_begin @ react-dom.development.js:24917
commitPassiveMountEffects @ react-dom.development.js:24905
flushPassiveEffectsImpl @ react-dom.development.js:27078
flushPassiveEffects @ react-dom.development.js:27023
commitRootImpl @ react-dom.development.js:26974
commitRoot @ react-dom.development.js:26721
performSyncWorkOnRoot @ react-dom.development.js:26156
flushSyncCallbacks @ react-dom.development.js:12042
(anonymous) @ react-dom.development.js:25690Understand this error
Register.js:23  GET http://localhost:5000/auth/establecimientos 404 (Not Found)admin / admin123

## 🔍 Verificar funcionamiento
1. Abrir http://localhost:3000
2. Hacer login con admin/admin123
3. Verificar que aparece el header con logo
4. Verificar que muestra información del usuario
5. Probar registro de nuevo usuario

## 🛠️ Troubleshooting

### Error de conexión a MySQL
```bash
# Verificar que MySQL esté ejecutándose
# En Windows:
services.msc
# Buscar "MySQL" y verificar que esté "Running"

# En línea de comandos:
mysql -u root -p
```

### Error de credenciales
Editar `backend/config/database.js`:
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',           // Tu usuario MySQL
  password: 'tu_password', // Tu contraseña MySQL
  database: 'tablero_hospitalario',
  // ...
};
```

### Error de permisos
```sql
-- En MySQL:
GRANT ALL PRIVILEGES ON tablero_hospitalario.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

---

## 🌐 URLs DEL SISTEMA

### 🏠 Página de Inicio
- **Bienvenida:** http://localhost:3000/

### 🔐 Autenticación
- **Login:** http://localhost:3000/login
- **Registro:** http://localhost:3000/registro

### 📊 Tablero de Control
- **Página Principal:** http://localhost:3000/tablero

---

## 📋 Resumen de URLs

### Para acceder a la página de inicio:
http://localhost:3000/

### Para iniciar sesión:
http://localhost:3000/login

### Para registro de usuarios:
http://localhost:3000/registro

### Para acceder al tablero de control:
http://localhost:3000/tablero

---

## 🎯 Funcionalidades por URL

### http://localhost:3000/
- Página de bienvenida con título "BIENVENIDO AL TABLERO DE CONTROL - INDICADOR DE GESTIÓN"
- Logo SDO en el centro
- Cuadro de contraseña para acceder al sistema
- **Contraseña requerida:** 2601
- Redirección automática al login después de ingresar la contraseña correcta

### http://localhost:3000/login
- Formulario de login con DNI y contraseña
- Autenticación JWT
- Redirección automática al tablero después del login

### http://localhost:3000/registro
- Formulario de registro de nuevos usuarios
- **Rol fijo:** Solo "Gerente" (no se puede cambiar)
- Selección de un establecimiento
- Validación de datos

### http://localhost:3000/tablero
- Tablero de Control - Indicador de Gestión
- Tres módulos principales:
  - PRODUCCIÓN INTERNACIÓN
  - PRODUCCIÓN CONSULTA AMBULATORIA
  - RANKING DE DIAGNÓSTICO
- Filtrado automático según el rol del usuario

---

**¡Sistema listo para usar!** 🎉