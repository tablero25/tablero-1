import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const Auth = ({ onLogin }) => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Detectar la ruta para mostrar el componente correcto
  useEffect(() => {
    if (location.pathname === '/registro') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleLogin = (user) => {
    onLogin(user);
  };

  const handleRegister = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setIsLogin(true);
      setSuccessMessage('');
    }, 3000);
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setSuccessMessage('');
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setSuccessMessage('');
  };

  return (
    <div>
      {isLogin ? (
        <Login 
          onLogin={handleLogin} 
          onSwitchToRegister={switchToRegister}
        />
      ) : (
        <Register 
          onRegister={handleRegister} 
          onSwitchToLogin={switchToLogin}
        />
      )}
      
      {successMessage && (
        <div className="success-message" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          maxWidth: '300px'
        }}>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Auth; 