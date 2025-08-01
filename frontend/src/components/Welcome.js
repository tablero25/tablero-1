import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import logoSDO from '../logoo.png';

const Welcome = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Verificar contraseña
    if (password === '2601') {
      // Contraseña correcta, redirigir al login
      setTimeout(() => {
        navigate('/login');
      }, 500);
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(''); // Limpiar error al escribir
  };

  return (
    <div className="welcome-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0073b7 0%, #005a94 100%)',
      display: 'flex',
      flexDirection: 'column',
      color: 'white'
    }}>
      {/* Banner con logo */}
      <div style={{
        background: 'linear-gradient(135deg, #0073b7 0%, #005a94 100%)',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <img 
          src={logoSDO} 
          alt="Logo SDO" 
          style={{
            height: '180px',
            objectFit: 'contain'
          }}
        />
        <div style={{
          textAlign: 'center',
          flex: 1
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 10px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            BIENVENIDO AL
          </h1>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            TABLERO DE CONTROL
          </h2>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'normal',
            margin: '10px 0 0 0',
            opacity: 0.9,
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            INDICADOR DE GESTIÓN
          </h3>
        </div>
        <div style={{ width: '180px' }}></div> {/* Espacio para balance */}
      </div>

      {/* Contenedor centrado para el cuadro de contraseña */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: '20px'
      }}>
        {/* Cuadro de contraseña */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '400px',
          width: '100%'
        }}>
        <h3 style={{
          textAlign: 'center',
          margin: '0 0 20px 0',
          fontSize: '1.3rem',
          fontWeight: 'bold'
        }}>
          INGRESE LA CONTRASEÑA
        </h3>

        <form onSubmit={handlePasswordSubmit}>
          <div style={{
            marginBottom: '20px'
          }}>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Contraseña"
              style={{
                width: '100%',
                padding: '12px 15px',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              disabled={loading}
            />
            {error && (
              <div style={{
                color: '#ff6b6b',
                fontSize: '0.9rem',
                marginTop: '8px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: 'none',
              background: loading ? '#666' : '#4CAF50',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase'
            }}
          >
            {loading ? 'VERIFICANDO...' : 'ACCEDER'}
          </button>
        </form>
      </div>

      {/* Información adicional */}
      <div style={{
        marginTop: '30px',
        textAlign: 'center',
        opacity: 0.8,
        fontSize: '0.9rem'
      }}>
                 <p>Sistema de Gestión Hospitalaria</p>
         <p>Ministerio de Salud Pública - Salta</p>
       </div>
       </div>
     </div>
   );
 };

export default Welcome; 