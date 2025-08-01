const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data/tablero_hospitalario.db');
const db = new sqlite3.Database(dbPath);

console.log('🧪 PROBANDO FUNCIONALIDAD JEFE DE ZONA DESDE ADMIN\n');

// Verificar usuarios existentes
db.all(`
  SELECT u.*, e.nombre as establecimiento_nombre, r.nombre as rol_nombre
  FROM usuarios u
  LEFT JOIN establecimientos e ON u.establecimiento_id = e.id
  LEFT JOIN roles r ON u.rol_id = r.id
  ORDER BY u.nombre_completo
`, [], (err, usuarios) => {
  if (err) {
    console.error('❌ Error consultando usuarios:', err);
    return;
  }

  console.log('👥 USUARIOS EXISTENTES:');
  usuarios.forEach((user, index) => {
    console.log(`   ${index + 1}. ${user.nombre_completo} (${user.dni})`);
    console.log(`      Rol: ${user.rol_nombre}`);
    console.log(`      Establecimiento: ${user.establecimiento_nombre || 'N/A'}`);
    console.log('');
  });

  // Verificar relaciones usuario-establecimientos
  db.all(`
    SELECT u.dni, u.nombre_completo, e.nombre as establecimiento
    FROM usuario_establecimientos ue
    JOIN usuarios u ON ue.usuario_id = u.id
    JOIN establecimientos e ON ue.establecimiento_id = e.id
    ORDER BY u.nombre_completo, e.nombre
  `, [], (err, relaciones) => {
    if (err) {
      console.error('❌ Error consultando relaciones:', err);
      return;
    }

    console.log('🔗 RELACIONES USUARIO-ESTABLECIMIENTOS:');
    if (relaciones.length === 0) {
      console.log('   📝 No hay relaciones registradas');
    } else {
      relaciones.forEach((relacion, index) => {
        console.log(`   ${index + 1}. ${relacion.nombre_completo} (${relacion.dni}) - ${relacion.establecimiento}`);
      });
    }

    // Mostrar algunos establecimientos disponibles
    db.all(`
      SELECT id, codigo, nombre, zona
      FROM establecimientos
      WHERE activo = 1
      ORDER BY zona, nombre
      LIMIT 10
    `, [], (err, establecimientos) => {
      if (err) {
        console.error('❌ Error consultando establecimientos:', err);
        return;
      }

      console.log('\n🏥 ESTABLECIMIENTOS DISPONIBLES (primeros 10):');
      establecimientos.forEach((est, index) => {
        console.log(`   ${index + 1}. ${est.codigo} - ${est.nombre} (${est.zona})`);
      });

      console.log('\n📋 INSTRUCCIONES PARA PROBAR:');
      console.log('1. Login como admin (admin/admin123)');
      console.log('2. Ir a Configuración > Roles');
      console.log('3. Seleccionar un usuario y cambiar su rol a "jefe de zona"');
      console.log('4. Se desplegará una lista de establecimientos para tildar');
      console.log('5. Seleccionar múltiples establecimientos y guardar');

      db.close();
    });
  });
}); 