const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

console.log('=== VERIFICANDO TABLAS EN LA BASE DE DATOS ===\n');

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
  if (err) {
    console.error('Error al consultar tablas:', err);
  } else {
    console.log('📋 TABLAS ENCONTRADAS:');
    if (rows.length === 0) {
      console.log('❌ No hay tablas en la base de datos');
    } else {
      rows.forEach((table, index) => {
        console.log(`   ${index + 1}. ${table.name}`);
      });
    }
    console.log('');
    
    // Verificar contenido de cada tabla
    rows.forEach(table => {
      db.all(`SELECT COUNT(*) as count FROM ${table.name}`, [], (err, countRows) => {
        if (!err && countRows.length > 0) {
          console.log(`📊 Tabla '${table.name}': ${countRows[0].count} registros`);
        }
      });
    });
  }
  
  setTimeout(() => {
    db.close();
  }, 1000);
}); 