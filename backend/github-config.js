// Configuración de GitHub
// IMPORTANTE: Configura las variables de entorno en Vercel
module.exports = {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  GITHUB_REPO: process.env.GITHUB_REPO || 'tablero25/tablero-1',
  GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'main'
};

// Instrucciones para configurar:
// 1. Ve a https://github.com/settings/tokens
// 2. Crea un nuevo token con permisos 'repo'
// 3. Copia el token y reemplaza 'tu_token_aqui' arriba
// 4. O configura las variables de entorno:
//    GITHUB_TOKEN=ghp_tu_token_aqui
//    GITHUB_REPO=tu_usuario/tu_repositorio
//    GITHUB_BRANCH=main 