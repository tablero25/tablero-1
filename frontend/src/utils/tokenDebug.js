// Utilidad para debuggear el manejo del token
export const tokenDebug = {
  // Verificar el estado actual del localStorage
  checkTokenStatus: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('🔍 === DEBUG TOKEN ===');
    console.log('Token presente:', token ? 'SÍ' : 'NO');
    console.log('Usuario presente:', user ? 'SÍ' : 'NO');
    
    if (token) {
      console.log('Token (primeros 20 chars):', token.substring(0, 20) + '...');
    }
    
    if (user) {
      try {
        const userObj = JSON.parse(user);
        console.log('Usuario:', userObj);
      } catch (e) {
        console.log('Error parseando usuario:', e);
      }
    }
    
    console.log('=====================');
    
    return { token, user };
  },
  
  // Limpiar localStorage
  clearStorage: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🧹 localStorage limpiado');
  },
  
  // Simular login exitoso
  simulateLogin: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    console.log('✅ Login simulado');
  },
  
  // Verificar si el token es válido
  isTokenValid: (token) => {
    if (!token) return false;
    
    // Verificar formato básico del token
    if (token.startsWith('eyJ') || token.startsWith('ghp_') || token.startsWith('github_pat_')) {
      return true;
    }
    
    return false;
  }
};

// Función para verificar el token en cada carga de página
export const verifyTokenOnLoad = () => {
  const { token, user } = tokenDebug.checkTokenStatus();
  
  if (!token || !user) {
    console.log('⚠️ No hay token o usuario, redirigiendo a login');
    return false;
  }
  
  if (!tokenDebug.isTokenValid(token)) {
    console.log('❌ Token inválido, limpiando localStorage');
    tokenDebug.clearStorage();
    return false;
  }
  
  console.log('✅ Token válido encontrado');
  return true;
};

export default tokenDebug; 