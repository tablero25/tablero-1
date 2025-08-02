const { uploadToGitHub, listGitHubFiles } = require('./github-upload');
const fs = require('fs');
const path = require('path');

async function testGitHubUpload() {
  console.log('🧪 Probando nueva función de subida a GitHub...');
  
  try {
    // Crear un archivo de prueba
    const testContent = `# Archivo de prueba - Estructura organizada
Este archivo fue subido usando la nueva función de GitHub.

Fecha: ${new Date().toISOString()}
Establecimiento: 53 Angastaco
Año: 2024
Mes: Diciembre

¡La estructura organizada está funcionando correctamente!`;

    const testFilePath = path.join(__dirname, 'test-file-organized.txt');
    fs.writeFileSync(testFilePath, testContent);
    
    console.log('📄 Archivo de prueba creado:', testFilePath);
    
    // Subir archivo a GitHub
    const result = await uploadToGitHub(testFilePath, '53 Angastaco', '2024', 'Diciembre');
    
    if (result.success) {
      console.log('✅ Archivo subido exitosamente!');
      console.log('📁 Nombre:', result.fileName);
      console.log('🔗 URL:', result.downloadUrl);
      console.log('📂 Ruta:', result.path);
      
      // Listar archivos para verificar
      console.log('\n📋 Listando archivos de GitHub...');
      const listResult = await listGitHubFiles('53 Angastaco', '2024');
      
      if (listResult.success) {
        console.log('📁 Archivos encontrados:', listResult.files.length);
        listResult.files.forEach(file => {
          console.log(`  - ${file.name} (${file.size} bytes)`);
        });
      } else {
        console.log('❌ Error listando archivos:', listResult.error);
      }
      
    } else {
      console.log('❌ Error subiendo archivo:', result.error);
    }
    
    // Limpiar archivo de prueba
    fs.unlinkSync(testFilePath);
    console.log('🧹 Archivo de prueba eliminado');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

// Ejecutar la prueba
testGitHubUpload(); 