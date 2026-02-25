import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');
const srcGeneratedDir = path.join(__dirname, '../src/generated');
const distGeneratedDir = path.join(distDir, 'generated');

// Copy generated Prisma client to dist
if (fs.existsSync(srcGeneratedDir)) {
    console.log('Copying generated files to dist...');
    if (!fs.existsSync(distGeneratedDir)) {
        fs.mkdirSync(distGeneratedDir, { recursive: true });
    }

    function copyRecursiveSync(src, dest) {
        const exists = fs.existsSync(src);
        const stats = exists && fs.statSync(src);
        const isDirectory = exists && stats.isDirectory();
        if (isDirectory) {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest);
            }
            fs.readdirSync(src).forEach((childItemName) => {
                copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
            });
        } else {
            fs.copyFileSync(src, dest);
        }
    }

    copyRecursiveSync(srcGeneratedDir, distGeneratedDir);
    console.log('Generated files copied to dist successfully.');
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.js')) {
            // Fix imports in .js files
            let content = fs.readFileSync(filePath, 'utf8');

            // Match imports like: from "./module" or from "../module"
            // But NOT from node_modules or files ending with .js
            content = content.replace(
                /from\s+["'](\.[^"']+?)(?<!\.js)["']/g,
                'from "$1.js"'
            );

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed imports in: ${filePath}`);
        }
    });
}

walkDir(distDir);
console.log('All imports have been fixed with .js extensions');
