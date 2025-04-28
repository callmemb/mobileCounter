const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const glob = require("glob");

// This script runs after the build to:
// 1. Generate SHA-384 hashes for all internal scripts
// 2. Add integrity attributes to internal scripts
// 3. Update the .htaccess file with CSP hashes for internal scripts
// 4. Display a list of all external scripts found

const projectDir = "dist"; // The directory where the build output is located
const HASH_ALGORITHM = 'sha384'; // Use the same algorithm throughout
const CSP_PLACEHOLDER = '@generated-csp-hashes@'; // Placeholder in .htaccess

async function generateScriptHashes() {
  console.log("Processing internal scripts for CSP and SRI...");

  // First check if the placeholder exists in .htaccess
  const htaccessPath = path.join(process.cwd(), projectDir, ".htaccess");
  
  // Store all external script URLs for displaying at the end
  const externalScripts = new Set();

  try {
    const htaccessContent = fs.readFileSync(htaccessPath, 'utf-8');
    
    // Check if we have a placeholder to replace
    if (!htaccessContent.includes(CSP_PLACEHOLDER)) {
      console.error(`\x1b[31mError: Placeholder "${CSP_PLACEHOLDER}" not found in .htaccess file.\x1b[0m`);
      console.error('Please add the placeholder in your .htaccess file in the script-src directive.');
      console.error(`Example: script-src 'self' ${CSP_PLACEHOLDER};`);
      process.exit(1);
    }
    
    // Look for all HTML files in the out directory
    const htmlFiles = glob.sync(
      path.join(process.cwd(), projectDir, "**/*.html"),
    );
    const scriptHashes = new Set();
    
    // Log how many HTML files we're processing
    console.log(`Processing ${htmlFiles.length} HTML files for scripts...`);

    // Regular expression to match inline scripts without src attribute
    const inlineScriptRegex = /<script(?!\s*src=)(?:[^>]*)>([\s\S]*?)<\/script>/gim;
    
    // Regular expression to match external scripts with src attribute
    const externalScriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>[\s\S]*?<\/script>/gim;
    
    // Regular expression to match preloaded script resources
    const preloadScriptRegex = /<link[^>]*rel=["']preload["'][^>]*as=["']script["'][^>]*href=["']([^"']+)["'][^>]*>/gim;

    // Process each HTML file
    for (const file of htmlFiles) {
      let content = fs.readFileSync(file, "utf-8");
      let match;
      let internalScriptsToProcess = [];

      // First, handle inline scripts
      while ((match = inlineScriptRegex.exec(content)) !== null) {
        const fullTag = match[0];
        const scriptContent = match[1];
        
        // Skip empty scripts
        if (!scriptContent || scriptContent.trim() === '') continue;
        
        console.log(`Inline script found in ${path.basename(file)}: ${scriptContent.substring(0, 30)}...`);
        
        // Calculate hash using consistent algorithm
        const hash = crypto
          .createHash(HASH_ALGORITHM)
          .update(scriptContent, 'utf-8')
          .digest("base64");
        
        // Format for CSP directives in .htaccess - needs the single quotes
        const hashString = `'${HASH_ALGORITHM}-${hash}'`;
        scriptHashes.add(hashString);
        
        // No longer adding integrity attribute to inline scripts
        console.log(`Added hash for CSP for inline script: ${hashString}`);
      }

      // Reset regex
      inlineScriptRegex.lastIndex = 0;
      externalScriptRegex.lastIndex = 0;
      preloadScriptRegex.lastIndex = 0;
      
      // Collect internal preloaded scripts and external preload links
      let preloadScriptsToProcess = [];
      while ((match = preloadScriptRegex.exec(content)) !== null) {
        const fullTag = match[0];
        const hrefUrl = match[1];
        
        // Skip if integrity already exists
        if (fullTag.includes('integrity=')) continue;
        
        if (isExternalUrl(hrefUrl)) {
          // Just collect external scripts
          externalScripts.add(hrefUrl);
          console.log(`External preloaded script found in ${path.basename(file)}: ${hrefUrl}`);
        } else {
          console.log(`Internal preloaded script found in ${path.basename(file)}: ${hrefUrl}`);
          preloadScriptsToProcess.push({ fullTag, hrefUrl });
        }
      }

      // Process internal preload links and add integrity attributes
      if (preloadScriptsToProcess.length > 0) {
        for (const { fullTag, hrefUrl } of preloadScriptsToProcess) {
          try {
            const integrity = await generateIntegrityHash(hrefUrl);
            if (integrity) {
              // Preloaded resources need crossorigin attribute
              const newTag = fullTag.replace(/(href=["'][^"']+["'])/g, `$1 integrity="${integrity}" crossorigin="anonymous"`);
              content = content.replace(fullTag, newTag);
              console.log(`Added integrity attribute to preloaded script ${hrefUrl}: ${integrity}`);
              
              // Add the preloaded script hash to our CSP hashes set as well
              const hashWithoutPrefix = integrity.replace('sha384-', '');
              const cspHashFormat = `'sha384-${hashWithoutPrefix}'`;
              scriptHashes.add(cspHashFormat);
              console.log(`Added preloaded script hash to CSP: ${cspHashFormat}`);
            }
          } catch (err) {
            console.error(`Failed to process preloaded script ${hrefUrl}: ${err.message}`);
          }
        }
      }

      // Process script tags and separate internal from external
      while ((match = externalScriptRegex.exec(content)) !== null) {
        const fullTag = match[0];
        const srcUrl = match[1];
        
        // Skip if integrity already exists
        if (fullTag.includes('integrity=')) continue;
        
        if (isExternalUrl(srcUrl)) {
          // Just collect external scripts
          externalScripts.add(srcUrl);
          console.log(`External script found in ${path.basename(file)}: ${srcUrl}`);
        } else {
          console.log(`Internal script found in ${path.basename(file)}: ${srcUrl}`);
          internalScriptsToProcess.push({ fullTag, srcUrl });
        }
      }

      // Process internal scripts and add integrity attributes
      if (internalScriptsToProcess.length > 0) {
        for (const { fullTag, srcUrl } of internalScriptsToProcess) {
          try {
            const integrity = await generateIntegrityHash(srcUrl);
            if (integrity) {
              const newTag = fullTag.replace(/(src=["'][^"']+["'])/g, `$1 integrity="${integrity}"`);
              content = content.replace(fullTag, newTag);
              console.log(`Added integrity attribute to internal script ${srcUrl}: ${integrity}`);
              
              // Add this hash to our CSP hashes set as well
              const hashWithoutPrefix = integrity.replace('sha384-', '');
              const cspHashFormat = `'sha384-${hashWithoutPrefix}'`;
              scriptHashes.add(cspHashFormat);
            }
          } catch (err) {
            console.error(`Failed to process internal script ${srcUrl}: ${err.message}`);
          }
        }
      }

      // Save the changes to the file
      fs.writeFileSync(file, content);
      console.log(`Updated ${path.basename(file)} with integrity attributes`);
    }

    console.log(`Found ${scriptHashes.size} unique internal script hashes for CSP`);

    // Create the updated CSP with script hashes
    const hashesString = Array.from(scriptHashes).join(" ");

    if (hashesString.length > 0) {
      // Replace the placeholder with the hashes
      const updatedHtaccessContent = htaccessContent.replace(CSP_PLACEHOLDER, hashesString);
      
      // Write the updated .htaccess back to the file
      fs.writeFileSync(htaccessPath, updatedHtaccessContent);
      console.log(
        "Updated .htaccess file in the out directory with internal script hashes",
      );
    } else {
      console.log("No internal script hashes found to add to .htaccess");
    }
    
    // Display all external scripts found
    if (externalScripts.size > 0) {
      console.log("\n\x1b[33m=== External Scripts Found ===\x1b[0m");
      Array.from(externalScripts).forEach((url, index) => {
        console.log(`${index + 1}. ${url}`);
      });
      console.log(`\nTotal external scripts: ${externalScripts.size}`);
      console.log("Consider adding these to your CSP script-src directive manually if needed.");
    } else {
      console.log("\nNo external scripts found in your HTML files.");
    }
    
  } catch (error) {
    console.error(
      `\x1b[31mError processing scripts: ${error.message}\x1b[0m`,
    );
    process.exit(1);
  }
}

// Helper function to determine if a URL is external
function isExternalUrl(url) {
  return url.startsWith('http://') || 
         url.startsWith('https://') || 
         url.startsWith('//');
}

// Function to generate integrity hash for a script URL
async function generateIntegrityHash(url) {
  return new Promise((resolve, reject) => {
    // Only process internal URLs
    if (isExternalUrl(url)) {
      console.warn(`Skipping external URL: ${url}`);
      resolve(null);
      return;
    }
    
    // For local files
    try {
      let filePath;
      if (url.startsWith('/')) {
        filePath = path.join(process.cwd(), projectDir, url);
      } else {
        filePath = path.join(process.cwd(), projectDir, url);
      }
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        const hash = crypto.createHash('sha384').update(content).digest('base64');
        resolve(`sha384-${hash}`);
      } else {
        console.warn(`Could not find local file: ${filePath}`);
        resolve(null);
      }
    } catch (err) {
      console.warn(`Error processing local file ${url}: ${err.message}`);
      resolve(null);
    }
  });
}

generateScriptHashes().catch(console.error);
