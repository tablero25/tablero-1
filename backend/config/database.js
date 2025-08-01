const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Cambiar según tu configuración
  database: 'tablero_hospitalario',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a la base de datos establecida');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error.message);
    return false;
  }
}

// Función para ejecutar consultas
async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Error en consulta SQL:', error);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  query
}; 