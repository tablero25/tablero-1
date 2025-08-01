const bcrypt = require('bcryptjs');
const { query } = require('./config/database-sqlite');

async function testLogin() {
  try {
    console.log('🧪 Probando login con admin/admin123...');
    
    const dni = 'admin';
    const password = 'admin123';
    
    console.log('📋 Datos de prueba:');
    console.log('  - DNI:', dni);
    console.log('  - Password:', password);
    
    // Buscar usuario por DNI
    console.log('\n🔍 Buscando usuario...');
    const users = await query(`
      SELECT u.*, e.nombre as establecimiento_nombre, r.nombre as rol_nombre 
      FROM usuarios u 
      LEFT JOIN establecimientos e ON u.establecimiento_id = e.id 
      LEFT JOIN roles r ON u.rol_id = r.id 
      WHERE u.dni = ? AND u.activo = 1
    `, [dni]);
    
    console.log('📊 Resultados de búsqueda:');
    console.log('  - Usuarios encontrados:', users.length);
    
    if (users.length === 0) {
      console.log('❌ No se encontró usuario con DNI:', dni);
      return;
    }
    
    const user = users[0];
    console.log('✅ Usuario encontrado:');
    console.log('  - ID:', user.id);
    console.log('  - DNI:', user.dni);
    console.log('  - Nombre:', user.nombre_completo);
    console.log('  - Email:', user.email);
    console.log('  - Establecimiento:', user.establecimiento_nombre);
    console.log('  - Rol:', user.rol_nombre);
    console.log('  - Activo:', user.activo);
    console.log('  - Password hash:', user.password.substring(0, 20) + '...');
    
    // Verificar contraseña
    console.log('\n🔐 Verificando contraseña...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('  - Contraseña válida:', isValidPassword);
    
    if (isValidPassword) {
      console.log('✅ Login exitoso!');
      console.log('📋 Datos del usuario:');
      console.log('  - Nombre completo:', user.nombre_completo);
      console.log('  - Establecimiento:', user.establecimiento_nombre);
      console.log('  - Rol:', user.rol_nombre);
    } else {
      console.log('❌ Contraseña incorrecta');
      console.log('💡 Verificar que la contraseña en la base de datos sea correcta');
    }
    
  } catch (error) {
    console.error('❌ Error en test de login:', error);
  }
}

testLogin(); 