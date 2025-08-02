import React, { useState, useEffect } from 'react';
import logoSDO from '../logoo.png';
import './Configuracion.css';
import Usuarios from './config/Usuarios';
import Roles from './config/Roles';
import Perfil from './config/Perfil';

const Configuracion = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState(() => {
    // Para gerentes, jefes de zona y directores, mostrar perfil por defecto
    if (user.rol === 'gerente' || user.rol === 'jefe de zona' || user.rol === 'director') {
      return 'perfil';
    }
    // Para admin, mostrar usuarios por defecto
    return 'usuarios';
  });
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [establecimientos, setEstablecimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Solo cargar datos si es admin
        if (user.rol === 'admin') {
          const token = localStorage.getItem('token');
          const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          };

                                const [usuariosRes, rolesRes, establecimientosRes] = await Promise.all([
                        fetch('/login-api/usuarios', { headers }),
                        fetch('/login-api/roles', { headers }),
                        fetch('/login-api/establecimientos')
                      ]);

          const usuariosData = await usuariosRes.json();
          const rolesData = await rolesRes.json();
          const establecimientosData = await establecimientosRes.json();

          if (usuariosData.success) setUsuarios(usuariosData.usuarios);
          if (rolesData.success) setRoles(rolesData.roles);
          if (establecimientosData.success) setEstablecimientos(establecimientosData.establecimientos);
        }
      } catch (error) {
        console.error('Error cargando datos de configuración:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.rol]);

  const renderTabContent = () => {
    if (loading) {
      return <div className="loading">Cargando...</div>;
    }

    switch (activeTab) {
      case 'usuarios':
        return user.rol === 'admin' ? (
          <Usuarios 
            usuarios={usuarios} 
            setUsuarios={setUsuarios}
            roles={roles}
            establecimientos={establecimientos}
          />
        ) : (
          <div className="access-denied">
            <h3>Acceso Denegado</h3>
            <p>No tienes permisos para ver esta sección.</p>
          </div>
        );
      
      case 'roles':
        return user.rol === 'admin' ? (
          <Roles 
            usuarios={usuarios}
            setUsuarios={setUsuarios}
            roles={roles}
            establecimientos={establecimientos}
          />
        ) : (
          <div className="access-denied">
            <h3>Acceso Denegado</h3>
            <p>No tienes permisos para ver esta sección.</p>
          </div>
        );
      
      case 'perfil':
        return <Perfil user={user} />;
      
      default:
        // Para gerentes, jefes de zona y directores, mostrar solo perfil
        if (user.rol === 'gerente' || user.rol === 'jefe de zona' || user.rol === 'director') {
          return <Perfil user={user} />;
        }
        // Para admin, mostrar usuarios por defecto
        return user.rol === 'admin' ? (
          <Usuarios 
            usuarios={usuarios} 
            setUsuarios={setUsuarios}
            roles={roles}
            establecimientos={establecimientos}
          />
        ) : (
          <Perfil user={user} />
        );
    }
  };

  return (
    <div className="config-overlay">
      <div className="config-modal">
        <div className="config-header">
          <img src={logoSDO} alt="Logo SDO" className="config-logo" />
          <h2>CONFIGURACIÓN DEL SISTEMA</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="config-tabs">
          {user.rol === 'admin' && (
            <>
              <button 
                className={`tab-btn ${activeTab === 'usuarios' ? 'active' : ''}`}
                onClick={() => setActiveTab('usuarios')}
              >
                Usuarios
              </button>
              <button 
                className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
                onClick={() => setActiveTab('roles')}
              >
                Roles
              </button>
            </>
          )}
          {(user.rol === 'gerente' || user.rol === 'jefe de zona' || user.rol === 'director') && (
            <button 
              className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
              onClick={() => setActiveTab('perfil')}
            >
              Perfil
            </button>
          )}
        </div>

        <div className="config-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Configuracion; 