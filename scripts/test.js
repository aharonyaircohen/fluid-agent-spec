#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running FluidSpec Package Tests...\n');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const cliPath = path.join(distDir, 'cli.cjs');

let exitCode = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  ${error.message}`);
    exitCode = 1;
  }
}

// Test 1: Dist directory exists
test('Dist directory exists', () => {
  if (!fs.existsSync(distDir)) {
    throw new Error('dist/ directory not found');
  }
});

// Test 2: CLI file exists and is executable
test('CLI file exists and is executable', () => {
  if (!fs.existsSync(cliPath)) {
    throw new Error('CLI file not found');
  }
  const stats = fs.statSync(cliPath);
  if (!(stats.mode & 0o111)) {
    throw new Error('CLI file is not executable');
  }
});

// Test 3: Required dist files exist
test('Required dist files exist', () => {
  const requiredFiles = [
    'index.cjs',
    'index.mjs',
    'index.d.ts',
    'cli.cjs',
    'cli.mjs',
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(distDir, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required file missing: ${file}`);
    }
  }
});

// Test 4: Template directories exist
test('Template directories exist', () => {
  const templatesDir = path.join(rootDir, 'templates', 'claude');
  const expectedTemplates = ['fluid-task-engineer', 'fluid-dev-agent', 'fluid-task-manager'];

  for (const template of expectedTemplates) {
    const templateDir = path.join(templatesDir, template);
    if (!fs.existsSync(templateDir)) {
      throw new Error(`Template directory missing: ${template}`);
    }

    const commandJson = path.join(templateDir, 'command.json');
    const promptMd = path.join(templateDir, 'prompt.md');

    if (!fs.existsSync(commandJson)) {
      throw new Error(`command.json missing in ${template}`);
    }
    if (!fs.existsSync(promptMd)) {
      throw new Error(`prompt.md missing in ${template}`);
    }
  }
});

// Test 5: CLI help command works
test('CLI help command works', () => {
  try {
    execSync(`node "${cliPath}" help`, { stdio: 'pipe' });
  } catch (error) {
    throw new Error('CLI help command failed');
  }
});

// Test 6: CLI list command works
test('CLI list command works', () => {
  try {
    const output = execSync(`node "${cliPath}" list`, { encoding: 'utf8' });
    if (!output.includes('fluid-task-engineer')) {
      throw new Error('List command output does not include expected templates');
    }
  } catch (error) {
    throw new Error('CLI list command failed');
  }
});

// Test 7: CLI version command works
test('CLI version command works', () => {
  try {
    const output = execSync(`node "${cliPath}" version`, { encoding: 'utf8' });
    if (!output.includes('fluidspec')) {
      throw new Error('Version command output invalid');
    }
  } catch (error) {
    throw new Error('CLI version command failed');
  }
});

// Test 8: Create test project and run claude:init
test('CLI claude:init creates command structure', () => {
  const testDir = path.join(rootDir, 'tmp-test-project');

  try {
    // Create test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    fs.mkdirSync(testDir, { recursive: true });

    // Run claude:init
    execSync(`node "${cliPath}" claude:init`, { cwd: testDir, stdio: 'pipe' });

    // Verify structure was created
    const commandsDir = path.join(testDir, '.claude', 'commands');
    if (!fs.existsSync(commandsDir)) {
      throw new Error('.claude/commands directory was not created');
    }

    // Verify each command template was copied
    const templates = ['fluid-task-engineer', 'fluid-dev-agent', 'fluid-task-manager'];
    for (const template of templates) {
      const templateDir = path.join(commandsDir, template);
      if (!fs.existsSync(templateDir)) {
        throw new Error(`Template ${template} was not copied`);
      }

      const commandJson = path.join(templateDir, 'command.json');
      const promptMd = path.join(templateDir, 'prompt.md');

      if (!fs.existsSync(commandJson) || !fs.existsSync(promptMd)) {
        throw new Error(`Template ${template} is incomplete`);
      }
    }

    // Cleanup
    fs.rmSync(testDir, { recursive: true });
  } catch (error) {
    // Cleanup on error
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    throw error;
  }
});

console.log('\n' + (exitCode === 0 ? 'All tests passed! ✓' : 'Some tests failed ✗'));
process.exit(exitCode);
