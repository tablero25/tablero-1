const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');
const path = require('path');

// Configuración de SQLite (origen)
const sqlitePath = path.join(__dirname, 'data/tablero_hospitalario.db');
const sqliteDb = new sqlite3.Database(sqlitePath);

// Configuración de PostgreSQL (destino) - Base de datos tablerodecontrol
const pgClient = new Client({
  host: 'localhost',
  port: 5432,
  database: 'tablerodecontrol', // Tu base de datos creada
  user: 'postgres',
  password: '' // Sin contraseña
});

async function migrateData() {
  try {
    console.log('🔄 Iniciando migración de SQLite a PostgreSQL...');
    console.log('📊 Base de datos destino: tablerodecontrol');
    
    // Conectar a PostgreSQL
    await pgClient.connect();
    console.log('✅ Conectado a PostgreSQL');
    
    // Crear tablas en PostgreSQL
    await createTables();
    
    // Migrar datos
    await migrateTables();
    
    console.log('✅ Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
  } finally {
    await pgClient.end();
    sqliteDb.close();
  }
}

async function createTables() {
  console.log('📋 Creando tablas en PostgreSQL...');
  
  const createTablesSQL = `
    -- Tabla de roles
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY,
      nombre VARCHAR(50) UNIQUE NOT NULL,
      descripcion TEXT
    );
    
    -- Tabla de establecimientos
    CREATE TABLE IF NOT EXISTS establecimientos (
      id INTEGER PRIMARY KEY,
      codigo VARCHAR(10) UNIQUE NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      zona VARCHAR(50)
    );
    
    -- Tabla de usuarios
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY,
      dni VARCHAR(20) UNIQUE NOT NULL,
      nombre_completo VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      funcion VARCHAR(100),
      rol_id INTEGER REFERENCES roles(id),
      activo BOOLEAN DEFAULT true,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Tabla de relación usuario-establecimientos
    CREATE TABLE IF NOT EXISTS usuario_establecimientos (
      id INTEGER PRIMARY KEY,
      usuario_id INTEGER REFERENCES usuarios(id),
      establecimiento_id INTEGER REFERENCES establecimientos(id),
      UNIQUE(usuario_id, establecimiento_id)
    );
  `;
  
  await pgClient.query(createTablesSQL);
  console.log('✅ Tablas creadas en Cerveza2025');
}

async function migrateTables() {
  console.log('📦 Migrando datos...');
  
  // Migrar roles
  await migrateRoles();
  
  // Migrar establecimientos
  await migrateEstablecimientos();
  
  // Migrar usuarios
  await migrateUsuarios();
  
  // Migrar relaciones usuario-establecimientos
  await migrateUsuarioEstablecimientos();
}

async function migrateRoles() {
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM roles', async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      for (const row of rows) {
        await pgClient.query(
          'INSERT INTO roles (id, nombre, descripcion) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
          [row.id, row.nombre, row.descripcion]
        );
      }
      
      console.log(`✅ Migrados ${rows.length} roles`);
      resolve();
    });
  });
}

async function migrateEstablecimientos() {
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM establecimientos', async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      for (const row of rows) {
        await pgClient.query(
          'INSERT INTO establecimientos (id, codigo, nombre, zona) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
          [row.id, row.codigo, row.nombre, row.zona]
        );
      }
      
      console.log(`✅ Migrados ${rows.length} establecimientos`);
      resolve();
    });
  });
}

async function migrateUsuarios() {
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM usuarios', async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      for (const row of rows) {
        await pgClient.query(
          'INSERT INTO usuarios (id, dni, nombre_completo, email, password, funcion, rol_id, activo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING',
          [row.id, row.dni, row.nombre_completo, row.email, row.password, row.funcion, row.rol_id, row.activo]
        );
      }
      
      console.log(`✅ Migrados ${rows.length} usuarios`);
      resolve();
    });
  });
}

async function migrateUsuarioEstablecimientos() {
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM usuario_establecimientos', async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      for (const row of rows) {
        await pgClient.query(
          'INSERT INTO usuario_establecimientos (id, usuario_id, establecimiento_id) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
          [row.id, row.usuario_id, row.establecimiento_id]
        );
      }
      
      console.log(`✅ Migradas ${rows.length} relaciones usuario-establecimiento`);
      resolve();
    });
  });
}

// Ejecutar migración
migrateData().catch(console.error); 