const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Crear base de datos SQLite
const dbPath = path.join(__dirname, 'data/tablero_hospitalario.db');
const db = new sqlite3.Database(dbPath);

async function fixAdmin() {
  try {
    console.log('🔧 Verificando y corrigiendo usuario admin...');
    
    // Verificar si existe el usuario admin
    db.get('SELECT * FROM usuarios WHERE dni = ?', ['admin'], async (err, user) => {
      if (err) {
        console.error('❌ Error verificando usuario admin:', err.message);
        return;
      }
      
      if (!user) {
        console.log('❌ Usuario admin no existe. Creando...');
        await createAdmin();
      } else {
        console.log('✅ Usuario admin existe. Verificando contraseña...');
        await verifyAndFixPassword(user);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function createAdmin() {
  return new Promise((resolve, reject) => {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    const insertUser = db.prepare(`
      INSERT INTO usuarios (dni, nombre_completo, email, password, funcion, establecimiento_id, rol_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertUser.run([
      'admin', 
      'Administrador del Sistema', 
      'admin@tablero.com', 
      hashedPassword, 
      'Administrador', 
      1, 
      1
    ], function(err) {
      if (err) {
        console.error('❌ Error creando admin:', err.message);
        reject(err);
      } else {
        console.log('✅ Usuario admin creado exitosamente');
        console.log('📋 Credenciales: admin / admin123');
        resolve();
      }
      insertUser.finalize();
    });
  });
}

async function verifyAndFixPassword(user) {
  return new Promise((resolve, reject) => {
    // Verificar si la contraseña actual funciona
    const isValid = bcrypt.compareSync('admin123', user.password);
    
    if (!isValid) {
      console.log('❌ Contraseña incorrecta. Actualizando...');
      
      const newHashedPassword = bcrypt.hashSync('admin123', 10);
      
      const updateUser = db.prepare(`
        UPDATE usuarios 
        SET password = ? 
        WHERE dni = ?
      `);
      
      updateUser.run([newHashedPassword, 'admin'], function(err) {
        if (err) {
          console.error('❌ Error actualizando contraseña:', err.message);
          reject(err);
        } else {
          console.log('✅ Contraseña actualizada exitosamente');
          console.log('📋 Credenciales: admin / admin123');
          resolve();
        }
        updateUser.finalize();
      });
    } else {
      console.log('✅ Contraseña correcta');
      console.log('📋 Credenciales: admin / admin123');
      resolve();
    }
  });
}

// Ejecutar
fixAdmin().then(() => {
  console.log('🎉 Verificación completada');
  db.close();
}).catch(err => {
  console.error('❌ Error:', err.message);
  db.close();
}); 