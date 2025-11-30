import * as path from 'path';
import * as fs from 'fs';
import { listSubdirectories, readJsonFile } from './utils/fsUtils';
import { findPackageRoot } from './utils/packageUtils';
import { claudeInit as claudeInitCommand } from './commands/claudeInit';

/**
 * Represents a Claude command template
 */
export interface ClaudeCommandTemplate {
  /** Unique identifier (directory name) */
  id: string;
  /** Human-readable name from command.json */
  name: string;
  /** Description from command.json */
  description: string;
  /** Absolute path to the template directory */
  sourceDir: string;
}

/**
 * Command metadata from command.json
 */
interface CommandMetadata {
  name: string;
  version: string;
  description: string;
  entry: string;
  input_type: string;
}

/**
 * Options for initializing Claude commands
 */
export interface InitClaudeCommandsOptions {
  /** Project root directory (defaults to process.cwd()) */
  projectRoot?: string;
  /** If true, overwrite existing files */
  force?: boolean;
}

/** General initialization options for all providers */
export interface InitOptions extends InitClaudeCommandsOptions {}

/**
 * Lists all available Claude command templates
 * Scans the templates/claude directory and returns structured information
 *
 * @returns Array of Claude command templates
 */
export function listClaudeCommandTemplates(): ClaudeCommandTemplate[] {
  const packageRoot = findPackageRoot();
  const templatesDir = path.join(packageRoot, 'templates', 'claude');

  if (!fs.existsSync(templatesDir)) {
    return [];
  }

  const templateIds = listSubdirectories(templatesDir);
  const templates: ClaudeCommandTemplate[] = [];

  for (const id of templateIds) {
    const templateDir = path.join(templatesDir, id);
    const commandJsonPath = path.join(templateDir, 'command.json');

    try {
      const metadata = readJsonFile<CommandMetadata>(commandJsonPath);
      templates.push({
        id,
        name: metadata.name,
        description: metadata.description,
        sourceDir: templateDir,
      });
    } catch (error) {
      console.warn(`Warning: Could not read metadata for template "${id}":`, error);
    }
  }

  return templates;
}

/**
 * Initializes Claude commands in a project
 * Copies command templates to the project's .claude/commands/ directory
 *
 * @param options Configuration options
 *
 * @example
 * ```typescript
 * // Initialize commands in current directory
 * initClaudeCommands();
 *
 * // Initialize with force overwrite
 * initClaudeCommands({ force: true });
 *
 * // Initialize in specific project
 * initClaudeCommands({ projectRoot: '/path/to/project' });
 * ```
 */
export function initClaudeCommands(options: InitClaudeCommandsOptions = {}): void {
  const projectRoot = options.projectRoot || process.cwd();
  const force = options.force || false;

  claudeInitCommand({ projectRoot, force });
}

/** Internal provider initialization descriptor */
type ProviderInitializer = {
  id: string;
  init: (options: InitOptions) => void;
};

const providerInitializers: ProviderInitializer[] = [
  {
    id: 'claude',
    init: initClaudeCommands,
  },
];

/** Initialize all supported providers */
export function init(options: InitOptions = {}): void {
  const resolvedOptions: InitOptions = {
    projectRoot: options.projectRoot || process.cwd(),
    force: Boolean(options.force),
  };

  for (const provider of providerInitializers) {
    console.log(`\nInitializing ${provider.id} provider...`);
    provider.init(resolvedOptions);
  }
}

// Re-export utilities for advanced use cases
export { copyDir, ensureDir, pathExists } from './utils/fsUtils';
