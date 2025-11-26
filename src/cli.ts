#!/usr/bin/env node

import { initClaudeCommands, listClaudeCommandTemplates } from './index';

/**
 * Parse command line arguments
 */
function parseArgs(argv: string[]): {
  command: string;
  subcommand?: string;
  flags: { [key: string]: boolean | string };
} {
  const args = argv.slice(2); // Remove 'node' and script path
  const flags: { [key: string]: boolean | string } = {};
  let command = '';
  let subcommand: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      // Long flag
      const flagName = arg.substring(2);
      const nextArg = args[i + 1];

      if (nextArg && !nextArg.startsWith('-')) {
        flags[flagName] = nextArg;
        i++; // Skip next arg
      } else {
        flags[flagName] = true;
      }
    } else if (arg.startsWith('-')) {
      // Short flag
      const flagName = arg.substring(1);
      flags[flagName] = true;
    } else {
      // Command or subcommand
      if (!command) {
        command = arg;
      } else if (!subcommand) {
        subcommand = arg;
      }
    }
  }

  return { command, subcommand, flags };
}

/**
 * Display help message
 */
function showHelp(): void {
  console.log(`
@digital-fluid/fluidspec - FluidSpec CLI

USAGE:
  fluidspec <command> [options]

COMMANDS:
  claude:init       Initialize Claude commands in current project
  list              List available command templates
  help              Show this help message
  version           Show version information

OPTIONS:
  --force           Overwrite existing files (for claude:init)
  --help, -h        Show help message

EXAMPLES:
  fluidspec claude:init
    Initialize Claude commands in the current project

  fluidspec claude:init --force
    Initialize and overwrite existing command files

  fluidspec list
    List all available command templates

For more information, visit:
https://github.com/digital-fluid/fluid-spec
`);
}

/**
 * Display version information
 */
function showVersion(): void {
  try {
    const packageJson = require('../package.json');
    console.log(`@digital-fluid/fluidspec v${packageJson.version}`);
  } catch {
    console.log('@digital-fluid/fluidspec (version unknown)');
  }
}

/**
 * List available command templates
 */
function listCommands(): void {
  console.log('Available Claude command templates:\n');

  const templates = listClaudeCommandTemplates();

  if (templates.length === 0) {
    console.log('No templates found.');
    return;
  }

  templates.forEach((template) => {
    console.log(`  ${template.id}`);
    console.log(`    Name: ${template.name}`);
    console.log(`    Description: ${template.description}`);
    console.log();
  });

  console.log(`Total: ${templates.length} template(s)`);
}

/**
 * Main CLI entry point
 */
function main(): void {
  const { command, subcommand, flags } = parseArgs(process.argv);

  // Handle help flag
  if (flags.help || flags.h) {
    showHelp();
    process.exit(0);
  }

  // Handle version flag
  if (flags.version || flags.v) {
    showVersion();
    process.exit(0);
  }

  // Handle commands
  const fullCommand = subcommand ? `${command}:${subcommand}` : command;

  try {
    switch (fullCommand) {
      case 'claude:init':
        initClaudeCommands({
          projectRoot: process.cwd(),
          force: Boolean(flags.force),
        });
        break;

      case 'list':
        listCommands();
        break;

      case 'help':
      case '':
        showHelp();
        break;

      case 'version':
        showVersion();
        break;

      default:
        console.error(`Unknown command: ${fullCommand}`);
        console.error('Run "fluidspec help" for usage information.');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run CLI
main();
