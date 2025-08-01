const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear base de datos SQLite
const dbPath = path.join(__dirname, '../data/tablero_hospitalario.db');
const db = new sqlite3.Database(dbPath);

// Función para probar la conexión
async function testConnection() {
  return new Promise((resolve) => {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'", (err, row) => {
      if (err) {
        console.error('❌ Error de conexión a la base de datos:', err.message);
        resolve(false);
      } else {
        console.log('✅ Conexión a la base de datos establecida');
        resolve(true);
      }
    });
  });
}

// Función para ejecutar consultas
async function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Error en consulta SQL:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Función para ejecutar consultas de inserción
async function insert(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Error en inserción SQL:', err);
        reject(err);
      } else {
        resolve({ insertId: this.lastID });
      }
    });
  });
}

module.exports = {
  db,
  testConnection,
  query,
  insert
}; 