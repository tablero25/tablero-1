const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'data/tablero_hospitalario.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 AGREGANDO ROL "DIRECTOR"\n');

db.run('INSERT OR IGNORE INTO roles (nombre, descripcion) VALUES (?, ?)',
  ['director', 'Director con acceso a todos los establecimientos'],
  function(err) {
    if (err) {
      console.error('❌ Error agregando rol director:', err.message);
    } else {
      console.log('✅ Rol "director" agregado exitosamente');
      
      // Verificar que se agregó correctamente
      db.get('SELECT * FROM roles WHERE nombre = ?', ['director'], (err, row) => {
        if (err) {
          console.error('❌ Error verificando rol:', err.message);
        } else if (row) {
          console.log(`✅ Rol verificado - ID: ${row.id}, Nombre: ${row.nombre}`);
        } else {
          console.log('❌ Rol no encontrado después de la inserción');
        }
        db.close();
      });
    }
  }
); 