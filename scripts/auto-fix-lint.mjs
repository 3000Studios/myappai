import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixes = [
  // Fix catch (error: any) -> catch (error: unknown)
  {
    pattern: /catch\s*\(\s*(\w+)\s*:\s*any\s*\)/g,
    replacement: 'catch ($1: unknown)',
    description: 'Fix catch error any types',
  },
  // Fix Record<string, any> -> Record<string, unknown>
  {
    pattern: /Record<string,\s*any>/g,
    replacement: 'Record<string, unknown>',
    description: 'Fix Record any types',
  },
  // Fix unused error variables in catch blocks
  {
    pattern: /}\s*catch\s*\(\s*error\s*\)\s*{\s*\n/g,
    replacement: '} catch (_error) {\n',
    description: 'Prefix unused error variables with underscore',
  },
  {
    pattern: /}\s*catch\s*\(\s*e\s*\)\s*{\s*\n/g,
    replacement: '} catch (_e) {\n',
    description: 'Prefix unused e variables with underscore',
  },
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    fixes.forEach((fix) => {
      const before = content;
      content = content.replace(fix.pattern, fix.replacement);
      if (content !== before) {
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (err) {
    console.error(`✗ Error processing ${filePath}:`, err.message);
    return false;
  }
}

function walkDir(dir, filePattern = /\.(ts|tsx)$/) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch {
      return;
    }

    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        fixedCount += walkDir(filePath, filePattern);
      }
    } else if (filePattern.test(file)) {
      if (processFile(filePath)) {
        fixedCount++;
      }
    }
  });

  return fixedCount;
}

// Run the fixer
console.log('🔧 Starting auto-fix...\n');
const rootDir = path.join(__dirname, '..');
const fixedFiles = walkDir(rootDir);
console.log(`\n✅ Fixed ${fixedFiles} files`);
