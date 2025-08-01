// Configuración de URLs de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  VERIFY: `${API_BASE_URL}/api/auth/verify`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  ESTABLECIMIENTOS: `${API_BASE_URL}/api/auth/establecimientos`,
  USUARIOS: `${API_BASE_URL}/api/auth/usuarios`,
  ROLES: `${API_BASE_URL}/api/auth/roles`,
  DELETE_USER: `${API_BASE_URL}/api/auth/usuarios/delete`,
  BLANQUEAR_PASSWORD: `${API_BASE_URL}/api/auth/usuarios/blanquear`,
  BLOQUEAR_USER: `${API_BASE_URL}/api/auth/usuarios/bloquear`,
  UPDATE_ROLE: `${API_BASE_URL}/api/auth/usuarios/update-role`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/auth/change-password`,
  // Rutas para archivos Excel
  GUARDAR_ARCHIVO: `${API_BASE_URL}/api/guardar`,
  LISTAR_ARCHIVOS: `${API_BASE_URL}/api/archivos`,
  LEER_ARCHIVO: `${API_BASE_URL}/api/leer`,
  RANKING_GUARDAR: `${API_BASE_URL}/api/ranking/guardar`,
  RANKING_ARCHIVOS: `${API_BASE_URL}/api/ranking/archivos`,
  RANKING_LEER: `${API_BASE_URL}/api/ranking/leer`,
  RANKING_ANALIZAR: `${API_BASE_URL}/api/ranking/analizar`,
  ESTABLECIMIENTOS_LIST: `${API_BASE_URL}/api/establecimientos`
};

export default API_ENDPOINTS; 