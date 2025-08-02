# Configuración de GitHub para Almacenamiento

## Paso 1: Crear Token de GitHub

1. **Ve a GitHub**: https://github.com/settings/tokens
2. **Haz clic en "Generate new token"** → "Generate new token (classic)"
3. **Configura el token**:
   - **Note**: "Tablero 1 - Almacenamiento de archivos"
   - **Expiration**: Elige una fecha (ej: 1 año)
   - **Select scopes**: Marca ✅ **repo** (acceso completo a repositorios)
4. **Haz clic en "Generate token"**
5. **Copia el token** (empieza con `ghp_`)

## Paso 2: Configurar el Token

### Opción A: Editar archivo de configuración
1. Abre `backend/github-config.js`
2. Reemplaza `'tu_token_aqui'` con tu token real
3. Verifica que `GITHUB_REPO` sea tu repositorio correcto

### Opción B: Variables de entorno
Crea un archivo `.env` en la carpeta `backend` con:
```
GITHUB_TOKEN=ghp_tu_token_aqui
GITHUB_REPO=tu_usuario/tu_repositorio
GITHUB_BRANCH=main
```

## Paso 3: Verificar Configuración

1. **Reinicia el servidor backend**
2. **Ve a la aplicación** y prueba subir un archivo
3. **Verifica en GitHub** que el archivo se subió a la carpeta `data/`

## Rutas Disponibles

- `POST /api/github/upload` - Subir archivo a GitHub
- `GET /api/github/list` - Listar archivos de GitHub
- `GET /api/github/download/:filename` - Descargar archivo de GitHub

## Ejemplo de Uso

```javascript
// Subir archivo
fetch('/api/github/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filename: 'ejemplo.xlsx',
    content: 'base64_del_archivo',
    message: 'Subir archivo desde la aplicación'
  })
});
```

## Solución de Problemas

### Error: "Token de GitHub no configurado"
- Verifica que el token esté configurado en `github-config.js`
- Asegúrate de que el token tenga permisos `repo`

### Error: "Not Found" al subir
- Verifica que el repositorio existe
- Confirma que el token tiene acceso al repositorio

### Error: "Bad credentials"
- El token ha expirado o es inválido
- Crea un nuevo token en GitHub

## Seguridad

⚠️ **IMPORTANTE**:
- Nunca compartas tu token públicamente
- No subas el token a GitHub
- Usa variables de entorno en producción
- Configura una fecha de expiración apropiada 