const express = require('express');
const router = express.Router();
const axios = require('axios');

// Configuración de GitHub
const githubConfig = require('../github-config');
const GITHUB_TOKEN = githubConfig.GITHUB_TOKEN;
const GITHUB_REPO = githubConfig.GITHUB_REPO;
const GITHUB_BRANCH = githubConfig.GITHUB_BRANCH;

// Función para obtener el SHA del archivo si existe
async function getFileSHA(owner, repo, path, branch = 'main') {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        params: { ref: branch }
      }
    );
    return response.data.sha;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // Archivo no existe
    }
    throw error;
  }
}

// Función para crear o actualizar archivo en GitHub
async function uploadToGitHub(owner, repo, path, content, message, branch = 'main') {
  try {
    const sha = await getFileSHA(owner, repo, path, branch);
    
    const data = {
      message: message,
      content: content,
      branch: branch
    };

    if (sha) {
      data.sha = sha; // Actualizar archivo existente
    }

    const response = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      data,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading to GitHub:', error.response?.data || error.message);
    throw error;
  }
}

// Función para listar archivos de GitHub
async function listGitHubFiles(owner, repo, path = '', branch = 'main') {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        params: { ref: branch }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error listing GitHub files:', error.response?.data || error.message);
    throw error;
  }
}

// Función para descargar archivo de GitHub
async function downloadFromGitHub(owner, repo, path, branch = 'main') {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        params: { ref: branch }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error downloading from GitHub:', error.response?.data || error.message);
    throw error;
  }
}

// Ruta para subir archivo a GitHub
router.post('/upload', async (req, res) => {
  try {
    const { filename, content, message = 'Upload file via API' } = req.body;
    
    if (!filename || !content) {
      return res.status(400).json({ 
        error: 'Se requiere filename y content' 
      });
    }

    if (!GITHUB_TOKEN) {
      return res.status(500).json({ 
        error: 'Token de GitHub no configurado' 
      });
    }

    const [owner, repo] = GITHUB_REPO.split('/');
    const path = `data/${filename}`;

    const result = await uploadToGitHub(owner, repo, path, content, message, GITHUB_BRANCH);

    res.json({
      success: true,
      message: 'Archivo subido exitosamente a GitHub',
      data: result
    });

  } catch (error) {
    console.error('Error en upload:', error);
    res.status(500).json({
      error: 'Error al subir archivo a GitHub',
      details: error.response?.data || error.message
    });
  }
});

// Ruta para listar archivos de GitHub
router.get('/list', async (req, res) => {
  try {
    const { path = '' } = req.query;
    
    if (!GITHUB_TOKEN) {
      return res.status(500).json({ 
        error: 'Token de GitHub no configurado' 
      });
    }

    const [owner, repo] = GITHUB_REPO.split('/');
    const fullPath = path ? `data/${path}` : 'data';

    const files = await listGitHubFiles(owner, repo, fullPath, GITHUB_BRANCH);

    res.json({
      success: true,
      files: files
    });

  } catch (error) {
    console.error('Error en list:', error);
    res.status(500).json({
      error: 'Error al listar archivos de GitHub',
      details: error.response?.data || error.message
    });
  }
});

// Ruta para descargar archivo de GitHub
router.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!GITHUB_TOKEN) {
      return res.status(500).json({ 
        error: 'Token de GitHub no configurado' 
      });
    }

    const [owner, repo] = GITHUB_REPO.split('/');
    const path = `data/${filename}`;

    const fileData = await downloadFromGitHub(owner, repo, path, GITHUB_BRANCH);

    // Decodificar el contenido base64
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');

    res.json({
      success: true,
      filename: filename,
      content: content,
      size: fileData.size,
      sha: fileData.sha
    });

  } catch (error) {
    console.error('Error en download:', error);
    res.status(500).json({
      error: 'Error al descargar archivo de GitHub',
      details: error.response?.data || error.message
    });
  }
});

module.exports = router; 