const fs = require('fs');
const path = require('path');

// Path to the sitemap.xml file
const projectDir = "out";

const sitemapPath = path.join(process.cwd(), projectDir, "sitemap.xml");

// Format current date to ISO format: YYYY-MM-DDThh:mm:ss+00:00
function getCurrentISODate() {
  const now = new Date();
  return now.toISOString().replace(/\.\d+Z$/, '+00:00');
}

// Read, update, and write the sitemap
try {
  // Read the sitemap file
  let sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  
  // Get current date in the required format
  const currentDate = getCurrentISODate();
  
  // Replace all lastmod dates with current date
  sitemapContent = sitemapContent.replace(
    /<lastmod>.*?<\/lastmod>/g, 
    `<lastmod>${currentDate}</lastmod>`
  );
  
  // Write the updated content back to the file
  fs.writeFileSync(sitemapPath, sitemapContent);
  
  console.log(`✅ Successfully updated all lastmod dates in sitemap.xml to ${currentDate}`);
} catch (error) {
  if (error.code === 'EACCES') {
    console.error(`❌ Permission error: You don't have access to the file.`);
    console.error(`   Try adding executable permissions with: chmod +x ${__filename}`);
    console.error(`   Then run the script with: node ${path.basename(__filename)}`);
  } else {
    console.error(`❌ Error updating sitemap.xml: ${error.message}`);
  }
  process.exit(1);
}