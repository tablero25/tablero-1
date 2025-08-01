const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { client } = require('../config/database-postgresql');

const router = express.Router();

const JWT_SECRET = 'tablero_hospitalario_secret_key_2024';

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await client.query('SELECT * FROM usuarios WHERE id = $1 AND activo = true', [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Usuario no válido' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Token inválido' });
  }
};

// Login con DNI
router.post('/login', async (req, res) => {
  try {
    const { dni, password } = req.body;

    if (!dni || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'DNI y contraseña son requeridos' 
      });
    }

    // Buscar usuario por DNI con sus establecimientos asignados
    const result = await client.query(`
      SELECT u.*, r.nombre as rol_nombre 
      FROM usuarios u 
      LEFT JOIN roles r ON u.rol_id = r.id 
      WHERE u.dni = $1 AND u.activo = true
    `, [dni]);

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'DNI o contraseña incorrectos' 
      });
    }

    const user = result.rows[0];

    // Obtener establecimientos asignados para jefe de zona
    let establecimientosAsignados = [];
    if (user.rol_nombre === 'jefe de zona') {
      const establecimientos = await client.query(`
        SELECT e.nombre 
        FROM usuario_establecimientos ue 
        JOIN establecimientos e ON ue.establecimiento_id = e.id 
        WHERE ue.usuario_id = $1
      `, [user.id]);
      establecimientosAsignados = establecimientos.rows.map(e => e.nombre);
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'DNI o contraseña incorrectos' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        dni: user.dni, 
        rol: user.rol_nombre,
        establecimiento: user.establecimiento_nombre
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // No enviar la contraseña en la respuesta
    delete user.password;

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        dni: user.dni,
        nombre_completo: user.nombre_completo,
        email: user.email,
        funcion: user.funcion,
        establecimiento: user.establecimiento_nombre,
        rol: user.rol_nombre,
        establecimientosAsignados: establecimientosAsignados
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Registro de usuarios
router.post('/register', async (req, res) => {
  try {
    const { 
      dni, 
      nombre_completo, 
      email, 
      password, 
      confirm_password, 
      funcion, 
      establecimiento_id,
      establecimientos_seleccionados,
      rol
    } = req.body;

    // Validaciones básicas
    if (!dni || !nombre_completo || !email || !password || !confirm_password || !funcion) {
      return res.status(400).json({ 
        success: false, 
        error: 'Todos los campos son requeridos' 
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Las contraseñas no coinciden' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar si el DNI ya existe
    const existingDni = await client.query('SELECT id FROM usuarios WHERE dni = $1', [dni]);
    if (existingDni.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'El DNI ya está registrado' 
      });
    }

    // Verificar si el email ya existe
    const existingEmail = await client.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'El email ya está registrado' 
      });
    }

    // Determinar rol y validar establecimientos
    let rolId = 2; // Por defecto gerente
    let establecimientosFinal = [];

    if (rol === 'jefe de zona') {
      rolId = 7; // ID del rol jefe de zona
      
      if (!establecimientos_seleccionados || establecimientos_seleccionados.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Debes seleccionar al menos un establecimiento' 
        });
      }

              // Verificar que todos los establecimientos existen
        for (const estId of establecimientos_seleccionados) {
          const establecimiento = await client.query('SELECT id FROM establecimientos WHERE id = $1', [estId]);
          if (establecimiento.rows.length === 0) {
            return res.status(400).json({ 
              success: false, 
              error: `Establecimiento con ID ${estId} no válido` 
            });
          }
        }
      establecimientosFinal = establecimientos_seleccionados;
    } else if (rol === 'director') {
      rolId = 8; // ID del rol director
      // El director no necesita seleccionar establecimientos, tiene acceso a todos
      establecimientosFinal = [];
    } else {
      // Rol gerente - validar un solo establecimiento
      if (!establecimiento_id) {
        return res.status(400).json({ 
          success: false, 
          error: 'Debes seleccionar un establecimiento' 
        });
      }

      const establecimiento = await client.query('SELECT id FROM establecimientos WHERE id = $1', [establecimiento_id]);
      if (establecimiento.rows.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Establecimiento no válido' 
        });
      }
      establecimientosFinal = [establecimiento_id];
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await client.query(`
      INSERT INTO usuarios (dni, nombre_completo, email, password, funcion, rol_id) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `, [dni, nombre_completo, email, hashedPassword, funcion, rolId]);

    // Insertar relaciones con establecimientos (solo para gerente y jefe de zona)
    if (rol !== 'director') {
      for (const estId of establecimientosFinal) {
        await client.query(`
          INSERT INTO usuario_establecimientos (usuario_id, establecimiento_id) 
          VALUES ($1, $2)
        `, [result.rows[0].id, estId]);
      }
    }

    res.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      userId: result.rows[0].id
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Obtener lista de establecimientos
router.get('/establecimientos', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT id, codigo, nombre, zona 
      FROM establecimientos 
      ORDER BY zona, nombre
    `);

    res.json({
      success: true,
      establecimientos: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo establecimientos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Verificar token
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        dni: req.user.dni,
        nombre_completo: req.user.nombre_completo,
        email: req.user.email,
        funcion: req.user.funcion,
        establecimiento_id: req.user.establecimiento_id,
        rol_id: req.user.rol_id
      }
    });
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Logout (opcional, ya que JWT se maneja en el cliente)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
});

// Ruta para obtener usuarios (solo admin)
router.get('/usuarios', authenticateToken, async (req, res) => {
  try {
    if (req.user.rol_id !== 1) { // 1 = admin
      return res.status(403).json({ success: false, error: 'Acceso denegado' });
    }

    const result = await client.query(`
      SELECT u.*, r.nombre as rol_nombre 
      FROM usuarios u 
      LEFT JOIN roles r ON u.rol_id = r.id 
      ORDER BY u.nombre_completo
    `);
    
    res.json({
      success: true,
      usuarios: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Ruta para obtener roles (solo admin)
router.get('/roles', authenticateToken, async (req, res) => {
  try {
    if (req.user.rol_id !== 1) { // 1 = admin
      return res.status(403).json({ success: false, error: 'Acceso denegado' });
    }

    const result = await client.query('SELECT * FROM roles ORDER BY nombre');
    res.json({
      success: true,
      roles: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo roles:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Ruta para eliminar usuario (solo admin)
router.post('/usuarios/delete', authenticateToken, async (req, res) => {
  try {
    if (req.user.rol_id !== 1) { // 1 = admin
      return res.status(403).json({ success: false, error: 'Acceso denegado' });
    }

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'ID de usuario requerido' });
    }

    // No permitir eliminar al propio usuario
    if (userId == req.user.id) {
      return res.status(400).json({ success: false, error: 'No puedes eliminar tu propia cuenta' });
    }

    await client.query('DELETE FROM usuarios WHERE id = $1', [userId]);
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Ruta para blanquear contraseña (solo admin)
router.post('/usuarios/blanquear', authenticateToken, async (req, res) => {
  try {
    if (req.user.rol_id !== 1) { // 1 = admin
      return res.status(403).json({ success: false, error: 'Acceso denegado' });
    }

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'ID de usuario requerido' });
    }

    // Generar nueva contraseña temporal
    const tempPassword = 'temp123';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await client.query('UPDATE usuarios SET password = $1 WHERE id = $2', [hashedPassword, userId]);
    
    res.json({
      success: true,
      message: `Contraseña blanqueada. Nueva contraseña temporal: ${tempPassword}`
    });
  } catch (error) {
    console.error('Error blanqueando contraseña:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Ruta para bloquear/desbloquear usuario (solo admin)
router.post('/usuarios/bloquear', authenticateToken, async (req, res) => {
  try {
    if (req.user.rol_id !== 1) { // 1 = admin
      return res.status(403).json({ success: false, error: 'Acceso denegado' });
    }

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'ID de usuario requerido' });
    }

    // No permitir bloquear al propio usuario
    if (userId == req.user.id) {
      return res.status(400).json({ success: false, error: 'No puedes bloquear tu propia cuenta' });
    }

    // Obtener estado actual
    const user = await client.query('SELECT activo FROM usuarios WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    const newStatus = user.rows[0].activo ? false : true; // PostgreSQL boolean
    const action = newStatus ? 'desbloqueado' : 'bloqueado';

    await client.query('UPDATE usuarios SET activo = $1 WHERE id = $2', [newStatus, userId]);
    
    res.json({
      success: true,
      message: `Usuario ${action} exitosamente`
    });
  } catch (error) {
    console.error('Error cambiando estado de usuario:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Ruta para actualizar rol de usuario (solo admin)
router.post('/usuarios/update-role', authenticateToken, async (req, res) => {
  try {
    if (req.user.rol_id !== 1) { // 1 = admin
      return res.status(403).json({ success: false, error: 'Acceso denegado' });
    }

    const { userId, rolId, establecimientoId, establecimientosSeleccionados } = req.body;
    
    if (!userId || !rolId) {
      return res.status(400).json({ success: false, error: 'ID de usuario y rol requeridos' });
    }

    // Verificar que el rol existe
    const rol = await client.query('SELECT id FROM roles WHERE id = $1', [rolId]);
    if (rol.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Rol no válido' });
    }

    // Validaciones según el rol
    if (rolId == 2) { // Gerente
      // Para gerente, el establecimiento es opcional al cambiar rol
      // Se puede asignar después
      if (establecimientoId) {
        const establecimiento = await client.query('SELECT id FROM establecimientos WHERE id = $1', [establecimientoId]);
        if (establecimiento.rows.length === 0) {
          return res.status(400).json({ success: false, error: 'Establecimiento no válido' });
        }
      }
    } else if (rolId == 7) { // Jefe de zona
      // Para jefe de zona, los establecimientos son opcionales al cambiar rol
      // Se pueden asignar después
      if (establecimientosSeleccionados && establecimientosSeleccionados.length > 0) {
        // Verificar que todos los establecimientos existen
        for (const estId of establecimientosSeleccionados) {
          const establecimiento = await client.query('SELECT id FROM establecimientos WHERE id = $1', [estId]);
          if (establecimiento.rows.length === 0) {
            return res.status(400).json({ success: false, error: `Establecimiento con ID ${estId} no válido` });
          }
        }
      }
    }

    // Actualizar usuario
    await client.query('UPDATE usuarios SET rol_id = $1 WHERE id = $2', [rolId, userId]);

    // Manejar relaciones con establecimientos
    if (rolId == 7) { // Jefe de zona
      // Eliminar relaciones existentes
      await client.query('DELETE FROM usuario_establecimientos WHERE usuario_id = $1', [userId]);
      
      // Insertar nuevas relaciones solo si se proporcionan establecimientos
      if (establecimientosSeleccionados && establecimientosSeleccionados.length > 0) {
        for (const estId of establecimientosSeleccionados) {
          await client.query(`
            INSERT INTO usuario_establecimientos (usuario_id, establecimiento_id) 
            VALUES ($1, $2)
          `, [userId, estId]);
        }
      }
    } else {
      // Para otros roles, eliminar relaciones múltiples
      await client.query('DELETE FROM usuario_establecimientos WHERE usuario_id = $1', [userId]);
    }
    
    res.json({
      success: true,
      message: 'Rol actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando rol:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// Ruta para cambiar contraseña
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Contraseña actual y nueva requeridas' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, req.user.password);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, error: 'Contraseña actual incorrecta' });
    }

    // Hashear nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await client.query('UPDATE usuarios SET password = $1 WHERE id = $2', [hashedNewPassword, req.user.id]);
    
    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

module.exports = { router, authenticateToken }; 