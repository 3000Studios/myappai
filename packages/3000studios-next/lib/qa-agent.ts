/**
 * Autonomous QA Agent
 * Pre-deploy validation system
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export class AutonomousQA {
  private static instance: AutonomousQA;
  private results: Map<string, boolean> = new Map();

  static getInstance() {
    if (!AutonomousQA.instance) {
      AutonomousQA.instance = new AutonomousQA();
    }
    return AutonomousQA.instance;
  }

  async runFullSuite(): Promise<boolean> {
    console.log('🤖 Autonomous QA Agent: Starting validation...');

    const checks = [
      this.checkRoutes(),
      this.checkAssets(),
      this.checkAuth(),
      this.checkRevenueFlows(),
      this.checkBuild(),
      this.checkDependencies(),
    ];

    const results = await Promise.all(checks);
    const allPassed = results.every((r) => r);

    if (allPassed) {
      console.log('✅ All QA checks passed - Deploy authorized');
    } else {
      console.log('❌ QA checks failed - Deploy blocked');
      this.logFailures();
    }

    return allPassed;
  }

  private async checkRoutes(): Promise<boolean> {
    console.log('  Checking routes...');

    const requiredRoutes = [
      '/',
      '/about',
      '/blog',
      '/contact',
      '/portfolio',
      '/projects',
      '/jws',
      '/live',
      '/store',
      '/apps',
      '/revenue',
      '/vendors-platform',
      '/login',
      '/admin',
    ];

    for (const route of requiredRoutes) {
      const routePath = path.join(process.cwd(), 'app', route === '/' ? '' : route, 'page.tsx');
      if (!fs.existsSync(routePath) && route !== '/') {
        console.log(`    ❌ Missing route: ${route}`);
        this.results.set('routes', false);
        return false;
      }
    }

    this.results.set('routes', true);
    console.log('    ✅ All routes present');
    return true;
  }

  private async checkAssets(): Promise<boolean> {
    console.log('  Checking critical assets...');

    // Check if media registry is accessible
    const mediaRegistry = path.join(process.cwd(), 'lib', 'media-registry.ts');
    if (!fs.existsSync(mediaRegistry)) {
      console.log('    ❌ Media registry missing');
      this.results.set('assets', false);
      return false;
    }

    this.results.set('assets', true);
    console.log('    ✅ Assets validated');
    return true;
  }

  private async checkAuth(): Promise<boolean> {
    console.log('  Checking auth middleware...');

    const middleware = path.join(process.cwd(), 'middleware.ts');
    if (!fs.existsSync(middleware)) {
      console.log('    ⚠️  Auth middleware missing');
      this.results.set('auth', false);
      return false;
    }

    this.results.set('auth', true);
    console.log('    ✅ Auth validated');
    return true;
  }

  private async checkRevenueFlows(): Promise<boolean> {
    console.log('  Checking revenue APIs...');

    const revenueAPIs = ['app/api/checkout/route.ts', 'app/api/subscribe/route.ts'];

    for (const api of revenueAPIs) {
      if (!fs.existsSync(path.join(process.cwd(), api))) {
        console.log(`    ❌ Missing: ${api}`);
        this.results.set('revenue', false);
        return false;
      }
    }

    this.results.set('revenue', true);
    console.log('    ✅ Revenue flows validated');
    return true;
  }

  private async checkBuild(): Promise<boolean> {
    console.log('  Running build test...');

    try {
      await execAsync('pnpm build', { cwd: process.cwd() });
      this.results.set('build', true);
      console.log('    ✅ Build successful');
      return true;
    } catch (error: unknown) {
      console.log('    ❌ Build failed');
      this.results.set('build', false);
      return false;
    }
  }

  private async checkDependencies(): Promise<boolean> {
    console.log('  Checking dependencies...');

    const packageJson = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJson)) {
      this.results.set('dependencies', false);
      return false;
    }

    this.results.set('dependencies', true);
    console.log('    ✅ Dependencies validated');
    return true;
  }

  private logFailures() {
    console.log('\n❌ Failed Checks:');
    for (const [check, passed] of this.results) {
      if (!passed) {
        console.log(`  - ${check}`);
      }
    }
  }

  getResults() {
    return Object.fromEntries(this.results);
  }
}

// Export singleton
export const QAAgent = AutonomousQA.getInstance();

