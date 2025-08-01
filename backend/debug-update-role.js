const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const JWT_SECRET = 'tablero_hospitalario_secret_key_2024';
const dbPath = path.join(__dirname, 'data/tablero_hospitalario.db');

console.log('🔍 DEBUGGING UPDATE-ROLE ENDPOINT\n');

// Simular una petición de actualización de rol
async function testUpdateRole() {
  try {
    // 1. Obtener usuario admin para generar token
    const db = new sqlite3.Database(dbPath);
    
    db.get('SELECT * FROM usuarios WHERE dni = ?', ['admin'], async (err, adminUser) => {
      if (err) {
        console.error('❌ Error obteniendo admin:', err);
        return;
      }

      if (!adminUser) {
        console.error('❌ Usuario admin no encontrado');
        return;
      }

      console.log('✅ Usuario admin encontrado:', adminUser.nombre_completo);

      // 2. Generar token válido
      const token = jwt.sign(
        { 
          userId: adminUser.id, 
          dni: adminUser.dni, 
          rol: 'admin',
          establecimiento: 'Materno Infantil'
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );

      console.log('✅ Token generado');

      // 3. Obtener un usuario para probar
      db.get('SELECT * FROM usuarios WHERE dni != ? LIMIT 1', ['admin'], async (err, testUser) => {
        if (err) {
          console.error('❌ Error obteniendo usuario de prueba:', err);
          return;
        }

        if (!testUser) {
          console.error('❌ No hay usuarios para probar');
          return;
        }

        console.log('✅ Usuario de prueba:', testUser.nombre_completo);

        // 4. Probar diferentes escenarios
        const testCases = [
          {
            name: 'Cambiar a gerente con establecimiento',
            data: {
              userId: testUser.id,
              rolId: 2,
              establecimientoId: 1
            }
          },
          {
            name: 'Cambiar a jefe de zona con múltiples establecimientos',
            data: {
              userId: testUser.id,
              rolId: 3,
              establecimientosSeleccionados: [1, 2, 3]
            }
          },
          {
            name: 'Cambiar a admin (sin establecimiento)',
            data: {
              userId: testUser.id,
              rolId: 1
            }
          }
        ];

        for (const testCase of testCases) {
          console.log(`\n🧪 Probando: ${testCase.name}`);
          console.log('📤 Datos enviados:', JSON.stringify(testCase.data, null, 2));

          const response = await fetch('http://localhost:5000/auth/usuarios/update-role', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(testCase.data)
          });

          console.log(`📥 Status: ${response.status}`);
          
          const responseData = await response.json();
          console.log('📥 Response:', JSON.stringify(responseData, null, 2));
        }

        db.close();
      });
    });

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

testUpdateRole(); 