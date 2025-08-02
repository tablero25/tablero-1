const axios = require('axios');
const fs = require('fs');
const path = require('path');
const githubConfig = require('./github-config');

// Función para subir archivo a GitHub con estructura organizada
async function uploadToGitHub(filePath, establecimiento, anio, mes = null) {
  try {
    console.log('🚀 Iniciando subida a GitHub...');
    console.log('📁 Archivo:', filePath);
    console.log('🏥 Establecimiento:', establecimiento);
    console.log('📅 Año:', anio);
    console.log('📆 Mes:', mes);

    const [owner, repo] = githubConfig.GITHUB_REPO.split('/');
    
    // Leer el archivo
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    
    // Crear ruta en GitHub
    let githubPath;
    if (mes) {
      githubPath = `data/${establecimiento}/${anio}/${mes}/${fileName}`;
    } else {
      githubPath = `data/${establecimiento}/${anio}/${fileName}`;
    }
    
    console.log('📂 Ruta en GitHub:', githubPath);
    
    // Verificar si el archivo ya existe para obtener SHA
    let sha = null;
    try {
      const existingFileResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${githubPath}`,
        {
          headers: {
            'Authorization': `token ${githubConfig.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          },
          params: { ref: githubConfig.GITHUB_BRANCH }
        }
      );
      sha = existingFileResponse.data.sha;
      console.log('🔄 Archivo existente, se actualizará');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('🆕 Archivo nuevo, se creará');
      } else {
        throw error;
      }
    }
    
    // Convertir a base64
    const contentBase64 = fileContent.toString('base64');
    
    // Preparar datos para subir
    const uploadData = {
      message: `Subir archivo: ${fileName} - Establecimiento: ${establecimiento} - Año: ${anio}${mes ? ` - Mes: ${mes}` : ''}`,
      content: contentBase64,
      branch: githubConfig.GITHUB_BRANCH
    };
    
    if (sha) {
      uploadData.sha = sha;
    }
    
    // Subir archivo
    const response = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${githubPath}`,
      uploadData,
      {
        headers: {
          'Authorization': `token ${githubConfig.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    console.log('✅ Archivo subido exitosamente a GitHub!');
    console.log('📁 Nombre:', response.data.content.name);
    console.log('🔗 URL:', response.data.content.html_url);
    console.log('📊 Tamaño:', response.data.content.size, 'bytes');
    
    return {
      success: true,
      downloadUrl: response.data.content.html_url,
      fileName: fileName,
      path: githubPath
    };
    
  } catch (error) {
    console.error('❌ Error subiendo a GitHub:', error.response?.data?.message || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

// Función para listar archivos de GitHub por establecimiento
async function listGitHubFiles(establecimiento = null, anio = null, mes = null) {
  try {
    const [owner, repo] = githubConfig.GITHUB_REPO.split('/');
    
    let path = 'data';
    if (establecimiento) {
      path += `/${establecimiento}`;
      if (anio) {
        path += `/${anio}`;
        if (mes) {
          path += `/${mes}`;
        }
      }
    }
    
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${githubConfig.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        params: { ref: githubConfig.GITHUB_BRANCH }
      }
    );
    
    return {
      success: true,
      files: response.data
    };
    
  } catch (error) {
    console.error('❌ Error listando archivos de GitHub:', error.response?.data?.message || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

module.exports = {
  uploadToGitHub,
  listGitHubFiles
}; 