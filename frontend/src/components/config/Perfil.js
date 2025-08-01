import React, { useState } from 'react';
import './Perfil.css';

const Perfil = ({ user }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage(''); // Limpiar mensaje al cambiar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validaciones
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('La nueva contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage(data.error || 'Error al cambiar contraseña');
      }
    } catch (error) {
      setMessage('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="perfil-container">
      <h3>Mi Perfil</h3>
      
      <div className="perfil-info">
        <div className="info-section">
          <h4>Información Personal</h4>
          <div className="info-grid">
            <div className="info-item">
              <label>DNI:</label>
              <span>{user.dni}</span>
            </div>
            <div className="info-item">
              <label>Nombre Completo:</label>
              <span>{user.nombre_completo}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Función:</label>
              <span>{user.funcion}</span>
            </div>
            <div className="info-item">
              <label>Establecimiento:</label>
              <span>{user.establecimiento}</span>
            </div>
            <div className="info-item">
              <label>Rol:</label>
              <span className={`rol-badge ${user.rol}`}>{user.rol}</span>
            </div>
          </div>
        </div>

        <div className="password-section">
          <h4>Cambiar Contraseña</h4>
          
          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Contraseña Actual *</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña actual"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña *</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Nueva Contraseña *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la nueva contraseña"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="change-password-btn"
              disabled={loading}
            >
              {loading ? 'CAMBIANDO CONTRASEÑA...' : 'CAMBIAR CONTRASEÑA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Perfil; 