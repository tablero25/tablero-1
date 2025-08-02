const axios = require('axios');
const githubConfig = require('./github-config');

async function testGitHubConnection() {
  console.log('🔧 Probando conexión con GitHub...');
  console.log('📋 Token configurado:', githubConfig.GITHUB_TOKEN ? 'SÍ' : 'NO');
  console.log('📁 Repositorio:', githubConfig.GITHUB_REPO);
  console.log('🌿 Rama:', githubConfig.GITHUB_BRANCH);

  try {
    // Probar acceso al repositorio
    const [owner, repo] = githubConfig.GITHUB_REPO.split('/');
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          'Authorization': `token ${githubConfig.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    console.log('✅ Conexión exitosa con GitHub!');
    console.log('📊 Repositorio:', response.data.full_name);
    console.log('🔗 URL:', response.data.html_url);
    console.log('📅 Creado:', response.data.created_at);

    // Probar listar contenido de la carpeta data
    try {
      const contentsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/data`,
        {
          headers: {
            'Authorization': `token ${githubConfig.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      console.log('✅ Carpeta data accesible');
      console.log('📁 Archivos encontrados:', contentsResponse.data.length);
      
      if (contentsResponse.data.length > 0) {
        console.log('📋 Archivos:');
        contentsResponse.data.forEach(file => {
          console.log(`  - ${file.name} (${file.size} bytes)`);
        });
      }

    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('ℹ️ La carpeta data no existe aún, se creará automáticamente');
      } else {
        console.log('❌ Error al acceder a la carpeta data:', error.response?.data?.message || error.message);
      }
    }

  } catch (error) {
    console.log('❌ Error de conexión con GitHub:');
    console.log('   Mensaje:', error.response?.data?.message || error.message);
    console.log('   Status:', error.response?.status);
    
    if (error.response?.status === 401) {
      console.log('💡 El token puede ser inválido o haber expirado');
    } else if (error.response?.status === 404) {
      console.log('💡 El repositorio no existe o no tienes acceso');
    }
  }
}

// Ejecutar la prueba
testGitHubConnection(); 