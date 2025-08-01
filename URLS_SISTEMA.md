# 🌐 URLs DEL SISTEMA

## 🔐 Autenticación
- **Login:** http://localhost:3000/login
- **Registro:** http://localhost:3000/registro

## 📊 Tablero de Control
- **Página Principal:** http://localhost:3000/

---

## 📋 Resumen de URLs

### Para iniciar sesión:
http://localhost:3000/login

### Para registro de usuarios:
http://localhost:3000/registro

### Para acceder al tablero de control:
http://localhost:3000/

---

## 🎯 Funcionalidades por URL

### http://localhost:3000/login
- Formulario de login con DNI y contraseña
- Autenticación JWT
- Redirección automática al tablero después del login

### http://localhost:3000/registro
- Formulario de registro de nuevos usuarios
- Selección de rol (Gerente/Jefe de Zona)
- Selección de establecimiento(es)
- Validación de datos

### http://localhost:3000/
- Tablero de Control - Indicador de Gestión
- Tres módulos principales:
  - PRODUCCIÓN INTERNACIÓN
  - PRODUCCIÓN CONSULTA AMBULATORIA
  - RANKING DE DIAGNÓSTICO
- Filtrado automático según el rol del usuario 