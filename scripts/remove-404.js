const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function remove404Files() {
  console.log('🔍 Searching for 404.html files...');
  
  try {
    // Find all 404.html files
    const notFoundFiles = await glob('out/**/404.html');
    
    if (notFoundFiles.length === 0) {
      console.log('✓ No 404.html files found.');
      return;
    }
    
    // Remove each 404.html file
    for (const file of notFoundFiles) {
      fs.unlinkSync(file);
      console.log(`🗑️ Removed: ${file}`);
    }
    
    console.log('✨ All 404.html files have been successfully removed!');
  } catch (error) {
    console.error('❌ Error removing 404.html files:', error);
    process.exit(1);
  }
}

remove404Files();