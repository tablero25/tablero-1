const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Crear base de datos SQLite
const dbPath = path.join(__dirname, 'data/tablero_hospitalario.db');
const db = new sqlite3.Database(dbPath);

function checkAdmin() {
  console.log('🔍 Verificando usuario admin en detalle...');
  
  // Verificar si existe el usuario admin
  db.get('SELECT * FROM usuarios WHERE dni = ?', ['admin'], (err, user) => {
    if (err) {
      console.error('❌ Error verificando usuario admin:', err.message);
      return;
    }
    
    if (!user) {
      console.log('❌ Usuario admin no existe');
      return;
    }
    
    console.log('✅ Usuario admin encontrado:');
    console.log('  - ID:', user.id);
    console.log('  - DNI:', user.dni);
    console.log('  - Nombre:', user.nombre_completo);
    console.log('  - Email:', user.email);
    console.log('  - Función:', user.funcion);
    console.log('  - Establecimiento ID:', user.establecimiento_id);
    console.log('  - Rol ID:', user.rol_id);
    console.log('  - Activo:', user.activo);
    console.log('  - Password hash:', user.password.substring(0, 20) + '...');
    
    // Verificar si la contraseña funciona
    const isValid = bcrypt.compareSync('admin123', user.password);
    console.log('  - Contraseña válida:', isValid);
    
    // Verificar el rol
    db.get('SELECT * FROM roles WHERE id = ?', [user.rol_id], (err, role) => {
      if (err) {
        console.error('❌ Error verificando rol:', err.message);
        return;
      }
      
      if (role) {
        console.log('  - Rol:', role.nombre);
      } else {
        console.log('  - Rol: NO ENCONTRADO');
      }
      
      // Verificar el establecimiento
      db.get('SELECT * FROM establecimientos WHERE id = ?', [user.establecimiento_id], (err, est) => {
        if (err) {
          console.error('❌ Error verificando establecimiento:', err.message);
          return;
        }
        
        if (est) {
          console.log('  - Establecimiento:', est.nombre);
        } else {
          console.log('  - Establecimiento: NO ENCONTRADO');
        }
        
        console.log('\n🎯 Resumen:');
        console.log('  - Usuario existe:', !!user);
        console.log('  - Contraseña válida:', isValid);
        console.log('  - Rol válido:', !!role);
        console.log('  - Establecimiento válido:', !!est);
        console.log('  - Usuario activo:', user.activo === 1);
        
        if (user && isValid && role && est && user.activo === 1) {
          console.log('✅ Usuario admin está correctamente configurado');
        } else {
          console.log('❌ Hay problemas con la configuración del usuario admin');
        }
        
        db.close();
      });
    });
  });
}

checkAdmin(); 