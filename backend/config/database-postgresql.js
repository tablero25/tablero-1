const { Client } = require('pg');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'tablerodecontrol',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '', // Sin contraseña para local
  // Configuración SSL para Neon (solo en producción)
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false
    }
  })
};

const client = new Client(dbConfig);

async function connect() {
  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL - Base de datos:', dbConfig.database);
    return client;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error);
    throw error;
  }
}

async function disconnect() {
  try {
    await client.end();
    console.log('✅ Desconectado de PostgreSQL');
  } catch (error) {
    console.error('❌ Error desconectando de PostgreSQL:', error);
  }
}

module.exports = {
  client,
  connect,
  disconnect,
  dbConfig
}; 