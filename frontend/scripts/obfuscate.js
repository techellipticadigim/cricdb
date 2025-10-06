/*
 * Copyright (c) 2024 TechElliptica. All rights reserved.
 * 
 * This software is proprietary and confidential.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * TechElliptica CricketDB - Frontend Obfuscation Script
 * Developed by TechElliptica for student training purposes only.
 */

const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');
const staticDir = path.join(buildDir, 'static/js');

console.log('🔒 TechElliptica CricketDB - Frontend Obfuscation');
console.log('================================================');

// Obfuscation options
const obfuscationOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: 2000,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 5,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['base64'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 4,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
};

// Function to obfuscate JavaScript files
function obfuscateFiles() {
    if (!fs.existsSync(staticDir)) {
        console.log('❌ Build directory not found. Please run "npm run build" first.');
        return;
    }

    const files = fs.readdirSync(staticDir);
    const jsFiles = files.filter(file => file.endsWith('.js'));

    if (jsFiles.length === 0) {
        console.log('❌ No JavaScript files found to obfuscate.');
        return;
    }

    console.log(`📁 Found ${jsFiles.length} JavaScript files to obfuscate...`);

    jsFiles.forEach(file => {
        const filePath = path.join(staticDir, file);
        const originalContent = fs.readFileSync(filePath, 'utf8');
        
        console.log(`🔒 Obfuscating ${file}...`);
        
        try {
            const obfuscatedResult = JavaScriptObfuscator.obfuscate(originalContent, obfuscationOptions);
            const obfuscatedCode = obfuscatedResult.getObfuscatedCode();
            
            // Add copyright notice
            const copyrightNotice = `/*
 * Copyright (c) 2024 TechElliptica. All rights reserved.
 * 
 * This software is proprietary and confidential.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * TechElliptica CricketDB - Educational Training Application
 * Developed by TechElliptica for student training purposes only.
 * 
 * For licensing inquiries, contact: techellipticaeducation@gmail.com
 */\n\n`;
            
            fs.writeFileSync(filePath, copyrightNotice + obfuscatedCode);
            console.log(`✅ Successfully obfuscated ${file}`);
        } catch (error) {
            console.log(`❌ Error obfuscating ${file}:`, error.message);
        }
    });

    console.log('\n🎉 Frontend obfuscation completed!');
    console.log('📝 Copyright notices added to all files.');
    console.log('🔒 Code is now protected against reverse engineering.');
}

// Function to add copyright notices to HTML files
function addCopyrightToHTML() {
    const indexPath = path.join(buildDir, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        let htmlContent = fs.readFileSync(indexPath, 'utf8');
        
        const copyrightNotice = `
<!--
Copyright (c) 2024 TechElliptica. All rights reserved.

This software is proprietary and confidential.
Unauthorized copying, distribution, or use is strictly prohibited.

TechElliptica CricketDB - Educational Training Application
Developed by TechElliptica for student training purposes only.

For licensing inquiries, contact: techellipticaeducation@gmail.com
-->`;
        
        htmlContent = copyrightNotice + htmlContent;
        fs.writeFileSync(indexPath, htmlContent);
        console.log('✅ Copyright notice added to index.html');
    }
}

// Main execution
try {
    obfuscateFiles();
    addCopyrightToHTML();
    console.log('\n🛡️ TechElliptica CricketDB Protection Applied');
    console.log('==============================================');
    console.log('✅ Code obfuscation completed');
    console.log('✅ Copyright notices added');
    console.log('✅ Anti-debugging protection enabled');
    console.log('✅ String array encoding applied');
    console.log('✅ Control flow flattening enabled');
    console.log('\n📧 For licensing inquiries: techellipticaeducation@gmail.com');
} catch (error) {
    console.error('❌ Obfuscation failed:', error);
    process.exit(1);
}
