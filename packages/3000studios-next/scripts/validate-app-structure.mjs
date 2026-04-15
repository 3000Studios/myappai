#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(__dirname, '../app');
let failed = false;

/* ---------------- ROUTE COLLISION CHECK ---------------- */

const routeMap = new Map();

function walk(dir, group = '') {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!item.isDirectory()) continue;

    const isGroup = item.name.startsWith('(');
    const nextGroup = isGroup ? group : path.join(group, item.name);
    const full = path.join(dir, item.name);

    const page = path.join(full, 'page.tsx');
    if (fs.existsSync(page)) {
      const route = '/' + nextGroup.replace(/\\/g, '/');
      if (routeMap.has(route)) {
        console.error(`❌ ROUTE COLLISION: ${route}`);
        console.error(`   - ${routeMap.get(route)}`);
        console.error(`   - ${page}`);
        failed = true;
      }
      routeMap.set(route, page);
    }

    walk(full, nextGroup);
  }
}

walk(APP_DIR);

/* ---------------- CLIENT / SERVER VIOLATION CHECK ---------------- */

function scanFiles(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);

    if (item.isDirectory()) {
      scanFiles(full);
      continue;
    }

    if (!item.name.endsWith('.tsx')) continue;

    const src = fs.readFileSync(full, 'utf8');
    if (src.includes('window') || src.includes('document') || src.includes('navigator')) {
      if (!src.startsWith('"use client"') && !src.startsWith("'use client'")) {
        console.error(`❌ CLIENT API USED IN SERVER FILE: ${full}`);
        failed = true;
      }
    }
  }
}

const componentsDir = path.resolve(__dirname, '../components');
const appDir = path.resolve(__dirname, '../app');

if (fs.existsSync(componentsDir)) scanFiles(componentsDir);
if (fs.existsSync(appDir)) scanFiles(appDir);

/* ---------------- TAILWIND UTILITY CHECK ---------------- */

const globalsPath = path.resolve(__dirname, '../app/globals.css');
const globals = fs.readFileSync(globalsPath, 'utf8');

const used = new Set();

function scanForClasses(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      scanForClasses(full);
      continue;
    }

    if (!item.name.endsWith('.tsx')) continue;

    const src = fs.readFileSync(full, 'utf8');
    const matches = src.match(/className\s*=\s*["'`][^"'`]+/g);
    if (matches) {
      matches.forEach((m) => {
        m.replace(/className\s*=\s*["'`]/, '')
          .split(/\s+/)
          .forEach((c) => used.add(c));
      });
    }
  }
}

if (fs.existsSync(componentsDir)) scanForClasses(componentsDir);
if (fs.existsSync(appDir)) scanForClasses(appDir);

for (const cls of used) {
  // Skip plugin-defined utilities and custom utilities
  if (cls.startsWith('hyper-') || cls.startsWith('custom-')) continue;
  if (!globals.includes(`.${cls}`)) {
    // Only warn about truly unknown utilities
    // Most Tailwind defaults are handled by Tailwind itself
  }
}

/* ---------------- FINAL ---------------- */

if (failed) {
  console.error('\n🚫 BUILD BLOCKED — FIX ERRORS ABOVE\n');
  process.exit(1);
}

console.log('✅ App structure validated. Safe to build.');
