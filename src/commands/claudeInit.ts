import * as path from 'path';
import * as fs from 'fs';
import { copyDir, copyFile, ensureDir, pathExists } from '../utils/fsUtils';

export interface ClaudeInitOptions {
  projectRoot: string;
  force: boolean;
}

export interface InitSpecFilesOptions {
  force?: boolean;
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

  // Process each template directory
  console.log(`Processing command templates from: ${templatesDir}`);
  const templateDirs = fs.readdirSync(templatesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  let totalCopied = 0;
  let totalSkipped = 0;
  const installedCommands: string[] = [];

  for (const templateDir of templateDirs) {
    const sourcePath = path.join(templatesDir, templateDir);
    const commandJsonPath = path.join(sourcePath, 'command.json');

    // Check if command.json exists
    if (!fs.existsSync(commandJsonPath)) {
      console.warn(`Warning: Skipping ${templateDir} - no command.json found`);
      continue;
    }

    // Read command.json
    const commandJson = JSON.parse(fs.readFileSync(commandJsonPath, 'utf8'));

    // Check if it's a multi-command template
    if (commandJson.commands && Array.isArray(commandJson.commands)) {
      // Handle multiple commands in one folder
      for (const cmd of commandJson.commands) {
        const cmdTargetDir = path.join(targetDir, `${templateDir}-${cmd.id}`);
        ensureDir(cmdTargetDir);

        // Create command.json for this specific command
        const singleCommandJson = {
          name: cmd.name,
          version: cmd.version,
          description: cmd.description,
          entry: 'prompt.md',
          input_type: cmd.input_type
        };

        const targetCommandJsonPath = path.join(cmdTargetDir, 'command.json');
        const targetPromptPath = path.join(cmdTargetDir, 'prompt.md');
        const sourcePromptPath = path.join(sourcePath, cmd.entry);

        // Copy or skip based on force flag
        let copied = 0;
        let skipped = 0;

        if (force || !fs.existsSync(targetCommandJsonPath)) {
          fs.writeFileSync(targetCommandJsonPath, JSON.stringify(singleCommandJson, null, 2));
          copied++;
        } else {
          skipped++;
        }

        if (force || !fs.existsSync(targetPromptPath)) {
          fs.copyFileSync(sourcePromptPath, targetPromptPath);
          copied++;
        } else {
          skipped++;
        }

        totalCopied += copied;
        totalSkipped += skipped;
        installedCommands.push(`${templateDir}-${cmd.id}`);
      }
    } else {
      // Standard single-command template
      const result = copyDir(sourcePath, path.join(targetDir, templateDir), force);
      totalCopied += result.copied;
      totalSkipped += result.skipped;
      installedCommands.push(templateDir);
    }
  }

  // Report results
  console.log('\nCommand templates initialized successfully!');
  console.log(`  Copied: ${totalCopied} files`);
  if (totalSkipped > 0) {
    console.log(`  Skipped: ${totalSkipped} files (already exist)`);
    console.log(`  Tip: Use --force to overwrite existing files`);
  }

  console.log('\nAvailable commands:');
  installedCommands.forEach(cmd => {
    console.log(`  - /${cmd}`);
  });

  initSpecFiles(projectRoot, { force });

  console.log('\nYou can now use these commands in Claude!');
}

export function initSpecFiles(
  projectRoot: string,
  options: InitSpecFilesOptions = {}
): void {
  const { force = false } = options;
  const packageRoot = findPackageRoot();
  const specTemplatesRoot = path.join(packageRoot, 'templates', 'spec');

  if (!pathExists(specTemplatesRoot)) {
    console.warn(`Spec templates directory not found at ${specTemplatesRoot}`);
    return;
  }

  const targetSpecRoot = path.join(projectRoot, '.fluidspec', 'spec');
  const baseSourceDir = path.join(specTemplatesRoot, 'base');
  const projectTemplateDir = path.join(specTemplatesRoot, 'project');
  const baseTargetDir = path.join(targetSpecRoot, 'base');
  const projectTargetDir = path.join(targetSpecRoot, 'project');

  ensureDir(targetSpecRoot);

  if (pathExists(baseSourceDir)) {
    console.log(`\nCopying FluidSpec base files to: ${baseTargetDir}`);
    const { copied } = copyDir(baseSourceDir, baseTargetDir, true);
    console.log(`  Base files copied: ${copied} (overwritten if existed)`);
  } else {
    console.warn(`Warning: Base spec templates not found at ${baseSourceDir}`);
  }

  if (pathExists(projectTemplateDir)) {
    console.log(`\nCopying project spec templates to: ${projectTargetDir}`);
    ensureDir(projectTargetDir);

    let copied = 0;
    let skipped = 0;

    const templateFiles = fs.readdirSync(projectTemplateDir, { withFileTypes: true })
      .filter(entry => entry.isFile() && (entry.name.endsWith('.template.md') || entry.name.endsWith('.md')));

    for (const templateFile of templateFiles) {
      const sourcePath = path.join(projectTemplateDir, templateFile.name);
      const targetFilename = templateFile.name.endsWith('.template.md')
        ? templateFile.name.replace(/\.template\.md$/, '.md')
        : templateFile.name;
      const targetPath = path.join(projectTargetDir, targetFilename);

      if (fs.existsSync(targetPath)) {
        skipped++;
        continue;
      }

      copyFile(sourcePath, targetPath, false);
      copied++;
    }

    console.log(`  Project templates copied: ${copied}`);
    if (skipped > 0) {
      console.log(`  Project templates skipped (existing): ${skipped}`);
      if (force) {
        console.log('  Note: Project spec files are not overwritten, even with --force.');
      }
    }
  } else {
    console.warn(`Warning: Project spec templates not found at ${projectTemplateDir}`);
  }
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
