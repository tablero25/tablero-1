const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Crear directorio data si no existe
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Crear base de datos SQLite
const dbPath = path.join(__dirname, 'data/tablero_hospitalario.db');
const db = new sqlite3.Database(dbPath);

async function setupDatabase() {
  try {
    console.log('🔧 Configurando base de datos SQLite...');
    
    // Crear tablas
    await createTables();
    
    // Insertar datos iniciales
    await insertInitialData();
    
    console.log('🎉 Base de datos configurada exitosamente!');
    console.log('');
    console.log('📋 Información de acceso:');
    console.log('   - Usuario admin: admin');
    console.log('   - Contraseña: admin123');
    console.log('   - Base de datos: SQLite');
    console.log('');
    console.log('🚀 Puedes iniciar el servidor con: npm start');
    
  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error.message);
  } finally {
    db.close();
  }
}

function createTables() {
  return new Promise((resolve, reject) => {
    const tables = [
      `CREATE TABLE IF NOT EXISTS establecimientos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        zona TEXT NOT NULL,
        activo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL,
        descripcion TEXT,
        activo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dni TEXT UNIQUE NOT NULL,
        nombre_completo TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        funcion TEXT NOT NULL,
        establecimiento_id INTEGER,
        rol_id INTEGER,
        activo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (establecimiento_id) REFERENCES establecimientos(id),
        FOREIGN KEY (rol_id) REFERENCES roles(id)
      )`
    ];

    let completed = 0;
    tables.forEach((sql, index) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`❌ Error creando tabla ${index + 1}:`, err.message);
          reject(err);
        } else {
          console.log(`✅ Tabla ${index + 1} creada`);
          completed++;
          if (completed === tables.length) {
            resolve();
          }
        }
      });
    });
  });
}

function insertInitialData() {
  return new Promise((resolve, reject) => {
    // Insertar roles
    const roles = [
      ['admin', 'Administrador del sistema'],
      ['gerente', 'Gerente de establecimiento']
    ];
    
    const insertRole = db.prepare('INSERT OR IGNORE INTO roles (nombre, descripcion) VALUES (?, ?)');
    roles.forEach(role => {
      insertRole.run(role);
    });
    insertRole.finalize();
    
    // Insertar establecimientos
    const establecimientos = [
      // ZONA CENTRO
      ['47', 'Materno Infantil', 'ZONA CENTRO'],
      ['40', 'San Bernardo', 'ZONA CENTRO'],
      ['55', 'Papa Francisco', 'ZONA CENTRO'],
      ['41', 'Señor Del Milagro', 'ZONA CENTRO'],
      ['43', 'Oñativia', 'ZONA CENTRO'],
      ['42', 'Ragone', 'ZONA CENTRO'],
      ['45', 'P.N.A. zona norte', 'ZONA CENTRO'],
      ['56', 'P.N.A. zona sur', 'ZONA CENTRO'],
      ['Centro', 'Centro de Rehabilitación', 'ZONA CENTRO'],
      ['Onco', 'Oncologia', 'ZONA CENTRO'],
      ['Adic', 'Adicciones', 'ZONA CENTRO'],
      ['CUCAI', 'CUCAI', 'ZONA CENTRO'],
      ['Samec', 'Samec', 'ZONA CENTRO'],
      
      // ZONA NORTE
      ['01', 'Colonia Sta. Rosa', 'ZONA NORTE'],
      ['02', 'Pichanal', 'ZONA NORTE'],
      ['03', 'Aguaray', 'ZONA NORTE'],
      ['04', 'Morillo', 'ZONA NORTE'],
      ['07', 'P. Salvador Maza', 'ZONA NORTE'],
      ['08', 'Sta. Victoria Este', 'ZONA NORTE'],
      ['09', 'Embarcación', 'ZONA NORTE'],
      ['11', 'Oran', 'ZONA NORTE'],
      ['12', 'Tartagal', 'ZONA NORTE'],
      ['13', 'Rivadavia', 'ZONA NORTE'],
      ['28', 'Gral. Enrique Mosconi', 'ZONA NORTE'],
      ['31', 'Hipólito Yrigoyen', 'ZONA NORTE'],
      ['44', 'Alto la Sierra', 'ZONA NORTE'],
      ['49', 'Urundel', 'ZONA NORTE'],
      ['51', 'La Unión', 'ZONA NORTE'],
      
      // ZONA SUR
      ['14', 'Las Lajitas', 'ZONA SUR'],
      ['15', 'J. V. González', 'ZONA SUR'],
      ['16', 'El Quebrachal', 'ZONA SUR'],
      ['17', 'El Galpón', 'ZONA SUR'],
      ['18', 'Rosario de la Frontera', 'ZONA SUR'],
      ['19', 'Metan', 'ZONA SUR'],
      ['21', 'El Tala', 'ZONA SUR'],
      ['22', 'Gral. Güemes', 'ZONA SUR'],
      ['23', 'Apolinario Saravia', 'ZONA SUR'],
      ['38', 'El Potrero', 'ZONA SUR'],
      
      // ZONA OESTE
      ['05', 'Sta. Victoria Oeste', 'ZONA OESTE'],
      ['06', 'Iruya', 'ZONA OESTE'],
      ['10', 'Nazareno', 'ZONA OESTE'],
      ['24', 'Cafayate', 'ZONA OESTE'],
      ['25', 'San Carlos', 'ZONA OESTE'],
      ['26', 'Molinos', 'ZONA OESTE'],
      ['27', 'Cachi', 'ZONA OESTE'],
      ['29', 'San Antonio de los Cobres', 'ZONA OESTE'],
      ['30', 'Cerrillos', 'ZONA OESTE'],
      ['32', 'Rosario de Lerma', 'ZONA OESTE'],
      ['33', 'Chicoana', 'ZONA OESTE'],
      ['34', 'El Carril', 'ZONA OESTE'],
      ['35', 'Cnel. Moldes', 'ZONA OESTE'],
      ['36', 'La Viña', 'ZONA OESTE'],
      ['37', 'Guachipas', 'ZONA OESTE'],
      ['39', 'La Caldera', 'ZONA OESTE'],
      ['46', 'Campo Quijano', 'ZONA OESTE'],
      ['48', 'Seclantas', 'ZONA OESTE'],
      ['50', 'La Merced', 'ZONA OESTE'],
      ['52', 'La Poma', 'ZONA OESTE'],
      ['53', 'Angastaco', 'ZONA OESTE']
    ];
    
    const insertEst = db.prepare('INSERT OR IGNORE INTO establecimientos (codigo, nombre, zona) VALUES (?, ?, ?)');
    establecimientos.forEach(est => {
      insertEst.run(est);
    });
    insertEst.finalize();
    
    // Insertar usuario admin
    const adminPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // admin123
    const insertUser = db.prepare('INSERT OR IGNORE INTO usuarios (dni, nombre_completo, email, password, funcion, establecimiento_id, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertUser.run(['admin', 'Administrador del Sistema', 'admin@tablero.com', adminPassword, 'Administrador', 1, 1]);
    insertUser.finalize();
    
    console.log('✅ Datos iniciales insertados');
    resolve();
  });
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 