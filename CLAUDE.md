# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@digital-fluid/fluidspec` is a TypeScript package that distributes Claude command templates and FluidSpec standards. It's designed to be installed directly from GitHub without npm publishing.

**Key characteristics:**
- Zero dependencies (uses only Node.js core modules)
- Dual-module system (ESM + CJS) generated from single TypeScript source
- Git-installable package
- Provides both CLI and programmatic API

## Development Commands

### Building
```bash
# Build the package (TypeScript compilation + dual-format generation)
pnpm build

# Clean dist directory
pnpm clean

# Full rebuild (clean + build)
pnpm prepare
```

### Testing
```bash
# Run test suite
pnpm test

# Test CLI locally
node dist/cli.cjs help
node dist/cli.cjs list
node dist/cli.cjs claude:init
```

## Architecture

### Build System

The build process is **two-stage** and critical to understand:

1. **TypeScript Compilation** (`npx tsc`): Compiles `src/**/*.ts` → `dist/**/*.js` with type declarations
2. **Dual-Format Generation** ([scripts/build.js](scripts/build.js)): Transforms each `.js` file into:
   - `.cjs` - CommonJS variant (rewrites `require()` paths to `.cjs`)
   - `.mjs` - ESM variant (rewrites `require()` paths to `.mjs`)
   - Original `.js` files are deleted

**Important:** The shebang `#!/usr/bin/env node` is added only to `cli.cjs` and the file is made executable (755).

### Module System

- **Exports both formats:** [package.json](package.json) defines:
  - `main`: `dist/index.cjs` (CommonJS)
  - `module`: `dist/index.mjs` (ESM)
  - `bin`: `dist/cli.cjs` (CLI entrypoint)
- **No dependencies:** The package uses only Node.js core modules (`fs`, `path`, `child_process`)
- **TypeScript-first:** Full type definitions in `dist/**/*.d.ts`

### Directory Structure

```
src/
├── index.ts              # Library API (exports initClaudeCommands, listClaudeCommandTemplates)
├── cli.ts                # CLI entrypoint (argument parsing, command routing)
├── commands/
│   └── claudeInit.ts     # Implements claude:init command (template copying logic)
└── utils/
    └── fsUtils.ts        # File system utilities (copyDir, ensureDir, etc.)

templates/claude/         # Command templates (copied to user projects)
├── fluid-task-engineer/
├── fluid-dev-agent/
└── fluid-task-manager/
    ├── command.json      # Metadata (name, version, description)
    └── prompt.md         # Command prompt content

scripts/                  # Build tooling
├── build.js              # Two-stage build: tsc → dual-format generation
├── clean.js              # Removes dist/
└── test.js               # Test suite (no external test framework)
```

### Package Root Discovery

Both [src/index.ts](src/index.ts) and [src/commands/claudeInit.ts](src/commands/claudeInit.ts) implement `findPackageRoot()` which:
- Walks up the directory tree from `__dirname`
- Looks for `package.json` with `name: "@digital-fluid/fluidspec"`
- Works in both development (`src/`) and production (`dist/`) environments
- This is critical for locating the `templates/` directory when installed via Git

### Template System

Templates are the core deliverable of this package:
- Located in `templates/claude/<template-name>/`
- Each template must have:
  - `command.json` - Metadata conforming to `CommandMetadata` interface
  - `prompt.md` - The actual command prompt
- `listClaudeCommandTemplates()` scans templates and returns structured info
- `initClaudeCommands()` copies all templates to target project's `.claude/commands/`

## FluidSpec Standards

The package promotes a standardized task specification format with **required sections**:

1. **Context** - Background, why the task exists, scope
2. **Requirements** - Functional (FR), non-functional (NFR), constraints
3. **Implementation Steps** - Sequential, actionable steps
4. **Acceptance Criteria** - Testable completion conditions (checklist format)
5. **Links and References** - Related docs, designs, APIs

See [README.md](README.md) for a complete FluidSpec example.

## Adding New Templates

To add a new Claude command template:

1. Create directory: `templates/claude/your-command-name/`
2. Add `command.json`:
   ```json
   {
     "name": "Human Readable Name",
     "version": "1.0.0",
     "description": "What this command does",
     "entry": "prompt.md",
     "input_type": "text"
   }
   ```
3. Add `prompt.md` with the command prompt
4. Update [README.md](README.md) to document the new command
5. Verify with: `pnpm build && node dist/cli.cjs list`

## Testing Workflow

The [scripts/test.js](scripts/test.js) test suite verifies:
- Build artifacts exist (`dist/*.cjs`, `dist/*.mjs`, `dist/*.d.ts`)
- CLI is executable
- All template directories are complete
- CLI commands (`help`, `list`, `version`) work
- `claude:init` creates correct directory structure

**No external test framework** - uses simple `test(name, fn)` pattern with try/catch.

## Installation & Usage

This package is installed via Git, not npm:
```bash
pnpm add git+https://github.com/aharonyaircohen/fluid-spec.git
```

The consuming project then runs:
```bash
npx fluidspec claude:init
```

This copies all templates from `templates/claude/` to `.claude/commands/` in the consumer's project.
