const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data/tablero_hospitalario.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 AGREGANDO TABLA PARA MÚLTIPLES ESTABLECIMIENTOS\n');

// Crear tabla para relación muchos a muchos
const createTableSQL = `
CREATE TABLE IF NOT EXISTS usuario_establecimientos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  establecimiento_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (establecimiento_id) REFERENCES establecimientos(id) ON DELETE CASCADE,
  UNIQUE(usuario_id, establecimiento_id)
)
`;

db.run(createTableSQL, function(err) {
  if (err) {
    console.error('❌ Error creando tabla:', err.message);
  } else {
    console.log('✅ Tabla usuario_establecimientos creada exitosamente');
    
    // Verificar que la tabla se creó
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='usuario_establecimientos'", [], (err, tables) => {
      if (err) {
        console.error('❌ Error verificando tabla:', err.message);
      } else {
        console.log(`✅ Tabla verificada: ${tables.length > 0 ? 'Existe' : 'No existe'}`);
        
        // Mostrar todas las tablas
        db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, allTables) => {
          if (err) {
            console.error('❌ Error listando tablas:', err.message);
          } else {
            console.log('\n📋 TABLAS EN LA BASE DE DATOS:');
            allTables.forEach((table, index) => {
              console.log(`   ${index + 1}. ${table.name}`);
            });
          }
          db.close();
        });
      }
    });
  }
}); 