import * as path from 'path';
import * as fs from 'fs';
import { copyDir, ensureDir, pathExists } from '../utils/fsUtils';

export interface ClaudeInitOptions {
  projectRoot: string;
  force: boolean;
}

/**
 * Initializes Claude commands in the target project
 * Copies command templates from this package to the host project's .claude/commands/ directory
 */
export function claudeInit(options: ClaudeInitOptions): void {
  const { projectRoot, force } = options;

  // Resolve paths
  const targetDir = path.join(projectRoot, '.claude', 'commands');

  // Find the templates directory (works both in dev and when installed)
  const packageRoot = findPackageRoot();
  const templatesDir = path.join(packageRoot, 'templates', 'claude');

  // Verify templates directory exists
  if (!pathExists(templatesDir)) {
    throw new Error(
      `Templates directory not found at ${templatesDir}. ` +
      `This may indicate a broken package installation.`
    );
  }

  // Ensure target directory exists
  console.log(`Creating .claude/commands directory at: ${targetDir}`);
  ensureDir(targetDir);

  // Copy all command templates
  console.log(`Copying command templates from: ${templatesDir}`);
  const result = copyDir(templatesDir, targetDir, force);

  // Report results
  console.log('\nCommand templates initialized successfully!');
  console.log(`  Copied: ${result.copied} files`);
  if (result.skipped > 0) {
    console.log(`  Skipped: ${result.skipped} files (already exist)`);
    console.log(`  Tip: Use --force to overwrite existing files`);
  }

  // List installed commands
  const commands = fs.readdirSync(targetDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  console.log('\nAvailable commands:');
  commands.forEach(cmd => {
    console.log(`  - /${cmd}`);
  });

  console.log('\nYou can now use these commands in Claude!');
}

/**
 * Finds the root directory of this package
 * Works both in development (src/) and production (dist/)
 */
function findPackageRoot(): string {
  let currentDir = __dirname;

  // Walk up the directory tree until we find package.json
  for (let i = 0; i < 10; i++) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      // Verify this is the right package
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (pkg.name === '@digital-fluid/fluidspec') {
        return currentDir;
      }
    }
    currentDir = path.dirname(currentDir);
  }

  throw new Error('Could not find package root directory');
}
