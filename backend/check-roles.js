const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data/tablero_hospitalario.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 VERIFICANDO ROLES EN LA BASE DE DATOS\n');

db.all('SELECT * FROM roles ORDER BY id', [], (err, roles) => {
  if (err) {
    console.error('❌ Error consultando roles:', err);
    return;
  }

  console.log('📋 ROLES DISPONIBLES:');
  roles.forEach((rol, index) => {
    console.log(`   ${index + 1}. ID: ${rol.id} - ${rol.nombre} - ${rol.descripcion}`);
  });

  console.log('\n🔍 PROBLEMA IDENTIFICADO:');
  console.log('   El rol "jefe de zona" debería tener ID 3, pero parece que no existe');
  console.log('   o tiene un ID diferente.');

  // Verificar si existe el rol "jefe de zona"
  db.get('SELECT * FROM roles WHERE nombre = ?', ['jefe de zona'], (err, jefeZona) => {
    if (err) {
      console.error('❌ Error consultando jefe de zona:', err);
      return;
    }

    if (jefeZona) {
      console.log(`\n✅ Rol "jefe de zona" encontrado con ID: ${jefeZona.id}`);
      console.log('   El problema es que el frontend está enviando rolId: 3');
      console.log('   pero el rol real tiene ID:', jefeZona.id);
    } else {
      console.log('\n❌ Rol "jefe de zona" no encontrado');
      console.log('   Necesitamos agregarlo a la base de datos');
    }

    db.close();
  });
}); 