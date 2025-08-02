// Configuración de URLs de la API
// Usar servidor local en desarrollo, Vercel en producción
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tablero-1.vercel.app'
  : 'http://localhost:3001';

// Configuración para GitHub
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN || '';
const GITHUB_REPO = process.env.REACT_APP_GITHUB_REPO || 'tablero25/tablero-1';
const GITHUB_BRANCH = process.env.REACT_APP_GITHUB_BRANCH || 'main';

// Debug: mostrar qué URL está usando
console.log('🔧 API_BASE_URL:', API_BASE_URL);
console.log('🔧 REACT_APP_API_URL env:', process.env.REACT_APP_API_URL);
console.log('🔧 GITHUB_TOKEN configurado:', GITHUB_TOKEN ? 'SÍ' : 'NO');

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login-api/login`,
  REGISTER: `${API_BASE_URL}/login-api/register`,
  VERIFY: `${API_BASE_URL}/login-api/verify`,
  LOGOUT: `${API_BASE_URL}/login-api/logout`,
  ESTABLECIMIENTOS: `${API_BASE_URL}/login-api/establecimientos`,
  USUARIOS: `${API_BASE_URL}/login-api/usuarios`,
  ROLES: `${API_BASE_URL}/login-api/roles`,
  DELETE_USER: `${API_BASE_URL}/login-api/usuarios/delete`,
  BLANQUEAR_PASSWORD: `${API_BASE_URL}/login-api/usuarios/blanquear`,
  BLOQUEAR_USER: `${API_BASE_URL}/login-api/usuarios/bloquear`,
  UPDATE_ROLE: `${API_BASE_URL}/login-api/usuarios/update-role`,
  CHANGE_PASSWORD: `${API_BASE_URL}/login-api/change-password`,
  // Rutas para archivos Excel
  GUARDAR_ARCHIVO: `${API_BASE_URL}/guardar`,
  LISTAR_ARCHIVOS: `${API_BASE_URL}/archivos`,
  LEER_ARCHIVO: `${API_BASE_URL}/leer`,
  RANKING_GUARDAR: `${API_BASE_URL}/ranking/guardar`,
  RANKING_ARCHIVOS: `${API_BASE_URL}/ranking/archivos`,
  RANKING_LEER: `${API_BASE_URL}/ranking/leer`,
  RANKING_ANALIZAR: `${API_BASE_URL}/ranking/analizar`,
  ESTABLECIMIENTOS_LIST: `${API_BASE_URL}/establecimientos`,
  // Rutas para GitHub
  GITHUB_UPLOAD: `${API_BASE_URL}/api/github/upload`,
  GITHUB_LIST: `${API_BASE_URL}/api/github/list`,
  GITHUB_DOWNLOAD: `${API_BASE_URL}/api/github/download`
};

// Configuración de GitHub
export const GITHUB_CONFIG = {
  token: GITHUB_TOKEN,
  repo: GITHUB_REPO,
  branch: GITHUB_BRANCH,
  apiUrl: 'https://api.github.com'
};

export default API_ENDPOINTS; 