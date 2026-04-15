import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const EXTENSIONS = ['.ts', '.tsx'];

function walk(dir: string, files: string[] = []): string[] {
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

function fixFile(file: string) {
  let src = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. catch (_error) or catch (_e) -> catch (error: unknown) or catch (e: unknown)
  // Only if there is NO type already
  const catchPattern = /catch\s*\(\s*(\w+)\s*\)\s*\{/g;
  if (catchPattern.test(src)) {
    src = src.replace(catchPattern, (_m, name) => {
      changed = true;
      return `catch (${name}: unknown) {`;
    });
  }

  // 2. name.message -> (name instanceof Error ? name.message : "Unknown error")
  // But we need to be careful NOT to double-wrap if we already have it.
  // And only if it's within a catch block or after an 'unknown' declaration.
  // This regex is a bit greedy but matches the user's request.
  // We'll look for patterns like '(error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error")' where 'error' might be unknown.

  // Specifically looking for cases where it's likely part of the error handling
  // and NOT already wrapped in an instanceof check.

  const messagePattern = /(?<!instanceof Error \? \w+\.)(?<!\?\.\s*)(\b\w+)\.message\b/g;

  // We only want to apply this if we see evidence of it being a catch variable
  // or previously converted to unknown.
  if (messagePattern.test(src)) {
    // We'll use a safer approach: only replace if the variable matches common error names
    // and isn't already handled.
    src = src.replace(messagePattern, (match, name) => {
      if (['error', 'err', 'e', 'ex'].includes(name.toLowerCase())) {
        changed = true;
        return `(${name} instanceof Error ? ${name}.message : "Unknown error")`;
      }
      return match;
    });
  }

  if (changed) {
    fs.writeFileSync(file, src);
    console.log('✔ Fixed:', file);
  }
}

console.log('🔍 Scanning for unsafe catch blocks...');
const files = walk(ROOT);
files.forEach(fixFile);
console.log('✨ Done!');

