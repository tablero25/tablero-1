const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Usar la misma ruta que setup-sqlite.js
const dbPath = path.join(__dirname, 'data/tablero_hospitalario.db');
const db = new sqlite3.Database(dbPath);

console.log('=== EXTRACCIÓN DE USUARIOS DEL SISTEMA ===\n');
console.log(`📁 Base de datos: ${dbPath}\n`);

db.all(`
  SELECT 
    u.*, 
    e.nombre as establecimiento_nombre, 
    r.nombre as rol_nombre 
  FROM usuarios u 
  LEFT JOIN establecimientos e ON u.establecimiento_id = e.id 
  LEFT JOIN roles r ON u.rol_id = r.id 
  ORDER BY u.nombre_completo
`, [], (err, rows) => {
  if (err) {
    console.error('Error al consultar usuarios:', err);
  } else {
    console.log(`📊 TOTAL DE USUARIOS: ${rows.length}\n`);
    
    if (rows.length === 0) {
      console.log('❌ No hay usuarios registrados en el sistema');
    } else {
      rows.forEach((user, index) => {
        console.log(`👤 USUARIO ${index + 1}:`);
        console.log(`   📝 Nombre: ${user.nombre_completo}`);
        console.log(`   🆔 DNI: ${user.dni}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   💼 Función: ${user.funcion}`);
        console.log(`   👑 Rol: ${user.rol_nombre}`);
        console.log(`   🏥 Establecimiento: ${user.establecimiento_nombre || 'No asignado'}`);
        console.log(`   🔒 Estado: ${user.activo ? '✅ Activo' : '❌ Bloqueado'}`);
        console.log(`   📅 Fecha de creación: ${user.created_at}`);
        console.log('');
      });
      
      // Estadísticas
      const adminUsers = rows.filter(u => u.rol_nombre === 'admin').length;
      const gerenteUsers = rows.filter(u => u.rol_nombre === 'gerente').length;
      const activeUsers = rows.filter(u => u.activo).length;
      const blockedUsers = rows.filter(u => !u.activo).length;
      
      console.log('📈 ESTADÍSTICAS:');
      console.log(`   👑 Administradores: ${adminUsers}`);
      console.log(`   👨‍💼 Gerentes: ${gerenteUsers}`);
      console.log(`   ✅ Usuarios activos: ${activeUsers}`);
      console.log(`   ❌ Usuarios bloqueados: ${blockedUsers}`);
    }
  }
  
  db.close();
}); 