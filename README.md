# @digital-fluid/fluidspec

A lightweight package that delivers and syncs all Fluid Spec agents and Claude command templates used to generate, manage, and execute spec-driven development tasks.

## Overview

`@digital-fluid/fluidspec` is a TypeScript package that provides:

- **FluidSpec Standards**: A consistent specification format for software development tasks
- **Claude Command Templates**: Ready-to-use AI agent personas for task engineering, development, and management
- **CLI Tool**: Easy integration into any project via the `fluidspec` command

## Features

- ✅ **Git-installable**: Use directly from GitHub without npm publishing
- ✅ **Zero dependencies**: Uses only Node.js core modules
- ✅ **TypeScript-first**: Full type safety and IntelliSense support
- ✅ **ESM + CJS**: Works with both module systems
- ✅ **CLI + Library**: Use as a command-line tool or import programmatically

## Installation

### Install via Git

```bash
# Using pnpm
pnpm add git+https://github.com/aharonyaircohen/fluid-spec.git

# Using npm
npm install git+https://github.com/aharonyaircohen/fluid-spec.git

# Using yarn
yarn add git+https://github.com/aharonyaircohen/fluid-spec.git
```

This will add the package to your `package.json`:

```json
{
  "dependencies": {
    "@digital-fluid/fluidspec": "git+https://github.com/aharonyaircohen/fluid-spec.git"
  }
}
```

### Install Specific Version

```bash
pnpm add git+https://github.com/aharonyaircohen/fluid-spec.git#v0.1.0
```

## Usage

### CLI Usage

After installation, use the `fluidspec` command to initialize Claude commands in your project:

```bash
# Initialize Claude commands
npx fluidspec claude:init

# Or if installed globally/locally
fluidspec claude:init

# Force overwrite existing commands
fluidspec claude:init --force

# List available templates
fluidspec list

# Show help
fluidspec help

# Show version
fluidspec version
```

### What Gets Installed

Running `fluidspec claude:init` creates the following structure in your project:

```
your-project/
└── .claude/
    └── commands/
        ├── fluid-task-engineer/
        │   ├── command.json
        │   └── prompt.md
        ├── fluid-dev-agent/
        │   ├── command.json
        │   └── prompt.md
        └── fluid-task-manager/
            ├── command.json
            └── prompt.md
```

### Claude Commands

Once initialized, you can use these commands in Claude:

#### `/fluid-task-engineer`
Converts high-level feature ideas into complete FluidSpec task specifications.

**Use when**: You have a feature concept and need a detailed specification.

**Example**:
```
/fluid-task-engineer
I need a user authentication system with email/password login and session management.
```

#### `/fluid-dev-agent`
Converts FluidSpec tasks into implementation plans and executes development work.

**Use when**: You have a complete task spec and need it implemented.

**Example**:
```
/fluid-dev-agent
[Paste your FluidSpec task here]
```

#### `/fluid-task-manager`
Manages task lifecycle, reviews specifications, and coordinates workflow.

**Use when**: You need to review task quality, track progress, or split large tasks.

**Example**:
```
/fluid-task-manager review
[Paste task spec to review]
```

### Programmatic Usage

You can also use the package programmatically in your Node.js/TypeScript projects:

```typescript
import {
  initClaudeCommands,
  listClaudeCommandTemplates,
  type ClaudeCommandTemplate
} from '@digital-fluid/fluidspec';

// Initialize commands in current directory
initClaudeCommands();

// Initialize with options
initClaudeCommands({
  projectRoot: '/path/to/project',
  force: true
});

// List available templates
const templates = listClaudeCommandTemplates();
templates.forEach(template => {
  console.log(`${template.id}: ${template.name}`);
  console.log(`  ${template.description}`);
});
```

### Access to Fluid Spec Files

Running `fluidspec claude:init` copies Fluid Spec documentation into your project:

- Base specs → `.fluidspec/spec/base/` (always overwritten to stay current)
- Project templates → `.fluidspec/spec/project/` (copied from `*.template.md`, existing `.md` files are never overwritten)

Reference these files directly inside Claude commands, for example `.fluidspec/spec/base/constraints.md` or `.fluidspec/spec/project/task-template.md`.

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/aharonyaircohen/fluid-spec.git
cd fluid-spec

# Install dependencies
pnpm install

# Build the package
pnpm build
```

### Project Structure

```
fluid-spec/
├── src/
│   ├── index.ts              # Library API
│   ├── cli.ts                # CLI entrypoint
│   ├── commands/
│   │   └── claudeInit.ts     # claude:init command
│   └── utils/
│       └── fsUtils.ts        # File system utilities
├── templates/
│   ├── claude/
│   │   ├── fluid-task-engineer/
│   │   ├── fluid-dev-agent/
│   │   └── fluid-task-manager/
│   └── spec/
│       ├── base/
│       └── project/
├── scripts/
│   ├── build.js              # Build script
│   └── clean.js              # Clean script
├── dist/                     # Compiled output (generated)
├── package.json
├── tsconfig.json
└── README.md
```

### Scripts

```bash
# Clean dist directory
pnpm clean

# Build the package
pnpm build

# Clean and rebuild
pnpm prepare
```

### Testing Locally

To test the package locally before pushing:

```bash
# In the fluid-spec directory
pnpm build

# In a test project directory
npm install /path/to/fluid-spec

# Or link it
cd /path/to/fluid-spec
npm link

cd /path/to/test-project
npm link @digital-fluid/fluidspec

# Test the CLI
npx fluidspec claude:init
```

## FluidSpec Task Schema

FluidSpec tasks follow this structure:

### Required Sections

1. **Context**: Why the task exists, background information, scope
2. **Requirements**: Functional, non-functional, and constraints
3. **Implementation Steps**: Sequential, actionable steps
4. **Acceptance Criteria**: Testable conditions for completion
5. **Links and References**: Related documentation, designs, APIs

### Example Task

```markdown
# Task: User Authentication System

## Context
We need a secure authentication system to protect user accounts and enable
personalized experiences. Currently, the app is open to all users without
any access control.

## Requirements

### Functional Requirements
- FR1: Users can register with email and password
- FR2: Users can log in with valid credentials
- FR3: Users can log out from any device
- FR4: Sessions expire after 24 hours of inactivity

### Non-Functional Requirements
- NFR1: Passwords must be hashed using bcrypt
- NFR2: Login must complete within 500ms
- NFR3: Must be GDPR compliant

### Constraints
- Must integrate with existing PostgreSQL database
- Must work with current React frontend

## Implementation Steps

1. Create User model with email, password_hash, created_at fields
2. Implement registration endpoint (POST /api/auth/register)
3. Implement login endpoint (POST /api/auth/login)
4. Add JWT-based session management
5. Create authentication middleware
6. Add logout endpoint (POST /api/auth/logout)
7. Write unit tests for all endpoints
8. Update frontend to use authentication

## Acceptance Criteria

- [ ] AC1: Given valid email/password, user can register successfully
- [ ] AC2: Given registered credentials, user can log in and receive JWT
- [ ] AC3: Given valid JWT, user can access protected routes
- [ ] AC4: Given no JWT or expired JWT, protected routes return 401
- [ ] AC5: Given user clicks logout, session is terminated
- [ ] AC6: All tests pass with >90% coverage

## Links and References

- [Authentication Flow Design](link-to-figma)
- [API Documentation](link-to-api-docs)
- [Security Requirements](link-to-security-doc)
```

## API Reference

### `initClaudeCommands(options?)`

Initializes Claude commands in a project.

**Parameters**:
- `options.projectRoot` (string, optional): Target project directory. Defaults to `process.cwd()`
- `options.force` (boolean, optional): Overwrite existing files. Defaults to `false`

**Returns**: `void`

### `listClaudeCommandTemplates()`

Lists all available Claude command templates.

**Returns**: `ClaudeCommandTemplate[]`

```typescript
interface ClaudeCommandTemplate {
  id: string;               // Template identifier
  name: string;             // Human-readable name
  description: string;      // Template description
  sourceDir: string;        // Absolute path to template
}
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** your changes: `git commit -m 'Add my feature'`
4. **Push** to the branch: `git push origin feature/my-feature`
5. **Open** a Pull Request

### Adding New Templates

To add a new Claude command template:

1. Create a new directory in `templates/claude/your-command-name/`
2. Add `command.json` with metadata
3. Add `prompt.md` with the command prompt
4. Update this README to document the new command
5. Test locally before submitting PR

## Versioning

This package follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking API changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/digital-fluid/fluid-spec/issues)
- **Discussions**: [GitHub Discussions](https://github.com/digital-fluid/fluid-spec/discussions)

## Roadmap

- [ ] Add more specialized command templates
- [ ] Publish to npm registry
- [ ] Add configuration file support
- [ ] Add template customization options
- [ ] Create interactive CLI wizard

---

**Made with ❤️ by Digital-Fluid**
