const axios = require('axios');
const githubConfig = require('./github-config');

async function testUploadFile() {
  console.log('🧪 Probando subida de archivo a GitHub...');
  
  try {
    const [owner, repo] = githubConfig.GITHUB_REPO.split('/');
    
    // Crear contenido de ejemplo
    const testContent = `# Archivo de prueba
Este es un archivo de prueba subido desde la aplicación Tablero 1.

Fecha: ${new Date().toISOString()}
Repositorio: ${githubConfig.GITHUB_REPO}
Token configurado: ${githubConfig.GITHUB_TOKEN ? 'SÍ' : 'NO'}

¡La integración con GitHub está funcionando correctamente!`;

    // Convertir a base64
    const contentBase64 = Buffer.from(testContent).toString('base64');
    
    // Subir archivo
    const response = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/data/test-file.txt`,
      {
        message: 'Archivo de prueba - Integración GitHub',
        content: contentBase64,
        branch: githubConfig.GITHUB_BRANCH
      },
      {
        headers: {
          'Authorization': `token ${githubConfig.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    console.log('✅ Archivo subido exitosamente!');
    console.log('📁 Nombre:', response.data.content.name);
    console.log('🔗 URL:', response.data.content.html_url);
    console.log('📊 Tamaño:', response.data.content.size, 'bytes');
    console.log('📅 SHA:', response.data.content.sha);
    
    console.log('\n🎉 ¡La integración con GitHub está funcionando perfectamente!');
    console.log('📋 Ahora puedes subir archivos desde tu aplicación.');

  } catch (error) {
    console.log('❌ Error subiendo archivo:');
    console.log('   Mensaje:', error.response?.data?.message || error.message);
    console.log('   Status:', error.response?.status);
    
    if (error.response?.status === 422) {
      console.log('💡 El archivo ya existe, intentando actualizar...');
      // Intentar actualizar el archivo existente
      try {
        const [owner, repo] = githubConfig.GITHUB_REPO.split('/');
        
        // Obtener SHA del archivo existente
        const getResponse = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents/data/test-file.txt`,
          {
            headers: {
              'Authorization': `token ${githubConfig.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json'
            },
            params: { ref: githubConfig.GITHUB_BRANCH }
          }
        );
        
        const testContent = `# Archivo de prueba (Actualizado)
Este archivo fue actualizado desde la aplicación Tablero 1.

Fecha: ${new Date().toISOString()}
Repositorio: ${githubConfig.GITHUB_REPO}
Token configurado: ${githubConfig.GITHUB_TOKEN ? 'SÍ' : 'NO'}

¡La integración con GitHub está funcionando correctamente!`;

        const contentBase64 = Buffer.from(testContent).toString('base64');
        
        const updateResponse = await axios.put(
          `https://api.github.com/repos/${owner}/${repo}/contents/data/test-file.txt`,
          {
            message: 'Actualizar archivo de prueba',
            content: contentBase64,
            sha: getResponse.data.sha,
            branch: githubConfig.GITHUB_BRANCH
          },
          {
            headers: {
              'Authorization': `token ${githubConfig.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );

        console.log('✅ Archivo actualizado exitosamente!');
        console.log('📁 Nombre:', updateResponse.data.content.name);
        console.log('🔗 URL:', updateResponse.data.content.html_url);
        
      } catch (updateError) {
        console.log('❌ Error actualizando archivo:', updateError.response?.data?.message || updateError.message);
      }
    }
  }
}

// Ejecutar la prueba
testUploadFile(); 