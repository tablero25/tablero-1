const fs = require('fs');
const path = require('path');
const axios = require('axios');
const githubConfig = require('./github-config');

class GitHubStorage {
  constructor() {
    this.token = githubConfig.GITHUB_TOKEN;
    this.owner = 'luxios-projects'; // Tu username de GitHub
    this.repo = 'tablero-1'; // Tu repositorio
  }

  // Subir archivo a GitHub Releases
  async uploadFile(filePath, fileName, tag = 'v1.0.0') {
    try {
      const fileContent = fs.readFileSync(filePath);
      
      // Crear o actualizar release
      const release = await this.createOrUpdateRelease(tag);
      
      // Subir archivo como asset
      const response = await axios.post(
        `https://uploads.github.com/repos/${this.owner}/${this.repo}/releases/${release.id}/assets?name=${fileName}`,
        fileContent,
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Content-Type': 'application/octet-stream',
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      console.log(`✅ Archivo subido a GitHub: ${fileName}`);
      return {
        success: true,
        downloadUrl: response.data.browser_download_url,
        fileName: fileName
      };
    } catch (error) {
      console.error('❌ Error subiendo a GitHub:', error);
      return { success: false, error: error.message };
    }
  }

  // Crear o actualizar release
  async createOrUpdateRelease(tag) {
    try {
      // Intentar obtener release existente
      const releasesResponse = await axios.get(
        `https://api.github.com/repos/${this.owner}/${this.repo}/releases`,
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      const existingRelease = releasesResponse.data.find(r => r.tag_name === tag);
      
      if (existingRelease) {
        return existingRelease;
      }

      // Crear nuevo release
      const newReleaseResponse = await axios.post(
        `https://api.github.com/repos/${this.owner}/${this.repo}/releases`,
        {
          tag_name: tag,
          name: `Release ${tag}`,
          body: 'Archivos del tablero de control',
        },
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      return newReleaseResponse.data;
    } catch (error) {
      console.error('❌ Error creando release:', error);
      throw error;
    }
  }

  // Listar archivos disponibles
  async listFiles(tag = 'v1.0.0') {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${this.owner}/${this.repo}/releases/tags/${tag}`,
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      return {
        success: true,
        files: response.data.assets.map(asset => ({
          name: asset.name,
          size: asset.size,
          downloadUrl: asset.browser_download_url,
          createdAt: asset.created_at
        }))
      };
    } catch (error) {
      console.error('❌ Error listando archivos:', error);
      return { success: false, error: error.message };
    }
  }

  // Descargar archivo
  async downloadFile(fileName, tag = 'v1.0.0') {
    try {
      const releaseResponse = await axios.get(
        `https://api.github.com/repos/${this.owner}/${this.repo}/releases/tags/${tag}`,
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      const asset = releaseResponse.data.assets.find(a => a.name === fileName);
      
      if (!asset) {
        throw new Error(`Archivo ${fileName} no encontrado`);
      }

      const downloadResponse = await axios.get(asset.url, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/octet-stream',
        },
      });

      return {
        success: true,
        data: downloadResponse.data,
        fileName: fileName
      };
    } catch (error) {
      console.error('❌ Error descargando archivo:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = GitHubStorage; 