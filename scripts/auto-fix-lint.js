// Auto-fix script for common ESLint issues
const fs = require('fs');
const path = require('path');

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
  // Fix function params (param: any) -> (param: unknown)
  {
    pattern: /\(\s*(\w+)\s*:\s*any\s*\)/g,
    replacement: '($1: unknown)',
    description: 'Fix function parameter any types',
  },
  // Fix unused error variables in catch blocks
  {
    pattern: /catch\s*\(\s*error\s*\)\s*{/g,
    replacement: 'catch (_error) {',
    description: 'Prefix unused error variables with underscore',
  },
  {
    pattern: /catch\s*\(\s*e\s*\)\s*{/g,
    replacement: 'catch (_e) {',
    description: 'Prefix unused e variables with underscore',
  },
  // Fix unescaped quotes in JSX
  {
    pattern: />\s*"([^"<>]+)"\s*</g,
    replacement: '>&quot;$1&quot;<',
    description: 'Escape double quotes in JSX',
  },
  {
    pattern: />\s*'([^'<>]+)'\s*</g,
    replacement: '>&apos;$1&apos;<',
    description: 'Escape single quotes in JSX',
  },
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    fixes.forEach((fix) => {
      if (fix.pattern.test(content)) {
        content = content.replace(fix.pattern, fix.replacement);
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
    const stat = fs.statSync(filePath);

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
const rootDir = process.cwd();
const fixedFiles = walkDir(rootDir);
console.log(`\n✅ Fixed ${fixedFiles} files`);
