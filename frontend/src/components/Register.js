import React, { useState, useEffect } from 'react';
import './Auth.css';
import logoSDO from '../logoo.png';
import { API_ENDPOINTS } from '../config/api';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    dni: '',
    nombre_completo: '',
    email: '',
    password: '',
    confirm_password: '',
    funcion: '',
    rol: 'gerente',
    establecimiento_id: '',
    establecimientos_seleccionados: []
  });
  const [establecimientos, setEstablecimientos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingEstablecimientos, setLoadingEstablecimientos] = useState(true);

  // Cargar establecimientos al montar el componente
  useEffect(() => {
    const fetchEstablecimientos = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.ESTABLECIMIENTOS);
        const data = await response.json();
        
        if (data.success) {
          setEstablecimientos(data.establecimientos);
        } else {
          setError('Error al cargar establecimientos');
        }
      } catch (error) {
        setError('Error de conexión al cargar establecimientos');
      } finally {
        setLoadingEstablecimientos(false);
      }
    };

    fetchEstablecimientos();
  }, []);

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

    // Validaciones del lado del cliente
    if (formData.password !== formData.confirm_password) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        onRegister(data.message);
      } else {
        setError(data.error || 'Error en el registro');
      }
    } catch (error) {
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
          <h2>REGISTRO DE USUARIO</h2>
          <p>Completa todos los campos para crear tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="dni">DNI *</label>
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
            <label htmlFor="nombre_completo">Nombre Completo *</label>
            <input
              type="text"
              id="nombre_completo"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              placeholder="Ingresa tu nombre completo"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa tu email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="funcion">Función *</label>
            <input
              type="text"
              id="funcion"
              name="funcion"
              value={formData.funcion}
              onChange={handleChange}
              placeholder="Ej: Médico, Enfermero, Administrativo"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rol">Rol *</label>
            <select
              id="rol"
              name="rol"
              value="gerente"
              disabled
              style={{backgroundColor: '#f5f5f5', color: '#666'}}
            >
              <option value="gerente">Gerente (1 establecimiento)</option>
            </select>
            <small style={{color: '#666', fontSize: '0.8rem'}}>
              Solo podrás ver datos de tu establecimiento seleccionado
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="establecimiento_id">Establecimiento *</label>
            <select
              id="establecimiento_id"
              name="establecimiento_id"
              value={formData.establecimiento_id}
              onChange={handleChange}
              required
              disabled={loading || loadingEstablecimientos}
            >
              <option value="">Selecciona tu establecimiento</option>
              {establecimientos.map(est => (
                <option key={est.id} value={est.id}>
                  {est.codigo} - {est.nombre} ({est.zona})
                </option>
              ))}
            </select>
            {loadingEstablecimientos && (
              <small>Cargando establecimientos...</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">Confirmar Contraseña *</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
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
            disabled={loading || loadingEstablecimientos}
          >
            {loading ? 'REGISTRANDO...' : 'REGISTRARSE'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <button 
              type="button" 
              className="link-button"
              onClick={onSwitchToLogin}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 