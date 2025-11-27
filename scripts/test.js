#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running FluidSpec Package Tests...\n');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const cliPath = path.join(distDir, 'cli.cjs');
const claudeTemplatesDir = path.join(rootDir, 'templates', 'claude');

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
  if (!fs.existsSync(claudeTemplatesDir)) {
    throw new Error('templates/claude directory not found');
  }

  const templateDirs = fs.readdirSync(claudeTemplatesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  if (templateDirs.length === 0) {
    throw new Error('No template directories found in templates/claude');
  }

  for (const template of templateDirs) {
    const templateDir = path.join(claudeTemplatesDir, template);
    const commandJsonPath = path.join(templateDir, 'command.json');

    if (!fs.existsSync(commandJsonPath)) {
      throw new Error(`command.json missing in ${template}`);
    }
    const commandJson = JSON.parse(fs.readFileSync(commandJsonPath, 'utf8'));

    if (Array.isArray(commandJson.commands)) {
      for (const cmd of commandJson.commands) {
        const entryPath = path.join(templateDir, cmd.entry);
        if (!fs.existsSync(entryPath)) {
          throw new Error(`${cmd.entry} missing in ${template}`);
        }
      }
    } else {
      const promptMd = path.join(templateDir, 'prompt.md');
      if (!fs.existsSync(promptMd)) {
        throw new Error(`prompt.md missing in ${template}`);
      }
    }
  }
});

// Test 5: Spec templates exist
test('Spec templates exist', () => {
  const specBaseDir = path.join(rootDir, 'templates', 'spec', 'base');
  const specProjectDir = path.join(rootDir, 'templates', 'spec', 'project');

  if (!fs.existsSync(specBaseDir)) {
    throw new Error('templates/spec/base directory not found');
  }

  const specFiles = fs.readdirSync(specBaseDir).filter(f => f.endsWith('.md'));
  if (specFiles.length === 0) {
    throw new Error('No .md files found in templates/spec/base');
  }

  if (!fs.existsSync(specProjectDir)) {
    throw new Error('templates/spec/project directory not found');
  }

  const projectTemplates = fs.readdirSync(specProjectDir).filter(f => f.endsWith('.template.md'));
  if (projectTemplates.length === 0) {
    throw new Error('No .template.md files found in templates/spec/project');
  }

  const projectMdFiles = fs.readdirSync(specProjectDir).filter(f => f.endsWith('.md') && !f.endsWith('.template.md'));
  if (projectMdFiles.length === 0) {
    throw new Error('No .md files found in templates/spec/project');
  }
});

// Test 6: CLI help command works
test('CLI help command works', () => {
  try {
    execSync(`node "${cliPath}" help`, { stdio: 'pipe' });
  } catch (error) {
    throw new Error('CLI help command failed');
  }
});

// Test 7: CLI list command works
test('CLI list command works', () => {
  try {
    const output = execSync(`node "${cliPath}" list`, { encoding: 'utf8' });
    if (!output.includes('Available Claude command templates')) {
      throw new Error('List command output missing header');
    }

    const templateDirs = fs.readdirSync(claudeTemplatesDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    const hasKnownTemplate = templateDirs.some(template => output.includes(template));
    if (!hasKnownTemplate) {
      throw new Error('List command output does not include expected template ids');
    }
  } catch (error) {
    throw new Error('CLI list command failed');
  }
});

// Test 8: CLI version command works
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

// Test 9: Create test project and run claude:init
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
    const templateDirs = fs.readdirSync(claudeTemplatesDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    for (const template of templateDirs) {
      const templateDir = path.join(claudeTemplatesDir, template);
      const commandJsonPath = path.join(templateDir, 'command.json');
      const commandJson = JSON.parse(fs.readFileSync(commandJsonPath, 'utf8'));

      if (Array.isArray(commandJson.commands)) {
        for (const cmd of commandJson.commands) {
          const cmdDirName = `${template}-${cmd.id}`;
          const cmdDirPath = path.join(commandsDir, cmdDirName);
          if (!fs.existsSync(cmdDirPath)) {
            throw new Error(`Template ${cmdDirName} was not copied`);
          }

          const commandJsonCopied = path.join(cmdDirPath, 'command.json');
          const promptMdCopied = path.join(cmdDirPath, 'prompt.md');

          if (!fs.existsSync(commandJsonCopied) || !fs.existsSync(promptMdCopied)) {
            throw new Error(`Template ${cmdDirName} is incomplete`);
          }
        }
      } else {
        const templateDirPath = path.join(commandsDir, template);
        if (!fs.existsSync(templateDirPath)) {
          throw new Error(`Template ${template} was not copied`);
        }

        const commandJsonCopied = path.join(templateDirPath, 'command.json');
        const promptMdCopied = path.join(templateDirPath, 'prompt.md');

        if (!fs.existsSync(commandJsonCopied) || !fs.existsSync(promptMdCopied)) {
          throw new Error(`Template ${template} is incomplete`);
        }
      }
    }

    // Verify .fluidspec directory was created
    const fluidspecDir = path.join(testDir, '.fluidspec');
    if (!fs.existsSync(fluidspecDir)) {
      throw new Error('.fluidspec directory was not created');
    }

    const specDir = path.join(fluidspecDir, 'spec');
    if (!fs.existsSync(specDir)) {
      throw new Error('.fluidspec/spec directory was not created');
    }

    const baseDir = path.join(specDir, 'base');
    if (!fs.existsSync(baseDir)) {
      throw new Error('.fluidspec/spec/base directory was not created');
    }
    const baseFiles = fs.readdirSync(baseDir).filter(f => f.endsWith('.md'));
    if (baseFiles.length === 0) {
      throw new Error('No base spec files were copied to .fluidspec/spec/base');
    }

    const projectDir = path.join(specDir, 'project');
    if (!fs.existsSync(projectDir)) {
      throw new Error('.fluidspec/spec/project directory was not created');
    }
    const projectFiles = fs.readdirSync(projectDir).filter(f => f.endsWith('.md'));
    if (projectFiles.length === 0) {
      throw new Error('No project spec files were copied to .fluidspec/spec/project');
    }
    if (!projectFiles.includes('task-template.md')) {
      throw new Error('Project templates were not renamed to .md files');
    }
    if (!projectFiles.includes('design--system.md') || !projectFiles.includes('tech-stack.md')) {
      throw new Error('Project spec .md files were not copied to .fluidspec/spec/project');
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
