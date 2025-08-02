import React, { useState } from 'react';
import './Roles.css';

const Roles = ({ usuarios, setUsuarios, roles, establecimientos }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [selectedEstablecimientos, setSelectedEstablecimientos] = useState([]);

  const handleRoleChange = async (userId, newRolId, newEstablecimientoId = null, establecimientosSeleccionados = []) => {
    setLoading(true);
    setMessage('');

    try {
      const requestBody = { 
        userId, 
        rolId: newRolId
      };

      // Si es jefe de zona, enviar múltiples establecimientos
      if (newRolId === 7) { // ID del rol jefe de zona
        requestBody.establecimientosSeleccionados = establecimientosSeleccionados;
      } else if (newRolId === 2) { // Gerente
        requestBody.establecimientoId = newEstablecimientoId;
      }

                                const response = await fetch('/login-api/usuarios/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        // Actualizar la lista de usuarios
        const updatedUsuarios = usuarios.map(user => {
          if (user.id === userId) {
            return { 
              ...user, 
              rol_id: newRolId,
              establecimiento_id: newRolId === 2 ? newEstablecimientoId : null
            };
          }
          return user;
        });
        setUsuarios(updatedUsuarios);
        setEditingUser(null);
        setSelectedEstablecimientos([]);
      } else {
        setMessage(data.error || 'Error al actualizar rol');
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

  const startEditing = (user) => {
    setEditingUser(user.id);
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setSelectedEstablecimientos([]);
  };

  const handleEstablecimientoToggle = (establecimientoId) => {
    setSelectedEstablecimientos(prev => {
      if (prev.includes(establecimientoId)) {
        return prev.filter(id => id !== establecimientoId);
      } else {
        return [...prev, establecimientoId];
      }
    });
  };

  const handleJefeZonaSave = (userId) => {
    if (selectedEstablecimientos.length === 0) {
      setMessage('Debes seleccionar al menos un establecimiento');
      return;
    }
    handleRoleChange(userId, 7, null, selectedEstablecimientos);
  };

  return (
    <div className="roles-container">
      <h3>Gestión de Roles</h3>
      
      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="roles-table">
        <table>
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Rol Actual</th>
              <th>Establecimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.dni}</td>
                <td>{usuario.nombre_completo}</td>
                <td>{usuario.email}</td>
                <td>
                  {editingUser === usuario.id ? (
                    <select 
                      value={usuario.rol_id}
                      onChange={(e) => {
                        const newRolId = parseInt(e.target.value);
                        // No enviar establecimiento automáticamente al cambiar rol
                        // El usuario debe seleccionarlo manualmente
                        if (newRolId === 2) {
                          // Para gerente, solo cambiar el rol, no el establecimiento
                          handleRoleChange(usuario.id, newRolId, null);
                        } else if (newRolId === 7) {
                          // Para jefe de zona, solo cambiar el rol, no enviar establecimientos aún
                          setSelectedEstablecimientos([]);
                          handleRoleChange(usuario.id, newRolId, null);
                        } else {
                          // Para admin, solo cambiar rol
                          handleRoleChange(usuario.id, newRolId, null);
                        }
                      }}
                      disabled={loading}
                      className="role-select"
                    >
                      {roles.map(rol => (
                        <option key={rol.id} value={rol.id}>
                          {rol.nombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="current-role">{getRolName(usuario.rol_id)}</span>
                  )}
                </td>
                <td>
                  {editingUser === usuario.id ? (
                    <div className="establecimiento-selector">
                      {usuario.rol_id === 2 && (
                        <select
                          value={usuario.establecimiento_id || ''}
                          onChange={(e) => {
                            const newEstablecimientoId = parseInt(e.target.value);
                            handleRoleChange(usuario.id, usuario.rol_id, newEstablecimientoId);
                          }}
                          disabled={loading}
                          className="establecimiento-select"
                        >
                          <option value="">Selecciona establecimiento</option>
                          {establecimientos.map(est => (
                            <option key={est.id} value={est.id}>
                              {est.codigo} - {est.nombre} ({est.zona})
                            </option>
                          ))}
                        </select>
                      )}
                                             {usuario.rol_id === 7 && (
                        <div className="establecimientos-multiples">
                          <div className="establecimientos-list">
                            {establecimientos.map(est => (
                              <label key={est.id} className="checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={selectedEstablecimientos.includes(est.id)}
                                  onChange={() => handleEstablecimientoToggle(est.id)}
                                  disabled={loading}
                                />
                                <span>{est.codigo} - {est.nombre} ({est.zona})</span>
                              </label>
                            ))}
                          </div>
                          {selectedEstablecimientos.length === 0 && (
                            <small className="error-text">
                              Debes seleccionar al menos un establecimiento
                            </small>
                          )}
                          <button
                            onClick={() => handleJefeZonaSave(usuario.id)}
                            disabled={loading || selectedEstablecimientos.length === 0}
                            className="save-btn"
                          >
                            Guardar
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                                         <span className="current-establecimiento">
                       {usuario.rol_id === 7 ? 
                         'Múltiples establecimientos' : 
                         getEstablecimientoName(usuario.establecimiento_id)
                       }
                     </span>
                  )}
                </td>
                <td>
                  {editingUser === usuario.id ? (
                    <button
                      onClick={cancelEditing}
                      disabled={loading}
                      className="action-btn cancelar"
                      title="Cancelar edición"
                    >
                      ❌
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(usuario)}
                      disabled={loading}
                      className="action-btn editar"
                      title="Editar rol"
                    >
                      ✏️
                    </button>
                  )}
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

export default Roles; 