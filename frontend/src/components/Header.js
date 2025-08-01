import React from 'react';
import logoSDO from '../logoo.png';

const Header = ({ user, onLogout }) => {
  return (
    <div className="header-container">
      <div className="header-logo">
        <img src={logoSDO} alt="Logo SDO" />
        <div className="header-title">TABLERO / S.D.O.</div>
      </div>
      
      {user && (
        <div className="header-user">
          <div className="user-info">
            <div className="user-name">{user.nombre_completo}</div>
            <div className="user-establishment">{user.establecimiento}</div>
            <div className="user-role">{user.rol}</div>
          </div>
          <button 
            onClick={onLogout}
            className="logout-button"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default Header; 