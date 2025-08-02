import React, { useState } from 'react';
import './Usuarios.css';

const Usuarios = ({ usuarios, setUsuarios, roles, establecimientos }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAction = async (action, userId) => {
    setLoading(true);
    setMessage('');

    try {
                                const response = await fetch(`/login-api/usuarios/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        // Actualizar la lista de usuarios
        const updatedUsuarios = usuarios.map(user => {
          if (user.id === userId) {
            if (action === 'delete') {
              return null; // Eliminar de la lista
            } else if (action === 'blanquear') {
              return { ...user, password_reset: true };
            } else if (action === 'bloquear') {
              return { ...user, activo: !user.activo };
            }
          }
          return user;
        }).filter(Boolean); // Remover usuarios eliminados

        setUsuarios(updatedUsuarios);
      } else {
        setMessage(data.error || 'Error en la operación');
      }
    } catch (error) {
      setMessage('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const getRolName = (rolId) => {
    const rol = roles.find(r => r.id === rolId);
    return rol ? rol.nombre : 'N/A';
  };

  const getEstablecimientoName = (estId) => {
    const est = establecimientos.find(e => e.id === estId);
    return est ? est.nombre : 'N/A';
  };

  return (
    <div className="usuarios-container">
      <h3>Gestión de Usuarios</h3>
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="usuarios-table">
        <table>
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Función</th>
              <th>Establecimiento</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.dni}</td>
                <td>{usuario.nombre_completo}</td>
                <td>{usuario.email}</td>
                <td>{usuario.funcion}</td>
                <td>{getEstablecimientoName(usuario.establecimiento_id)}</td>
                <td>{getRolName(usuario.rol_id)}</td>
                <td>
                  <span className={`status ${usuario.activo ? 'activo' : 'bloqueado'}`}>
                    {usuario.activo ? 'Activo' : 'Bloqueado'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleAction('blanquear', usuario.id)}
                      disabled={loading}
                      className="action-btn blanquear"
                      title="Blanquear contraseña"
                    >
                      🔄
                    </button>
                    <button
                      onClick={() => handleAction('bloquear', usuario.id)}
                      disabled={loading}
                      className={`action-btn ${usuario.activo ? 'bloquear' : 'desbloquear'}`}
                      title={usuario.activo ? 'Bloquear usuario' : 'Desbloquear usuario'}
                    >
                      {usuario.activo ? '🔒' : '🔓'}
                    </button>
                    <button
                      onClick={() => handleAction('delete', usuario.id)}
                      disabled={loading}
                      className="action-btn eliminar"
                      title="Eliminar usuario"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuarios.length === 0 && (
        <div className="no-data">
          <p>No hay usuarios registrados</p>
        </div>
      )}
    </div>
  );
};

export default Usuarios; 