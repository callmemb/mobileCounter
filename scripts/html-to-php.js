const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function swapHtmlToPHP() {
  console.log('🔄 Converting HTML files to PHP...');
  
  try {
    // Find all HTML files in the out directory
    const htmlFiles = await glob('out/**/*.html');
    
    for (const htmlFile of htmlFiles) {
      const phpFile = htmlFile.replace('.html', '.php');
      
      // Read the HTML content
      const content = fs.readFileSync(htmlFile, 'utf8');
      
      // Write the content to a PHP file
      fs.writeFileSync(phpFile, content);
      
      // Remove the original HTML file
      fs.unlinkSync(htmlFile);
      
      console.log(`✅ Converted: ${path.basename(htmlFile)} → ${path.basename(phpFile)}`);
    }
    
    console.log('✨ HTML to PHP conversion completed successfully!');
  } catch (error) {
    console.error('❌ Error converting HTML to PHP:', error);
    process.exit(1);
  }
}

swapHtmlToPHP();