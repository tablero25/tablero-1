import React, { useState } from 'react';
import './Auth.css';
import logoSDO from '../logoo.png';
import { API_ENDPOINTS } from '../config/api';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    dni: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar error al cambiar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔍 Enviando datos de login:', formData);

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('📊 Respuesta del servidor:', response.status, response.statusText);

      const data = await response.json();
      console.log('📋 Datos de respuesta:', data);

      if (data.success) {
        // Guardar token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.error || 'Error en el login');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <img src={logoSDO} alt="Logo SDO" className="auth-logo-top-left" />
      <div className="auth-card">
        <div className="auth-header">
          <h2>INICIAR SESIÓN</h2>
          <p>Ingresa con tu DNI y contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="dni">DNI</label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              placeholder="Ingresa tu DNI"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes cuenta?{' '}
            <button 
              type="button" 
              className="link-button"
              onClick={onSwitchToRegister}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 