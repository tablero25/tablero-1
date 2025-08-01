const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data/tablero_hospitalario.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 AGREGANDO ROL "JEFE DE ZONA"\n');

// Agregar el nuevo rol
db.run('INSERT OR IGNORE INTO roles (nombre, descripcion) VALUES (?, ?)', 
  ['jefe de zona', 'Jefe de zona con acceso a múltiples establecimientos'], 
  function(err) {
    if (err) {
      console.error('❌ Error agregando rol:', err.message);
    } else {
      console.log('✅ Rol "jefe de zona" agregado exitosamente');
      
      // Verificar que se agregó correctamente
      db.all('SELECT * FROM roles ORDER BY nombre', [], (err, roles) => {
        if (err) {
          console.error('❌ Error consultando roles:', err.message);
        } else {
          console.log('\n📋 ROLES DISPONIBLES:');
          roles.forEach((rol, index) => {
            console.log(`   ${index + 1}. ${rol.nombre} - ${rol.descripcion}`);
          });
        }
        db.close();
      });
    }
  }
); 