const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const JWT_SECRET = 'tablero_hospitalario_secret_key_2024';
const dbPath = path.join(__dirname, 'data/tablero_hospitalario.db');

async function testWithValidToken() {
  console.log('🧪 PROBANDO CON TOKEN VÁLIDO\n');

  try {
    // 1. Obtener usuario admin de la base de datos
    const db = new sqlite3.Database(dbPath);
    
    db.get('SELECT * FROM usuarios WHERE dni = ?', ['admin'], async (err, user) => {
      if (err) {
        console.error('Error obteniendo usuario:', err);
        return;
      }

      if (!user) {
        console.error('❌ Usuario admin no encontrado');
        return;
      }

      console.log('✅ Usuario admin encontrado:', user.nombre_completo);

      // 2. Generar token válido
      const token = jwt.sign(
        { 
          userId: user.id, 
          dni: user.dni, 
          rol: 'admin',
          establecimiento: 'Materno Infantil'
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );

      console.log('✅ Token generado:', token.substring(0, 50) + '...');

      // 3. Probar rutas con token válido
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Probar ruta de usuarios
      console.log('\n1️⃣ Probando GET /auth/usuarios con token válido...');
      const usuariosRes = await fetch('http://localhost:5000/auth/usuarios', { headers });
      console.log(`   Status: ${usuariosRes.status}`);
      
      if (usuariosRes.status === 200) {
        const data = await usuariosRes.json();
        console.log(`   ✅ Éxito: ${data.usuarios?.length || 0} usuarios encontrados`);
        if (data.usuarios) {
          data.usuarios.forEach((user, index) => {
            console.log(`      ${index + 1}. ${user.nombre_completo} (${user.dni})`);
          });
        }
      } else {
        console.log(`   ❌ Error: ${usuariosRes.status}`);
      }

      // Probar ruta de roles
      console.log('\n2️⃣ Probando GET /auth/roles con token válido...');
      const rolesRes = await fetch('http://localhost:5000/auth/roles', { headers });
      console.log(`   Status: ${rolesRes.status}`);
      
      if (rolesRes.status === 200) {
        const data = await rolesRes.json();
        console.log(`   ✅ Éxito: ${data.roles?.length || 0} roles encontrados`);
      } else {
        console.log(`   ❌ Error: ${rolesRes.status}`);
      }

      db.close();
    });

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

testWithValidToken(); 