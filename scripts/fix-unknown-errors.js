#!/usr/bin/env node

/**
 * Fix TypeScript errors where error.message is accessed on unknown type
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern: } catch (error: unknown) { ... error.message
  // Need to add: const message = error instanceof Error ? error.message : 'Unknown error';

  // Find catch blocks with unknown type
  const catchUnknownPattern = /} catch \(([a-zA-Z][a-zA-Z0-9]*): unknown\) \{([^}]*)\1\.message/gs;

  if (catchUnknownPattern.test(content)) {
    content = content.replace(
      /} catch \(([a-zA-Z][a-zA-Z0-9]*): unknown\) \{/g,
      (match, varName) => {
        // Check if the next lines already have the instanceof check
        const nextLines = content.substring(
          content.indexOf(match) + match.length,
          content.indexOf(match) + match.length + 200
        );
        if (nextLines.includes(`${varName} instanceof Error`)) {
          return match; // Already fixed
        }
        return `} catch (${varName}: unknown) {\n    const message = ${varName} instanceof Error ? ${varName}.message : 'Unknown error';`;
      }
    );

    // Replace error.message with message
    content = content.replace(
      /([a-zA-Z][a-zA-Z0-9]*): unknown\) \{([^}]*?)\1\.message/gs,
      (match, varName, body) => {
        if (body.includes('instanceof Error')) {
          return match.replace(new RegExp(`\\b${varName}\\.message\\b`, 'g'), 'message');
        }
        return match;
      }
    );

    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }

  return false;
}

function walkDir(dir) {
  let fixed = 0;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        fixed += walkDir(filePath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      if (fixFile(filePath)) {
        fixed++;
      }
    }
  }

  return fixed;
}

const appDir = path.join(__dirname, '..', 'app');
console.log('🔧 Fixing TypeScript unknown error type issues...\n');

const fixed = walkDir(appDir);

console.log(`\n✨ Fixed ${fixed} files`);
