const readline = require('readline');
const { Client } = require('pg');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function testPostgreSQLConnection() {
  try {
    console.log('🔧 Configuración de PostgreSQL');
    console.log('===============================\n');
    
    // Solicitar credenciales
    const host = await question('Host (localhost): ') || 'localhost';
    const port = await question('Puerto (5432): ') || '5432';
    const database = await question('Base de datos (tablero_hospitalario): ') || 'tablero_hospitalario';
    const user = await question('Usuario (postgres): ') || 'postgres';
    const password = await question('Contraseña: ');
    
    console.log('\n🔄 Probando conexión...');
    
    // Probar conexión
    const client = new Client({
      host,
      port: parseInt(port),
      database,
      user,
      password
    });
    
    await client.connect();
    console.log('✅ Conexión exitosa a PostgreSQL!');
    
    // Verificar tablas existentes
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\n📋 Tablas existentes:');
    if (result.rows.length === 0) {
      console.log('   (No hay tablas creadas)');
    } else {
      result.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    await client.end();
    
    // Guardar configuración
    const config = {
      host,
      port: parseInt(port),
      database,
      user,
      password
    };
    
    console.log('\n💾 Guardando configuración...');
    const fs = require('fs');
    fs.writeFileSync('postgresql-config.json', JSON.stringify(config, null, 2));
    console.log('✅ Configuración guardada en postgresql-config.json');
    
    console.log('\n🎯 Ahora puedes ejecutar la migración con:');
    console.log('   node migrate-to-postgresql.js');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Verifica:');
    console.log('   - PostgreSQL está ejecutándose');
    console.log('   - Las credenciales son correctas');
    console.log('   - La base de datos existe');
  } finally {
    rl.close();
  }
}

function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

testPostgreSQLConnection(); 