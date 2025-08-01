const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data/tablero_hospitalario.db');
const db = new sqlite3.Database(dbPath);

console.log('🧪 PROBANDO ROL "JEFE DE ZONA"\n');

// Verificar roles disponibles
db.all('SELECT * FROM roles ORDER BY nombre', [], (err, roles) => {
  if (err) {
    console.error('❌ Error consultando roles:', err);
    return;
  }

  console.log('📋 ROLES DISPONIBLES:');
  roles.forEach((rol, index) => {
    console.log(`   ${index + 1}. ${rol.nombre} (ID: ${rol.id}) - ${rol.descripcion}`);
  });

  // Verificar tabla de relación usuario-establecimientos
  db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='usuario_establecimientos'", [], (err, tables) => {
    if (err) {
      console.error('❌ Error verificando tabla:', err);
      return;
    }

    console.log(`\n📊 Tabla usuario_establecimientos: ${tables.length > 0 ? '✅ Existe' : '❌ No existe'}`);

    if (tables.length > 0) {
      // Mostrar estructura de la tabla
      db.all("PRAGMA table_info(usuario_establecimientos)", [], (err, columns) => {
        if (err) {
          console.error('❌ Error consultando estructura:', err);
          return;
        }

        console.log('\n🏗️ ESTRUCTURA DE LA TABLA:');
        columns.forEach(col => {
          console.log(`   - ${col.name} (${col.type})`);
        });

        // Verificar si hay datos
        db.all('SELECT COUNT(*) as count FROM usuario_establecimientos', [], (err, result) => {
          if (err) {
            console.error('❌ Error contando registros:', err);
            return;
          }

          console.log(`\n📈 Registros en usuario_establecimientos: ${result[0].count}`);

          if (result[0].count > 0) {
            // Mostrar algunos ejemplos
            db.all(`
              SELECT u.dni, u.nombre_completo, e.nombre as establecimiento
              FROM usuario_establecimientos ue
              JOIN usuarios u ON ue.usuario_id = u.id
              JOIN establecimientos e ON ue.establecimiento_id = e.id
              LIMIT 5
            `, [], (err, examples) => {
              if (err) {
                console.error('❌ Error consultando ejemplos:', err);
                return;
              }

              console.log('\n👥 EJEMPLOS DE RELACIONES:');
              examples.forEach((example, index) => {
                console.log(`   ${index + 1}. ${example.nombre_completo} (${example.dni}) - ${example.establecimiento}`);
              });

              db.close();
            });
          } else {
            console.log('\n📝 No hay relaciones usuario-establecimiento registradas aún');
            db.close();
          }
        });
      });
    } else {
      db.close();
    }
  });
}); 