// Configuración de Neon - CREDENCIALES REALES
// Estas son las credenciales reales de tu proyecto Neon

const NEON_CONFIG = {
  host: 'ep-dark-butterfly-ad0yjgp9-pooler.c-2.us-east-1.aws.neon.tech',
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_xTvKB3ZsUWu4'
};

// Variables de entorno para la migración
process.env.NEON_HOST = NEON_CONFIG.host;
process.env.NEON_DATABASE = NEON_CONFIG.database;
process.env.NEON_USER = NEON_CONFIG.user;
process.env.NEON_PASSWORD = NEON_CONFIG.password;

console.log('🔧 Configuración de Neon cargada con credenciales reales');
console.log('✅ Host:', NEON_CONFIG.host);
console.log('✅ Database:', NEON_CONFIG.database);
console.log('✅ User:', NEON_CONFIG.user);

module.exports = NEON_CONFIG; 