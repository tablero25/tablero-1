const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/auth';

async function testConfigRoutes() {
  console.log('🧪 PROBANDO RUTAS DE CONFIGURACIÓN\n');

  try {
    // 1. Probar ruta de usuarios
    console.log('1️⃣ Probando GET /auth/usuarios...');
    const usuariosRes = await fetch(`${BASE_URL}/usuarios`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log(`   Status: ${usuariosRes.status}`);
    if (usuariosRes.status === 401) {
      console.log('   ✅ Ruta protegida correctamente (401 Unauthorized)');
    } else {
      console.log(`   ⚠️ Status inesperado: ${usuariosRes.status}`);
    }

    // 2. Probar ruta de roles
    console.log('\n2️⃣ Probando GET /auth/roles...');
    const rolesRes = await fetch(`${BASE_URL}/roles`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log(`   Status: ${rolesRes.status}`);
    if (rolesRes.status === 401) {
      console.log('   ✅ Ruta protegida correctamente (401 Unauthorized)');
    } else {
      console.log(`   ⚠️ Status inesperado: ${rolesRes.status}`);
    }

    // 3. Probar ruta de establecimientos
    console.log('\n3️⃣ Probando GET /auth/establecimientos...');
    const establecimientosRes = await fetch(`${BASE_URL}/establecimientos`);
    console.log(`   Status: ${establecimientosRes.status}`);
    if (establecimientosRes.status === 200) {
      const data = await establecimientosRes.json();
      console.log(`   ✅ Ruta funcionando: ${data.establecimientos?.length || 0} establecimientos`);
    } else {
      console.log(`   ❌ Error: ${establecimientosRes.status}`);
    }

    console.log('\n✅ Pruebas completadas');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

testConfigRoutes(); 