const fs = require('fs');
const path = require('path');
const axios = require('axios');
const githubConfig = require('./github-config');

const token = githubConfig.GITHUB_TOKEN;
const owner = 'luxios-projects';
const repo = 'tablero-1';

async function syncFilesToReleases() {
  try {
    console.log('🔄 Iniciando sincronización de archivos...');
    
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      console.log('❌ No existe directorio data');
      return;
    }
    
    // Recorrer establecimientos
    const establecimientos = fs.readdirSync(dataDir);
    
    for (const establecimiento of establecimientos) {
      const estDir = path.join(dataDir, establecimiento);
      if (!fs.statSync(estDir).isDirectory()) continue;
      
      // Recorrer años
      const años = fs.readdirSync(estDir);
      
      for (const año of años) {
        const añoDir = path.join(estDir, año);
        if (!fs.statSync(añoDir).isDirectory()) continue;
        
        const tag = `${establecimiento}-${año}`;
        console.log(`📁 Procesando: ${tag}`);
        
        // Crear o actualizar release
        const release = await createOrUpdateRelease(tag);
        
        // Subir archivos
        const archivos = fs.readdirSync(añoDir);
        
        for (const archivo of archivos) {
          const archivoPath = path.join(añoDir, archivo);
          if (fs.statSync(archivoPath).isFile()) {
            await uploadFileToRelease(release.id, archivoPath, archivo);
          }
        }
      }
    }
    
    console.log('✅ Sincronización completada');
  } catch (error) {
    console.error('❌ Error en sincronización:', error);
  }
}

async function createOrUpdateRelease(tag) {
  try {
    // Buscar release existente
    const releasesResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/releases`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    const existingRelease = releasesResponse.data.find(r => r.tag_name === tag);
    
    if (existingRelease) {
      console.log(`📦 Release existente encontrado: ${tag}`);
      return existingRelease;
    }
    
    // Crear nuevo release
    const newReleaseResponse = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/releases`,
      {
        tag_name: tag,
        name: `Release ${tag}`,
        body: `Archivos del establecimiento ${tag.split('-')[0]} para el año ${tag.split('-')[1]}`,
      },
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    console.log(`📦 Nuevo release creado: ${tag}`);
    return newReleaseResponse.data;
  } catch (error) {
    console.error(`❌ Error con release ${tag}:`, error);
    throw error;
  }
}

async function uploadFileToRelease(releaseId, filePath, fileName) {
  try {
    const fileContent = fs.readFileSync(filePath);
    
    // Verificar si el archivo ya existe
    const assetsResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/releases/${releaseId}/assets`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    const existingAsset = assetsResponse.data.find(a => a.name === fileName);
    
    if (existingAsset) {
      // Eliminar asset existente
      await axios.delete(
        `https://api.github.com/repos/${owner}/${repo}/releases/assets/${existingAsset.id}`,
        {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      console.log(`🗑️ Asset eliminado: ${fileName}`);
    }
    
    // Subir nuevo asset
    const assetResponse = await axios.post(
      `https://uploads.github.com/repos/${owner}/${repo}/releases/${releaseId}/assets?name=${fileName}`,
      fileContent,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/octet-stream',
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    console.log(`✅ Archivo subido: ${fileName}`);
    return assetResponse.data;
  } catch (error) {
    console.error(`❌ Error subiendo ${fileName}:`, error);
  }
}

// Ejecutar sincronización
syncFilesToReleases(); 