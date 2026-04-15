import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const EXTENSIONS = ['.ts', '.tsx'];

function walk(dir, files = []) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) {
        walk(full, files);
      }
    } else if (EXTENSIONS.some((ext) => full.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

function fixFile(file) {
  let src = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Rename _error, _e, _err to error, e, err in catch clauses
  // and handle the unknown type if present.
  const catchRenamer = /catch\s*\(\s*_(\w+)(:\s*unknown)?\s*\)\s*\{/g;
  if (catchRenamer.test(src)) {
    src = src.replace(catchRenamer, (_m, name, type) => {
      changed = true;
      return `catch (${name}${type || ': unknown'}) {`;
    });
  }

  // 2. Ensure catch parameters have : unknown if they don't already
  const catchTyper = /catch\s*\(\s*(error|e|err)\s*\)\s*\{/g;
  if (catchTyper.test(src)) {
    src = src.replace(catchTyper, (_m, name) => {
      changed = true;
      return `catch (${name}: unknown) {`;
    });
  }

  // 3. name.message -> (name instanceof Error ? name.message : "Unknown error")
  // For common error variable names (error, err, e)
  // We'll look for usages that AREN'T already narrowed.
  const messagePattern = /(?<!instanceof Error \? \w+\.)(?<!\?\.\s*)(\b(error|err|e))\.message\b/g;
  if (messagePattern.test(src)) {
    src = src.replace(messagePattern, (match, name) => {
      changed = true;
      return `(${name} instanceof Error ? ${name}.message : "Unknown error")`;
    });
  }

  if (changed) {
    fs.writeFileSync(file, src);
    console.log(`✔ Fixed: ${file}`);
  }
}

console.log('🔍 Running aggressive TypeScript hardening script...');
const files = walk(ROOT);
files.forEach(fixFile);
console.log('✨ Hardening complete!');
