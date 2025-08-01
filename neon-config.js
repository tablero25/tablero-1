// Configuración temporal para Neon
// Reemplaza estos valores con los que te da Neon

const NEON_CONFIG = {
  host: 'ep-cool-forest-123456.us-east-2.aws.neon.tech', // Reemplaza con tu host
  database: 'neondb', // Reemplaza con tu database
  user: 'default', // Reemplaza con tu user
  password: 'tu_contraseña_aqui' // Reemplaza con tu password
};

// Variables de entorno para la migración
process.env.NEON_HOST = NEON_CONFIG.host;
process.env.NEON_DATABASE = NEON_CONFIG.database;
process.env.NEON_USER = NEON_CONFIG.user;
process.env.NEON_PASSWORD = NEON_CONFIG.password;

console.log('🔧 Configuración de Neon cargada');
console.log('📝 Asegúrate de actualizar neon-config.js con tus credenciales reales');

module.exports = NEON_CONFIG; 