const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const JWT_SECRET = 'tablero_hospitalario_secret_key_2024';
const dbPath = path.join(__dirname, 'data/tablero_hospitalario.db');

console.log('🧪 PROBANDO CAMBIO A ROL GERENTE SIN ESTABLECIMIENTO\n');

async function testGerenteRole() {
  try {
    const db = new sqlite3.Database(dbPath);
    
    db.get('SELECT * FROM usuarios WHERE dni = ?', ['admin'], async (err, adminUser) => {
      if (err) {
        console.error('❌ Error obteniendo admin:', err);
        return;
      }

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

      db.get('SELECT * FROM usuarios WHERE dni != ? LIMIT 1', ['admin'], async (err, testUser) => {
        if (err) {
          console.error('❌ Error obteniendo usuario de prueba:', err);
          return;
        }

        console.log('✅ Usuario de prueba:', testUser.nombre_completo);
        console.log('   Rol actual:', testUser.rol_id);

        // Probar cambio a gerente sin establecimiento
        const testData = {
          userId: testUser.id,
          rolId: 2 // Gerente
          // Sin establecimientoId
        };

        console.log('🧪 Probando cambio a gerente sin establecimiento');
        console.log('📤 Datos enviados:', JSON.stringify(testData, null, 2));

        const response = await fetch('http://localhost:5000/auth/usuarios/update-role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(testData)
        });

        console.log(`📥 Status: ${response.status}`);
        
        const responseData = await response.json();
        console.log('📥 Response:', JSON.stringify(responseData, null, 2));

        if (response.status === 200) {
          console.log('✅ ¡Cambio a gerente exitoso!');
          
          // Verificar en la base de datos
          db.get('SELECT rol_id, establecimiento_id FROM usuarios WHERE id = ?', [testUser.id], (err, updatedUser) => {
            if (err) {
              console.error('❌ Error verificando usuario actualizado:', err);
            } else {
              console.log('📊 Usuario actualizado en BD:');
              console.log(`   Rol ID: ${updatedUser.rol_id}`);
              console.log(`   Establecimiento ID: ${updatedUser.establecimiento_id}`);
            }
            db.close();
          });
        } else {
          console.log('❌ Error al cambiar a gerente');
          db.close();
        }
      });
    });

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

testGerenteRole(); 