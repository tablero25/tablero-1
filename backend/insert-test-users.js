const { client } = require('./config/database-postgresql');
const bcrypt = require('bcryptjs');

async function insertTestUsers() {
  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL');

    // Verificar si ya existen usuarios
    const existingUsers = await client.query('SELECT COUNT(*) FROM usuarios');
    console.log(`Usuarios existentes: ${existingUsers.rows[0].count}`);

    if (parseInt(existingUsers.rows[0].count) > 0) {
      console.log('Ya existen usuarios en la base de datos');
      return;
    }

    // Obtener roles disponibles
    const roles = await client.query('SELECT * FROM roles');
    console.log('Roles disponibles:', roles.rows);

    // Obtener establecimientos disponibles
    const establecimientos = await client.query('SELECT * FROM establecimientos');
    console.log('Establecimientos disponibles:', establecimientos.rows);

    // Crear usuarios de prueba
    const testUsers = [
      {
        dni: '12345678',
        nombre_completo: 'Administrador Sistema',
        email: 'admin@test.com',
        password: 'admin123',
        funcion: 'Administrador',
        rol_id: 1, // Admin
        activo: true
      },
      {
        dni: '87654321',
        nombre_completo: 'Gerente Test',
        email: 'gerente@test.com',
        password: 'gerente123',
        funcion: 'Gerente',
        rol_id: 2, // Gerente
        activo: true
      },
      {
        dni: '11223344',
        nombre_completo: 'Jefe Zona Test',
        email: 'jefe@test.com',
        password: 'jefe123',
        funcion: 'Jefe de Zona',
        rol_id: 3, // Jefe de Zona
        activo: true
      },
      {
        dni: '44332211',
        nombre_completo: 'Director Test',
        email: 'director@test.com',
        password: 'director123',
        funcion: 'Director',
        rol_id: 4, // Director
        activo: true
      }
    ];

    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      const result = await client.query(
        'INSERT INTO usuarios (dni, nombre_completo, email, password, funcion, rol_id, activo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [user.dni, user.nombre_completo, user.email, hashedPassword, user.funcion, user.rol_id, user.activo]
      );

      console.log(`✅ Usuario creado: ${user.email} (ID: ${result.rows[0].id})`);

      // Asignar establecimientos según el rol
      if (user.rol_id === 1) { // Admin - todos los establecimientos
        for (const establecimiento of establecimientos.rows) {
          await client.query(
            'INSERT INTO usuario_establecimientos (usuario_id, establecimiento_id) VALUES ($1, $2)',
            [result.rows[0].id, establecimiento.id]
          );
        }
      } else if (user.rol_id === 2) { // Gerente - primer establecimiento
        await client.query(
          'INSERT INTO usuario_establecimientos (usuario_id, establecimiento_id) VALUES ($1, $2)',
          [result.rows[0].id, establecimientos.rows[0].id]
        );
      }
    }

    console.log('✅ Usuarios de prueba creados exitosamente');
    
    // Mostrar usuarios creados
    const users = await client.query('SELECT u.*, r.nombre as rol_nombre FROM usuarios u JOIN roles r ON u.rol_id = r.id');
    console.log('Usuarios en la base de datos:');
    users.rows.forEach(user => {
      console.log(`- ${user.email} (${user.rol_nombre})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

insertTestUsers(); 