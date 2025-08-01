const { Client } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuración de Neon (reemplaza con tus credenciales)
const neonConfig = {
  host: process.env.NEON_HOST || 'ep-cool-forest-123456.us-east-2.aws.neon.tech',
  port: 5432,
  database: process.env.NEON_DATABASE || 'neondb',
  user: process.env.NEON_USER || 'default',
  password: process.env.NEON_PASSWORD || 'tu_contraseña_aqui',
  ssl: {
    rejectUnauthorized: false
  }
};

// Configuración de SQLite local
const sqlitePath = path.join(__dirname, 'data', 'tablero_hospitalario.db');
const sqliteDb = new sqlite3.Database(sqlitePath);

const neonClient = new Client(neonConfig);

async function migrateToNeon() {
  try {
    console.log('🔄 Iniciando migración a Neon...');
    
    // Conectar a Neon
    await neonClient.connect();
    console.log('✅ Conectado a Neon PostgreSQL');
    
    // Crear tablas en Neon
    await createTables();
    console.log('✅ Tablas creadas en Neon');
    
    // Migrar datos
    await migrateData();
    console.log('✅ Datos migrados exitosamente');
    
    console.log('🎉 ¡Migración completada!');
    
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    await neonClient.end();
    sqliteDb.close();
  }
}

async function createTables() {
  const createRolesTable = `
    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(50) UNIQUE NOT NULL,
      descripcion TEXT
    );
  `;
  
  const createEstablecimientosTable = `
    CREATE TABLE IF NOT EXISTS establecimientos (
      id SERIAL PRIMARY KEY,
      codigo VARCHAR(10) UNIQUE NOT NULL,
      nombre VARCHAR(255) NOT NULL,
      zona VARCHAR(100) NOT NULL
    );
  `;
  
  const createUsuariosTable = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      dni VARCHAR(20) UNIQUE NOT NULL,
      nombre_completo VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      funcion VARCHAR(100) NOT NULL,
      rol_id INTEGER REFERENCES roles(id),
      activo BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  const createUsuarioEstablecimientosTable = `
    CREATE TABLE IF NOT EXISTS usuario_establecimientos (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
      establecimiento_id INTEGER REFERENCES establecimientos(id) ON DELETE CASCADE,
      UNIQUE(usuario_id, establecimiento_id)
    );
  `;
  
  await neonClient.query(createRolesTable);
  await neonClient.query(createEstablecimientosTable);
  await neonClient.query(createUsuariosTable);
  await neonClient.query(createUsuarioEstablecimientosTable);
}

async function migrateData() {
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
        try {
          await neonClient.query(
            'INSERT INTO roles (id, nombre, descripcion) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
            [row.id, row.nombre, row.descripcion]
          );
        } catch (error) {
          console.log('Rol ya existe:', row.nombre);
        }
      }
      console.log(`✅ ${rows.length} roles migrados`);
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
        try {
          await neonClient.query(
            'INSERT INTO establecimientos (id, codigo, nombre, zona) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
            [row.id, row.codigo, row.nombre, row.zona]
          );
        } catch (error) {
          console.log('Establecimiento ya existe:', row.nombre);
        }
      }
      console.log(`✅ ${rows.length} establecimientos migrados`);
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
        try {
          await neonClient.query(
            'INSERT INTO usuarios (id, dni, nombre_completo, email, password, funcion, rol_id, activo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING',
            [row.id, row.dni, row.nombre_completo, row.email, row.password, row.funcion, row.rol_id, row.activo]
          );
        } catch (error) {
          console.log('Usuario ya existe:', row.nombre_completo);
        }
      }
      console.log(`✅ ${rows.length} usuarios migrados`);
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
        try {
          await neonClient.query(
            'INSERT INTO usuario_establecimientos (usuario_id, establecimiento_id) VALUES ($1, $2) ON CONFLICT (usuario_id, establecimiento_id) DO NOTHING',
            [row.usuario_id, row.establecimiento_id]
          );
        } catch (error) {
          console.log('Relación ya existe:', row.usuario_id, row.establecimiento_id);
        }
      }
      console.log(`✅ ${rows.length} relaciones usuario-establecimiento migradas`);
      resolve();
    });
  });
}

// Ejecutar migración
migrateToNeon().catch(console.error); 