const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Cambiar según tu configuración
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔧 Configurando base de datos...');
    
    // Conectar sin especificar base de datos
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    console.log('✅ Conexión a MySQL establecida');
    
    // Leer archivo SQL
    const sqlFile = path.join(__dirname, 'database.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Dividir el SQL en comandos individuales
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);
    
    console.log(`📝 Ejecutando ${commands.length} comandos SQL...`);
    
    // Ejecutar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          await connection.execute(command);
          console.log(`✅ Comando ${i + 1}/${commands.length} ejecutado`);
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            console.log(`⚠️ Comando ${i + 1}/${commands.length} - Entrada duplicada (ignorado)`);
          } else {
            console.error(`❌ Error en comando ${i + 1}/${commands.length}:`, error.message);
          }
        }
      }
    }
    
    console.log('🎉 Base de datos configurada exitosamente!');
    console.log('');
    console.log('📋 Información de acceso:');
    console.log('   - Usuario admin: admin');
    console.log('   - Contraseña: admin123');
    console.log('   - Base de datos: tablero_hospitalario');
    console.log('');
    console.log('🚀 Puedes iniciar el servidor con: npm start');
    
  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error.message);
    console.log('');
    console.log('💡 Verifica que:');
    console.log('   1. MySQL esté instalado y ejecutándose');
    console.log('   2. Las credenciales en config/database.js sean correctas');
    console.log('   3. El usuario tenga permisos para crear bases de datos');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 