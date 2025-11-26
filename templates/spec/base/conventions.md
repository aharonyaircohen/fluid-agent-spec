# FluidSpec Coding Conventions

Practical coding patterns and implementation guidance for software development projects.

**Related Documents:**
- For non-negotiable rules and constraints, see `constraints.md`
- Rule precedence: Constraints > Conventions (this document) > Project-specific decisions

## 0. About This Document

This document provides implementation patterns, coding conventions, and practical guidance for day-to-day development work. All rules in `constraints.md` take precedence over conventions listed here.

**When to use this document:**
- Setting up project structure and conventions
- Making implementation decisions within established constraints
- Defining project-specific patterns and standards

**Document updates:**
- Conventions are living documents: record substantive changes with version/date
- PRs/tasks should cite the specs and conventions used for traceability

## 1. Technology Stack

Define your project's technology baseline in your project-specific conventions document:

* **Framework**: Specify frontend/backend frameworks
* **Language**: Primary programming language(s)
* **Styling**: UI framework and styling approach
* **Data layer**: API protocols and data fetching libraries
* **State management**: State management approach

### 1.1 Stack Guardrails

* Define project structure and conventions (monorepo, module layout, etc.)
* Establish runtime requirements and version constraints
* Document approved alternatives and migration paths
* Keep stack decisions documented and version-controlled

## 2. Directory Structure

Organize code by feature or domain for clarity and maintainability.

### 2.1 Feature-Based Architecture

* Group related functionality by domain/feature
* Each feature contains its own data layer, business logic, and types
* Shared utilities and types in common directories
* Keep cross-cutting concerns (auth, logging) separate

### 2.2 Suggested Structure Pattern

```
src/
  features/               # Feature-based modules
    <domain>/
      api.ts              # API/data-fetching functions
      services.ts         # Business logic
      types.ts            # Domain-specific types
      index.ts            # Public interface
  lib/                    # Shared utilities
    api/                  # API client configuration
    utils/                # Helper functions
  types/                  # Shared types across features
```

### 2.3 Module Organization

* Each feature exposes a clear public interface
* Internal implementation details remain private
* Shared code lives in `lib/` or `utils/`
* Keep feature-specific types colocated with the feature

---

## 3. Component Conventions

### 3.1 Naming

* Components: PascalCase
* Files match component name
* Functions/variables: camelCase
* Constants: UPPER_SNAKE_CASE
* Hooks: useSomething

### 3.2 Component Responsibilities

* UI components: presentational only, no business logic
* Container components: handle data fetching and state
* Keep components focused on single responsibility
* Separate presentation from business logic

### 3.3 Props & Interfaces

* Strongly typed interfaces for all props
* Avoid passing large raw objects deep into component trees
* Map data to view models at boundaries
* Keep prop interfaces explicit and minimal

---

## 4. Data Fetching & API Integration

### 4.1 API Client Architecture

* Centralize API client configuration in a single location
* Read configuration from environment variables
* Normalize errors at the API client boundary
* Type all API responses

### 4.2 Data Layer Organization

* API calls live in `features/<domain>/api.ts` or similar
* Service functions expose typed interfaces
* Keep requests minimal (only fetch needed data)
* Type responses at the boundary, map to domain models

### 4.3 Error & Loading States

* Use explicit `isLoading`, `isError`, `isSuccess` state flags
* Implement bounded retries with exponential backoff for transient errors
* Never surface raw API errors to users; map to user-friendly messages
* Log technical details to console/monitoring tools only

### 4.4 Environment & Configuration

* Store all API endpoints and credentials in environment variables
* Verify endpoint reachability before implementing features
* Document required environment variables
* Validate configuration at application startup

### 4.5 Data Transformation

* Keep data parsing/transformation logic in reusable helpers
* Map API responses to lean view models before passing to UI
* Test transformation logic independently
* Keep parsing logic colocated with feature or in shared utilities

### 4.6 UX Requirements

* Always render loading, empty, and error states
* Never show raw error objects to users
* Provide retry affordances for failed requests
* Bound retries to avoid infinite loops
* Use consistent styling for loading/error states

---

## 5. State Management

* Prefer local state closest to where it's used
* Avoid global state unless there's clear need for sharing
* Document state ownership and lifecycle
* Never introduce new state management libraries without architecture approval
* Consider the project's existing state management patterns before adding complexity

---

## 6. Styling Conventions

### 6.1 Styling Approach

* Follow the project's established styling methodology
* Prefer utility classes or design tokens over ad-hoc inline styles
* Minimize custom CSS when design system utilities exist

### 6.2 Design Tokens

* Use semantic design tokens when available (e.g., `surface`, `primary`, `accent`)
* Avoid hard-coded color/spacing values when tokens exist
* Document custom tokens with clear naming conventions

### 6.3 Layout & Responsiveness

* Use consistent spacing scales defined by the design system
* Design mobile-first, enhance for larger screens
* Test responsive behavior across target breakpoints

---

## 7. Forms

* Use controlled form components with explicit state management
* Implement validation logic at appropriate boundaries
* Provide clear, field-level error messages
* Consider form libraries for complex validation requirements (validate before adding dependencies)
* Validate on both client and server side when applicable

---

## 8. Performance

* Use optimized image loading techniques provided by your framework
* Avoid unnecessary network requests and data fetching
* Keep components/modules focused and small
* Memoize expensive computations
* Lazy load non-critical resources
* Monitor bundle size and runtime performance

---

## 9. Testing

### 9.1 Test Organization

* Write tests at appropriate levels: unit, integration, end-to-end
* Use the project's established testing frameworks and tools
* Colocate tests with code or organize in dedicated test directories
* Follow consistent naming conventions (e.g., `*.test.ts`, `*.spec.ts`)

### 9.2 Test Quality

* Ensure tests are isolated, repeatable, and meaningful
* Test edge cases, error conditions, and boundary values
* Use descriptive test names that explain what is being tested
* Avoid testing implementation details; focus on behavior

### 9.3 Mocking & Test Data

* Mock external dependencies and API calls
* Use test fixtures and factories for consistent test data
* Avoid hardcoding test data; use builders or generators
* Clean up test state between test runs

---

## 10. Imports & Code Style

* Follow the project's linting and formatting rules (ESLint, Prettier, etc.)
* Maintain consistent import ordering:
  1. External dependencies (npm packages)
  2. Internal/project modules
  3. Relative imports (components, utilities)
  4. Type imports (if applicable)
  5. Styles/assets
* Use absolute imports where configured for cleaner paths

---

## 11. UX & Error Handling

### 11.1 Error Categorization

* **Transient errors**: Network issues, temporary unavailability (show retry option)
* **User errors**: Validation failures, invalid input (provide clear guidance)
* **System errors**: Unexpected failures (show generic message, log details)

### 11.2 User-Facing Messages

* Never show raw error objects, stack traces, or technical details to users
* Provide clear, actionable success/failure messages
* Include correlation IDs in error messages for support/debugging
* Use consistent error message formatting across the application

### 11.3 Error Recovery

* Implement bounded retry logic with exponential backoff for transient errors
* Provide user affordances to retry failed operations
* Show loading states during retries
* Technical logs and stack traces stay in console or monitoring tools only

### 11.4 User Feedback

* Show immediate feedback for user actions (button states, spinners)
* Use toast/notification systems for non-blocking feedback
* Provide progress indicators for long-running operations
* Confirm destructive actions before execution

---

## 12. Forbidden on Frontend

The following are prohibited without explicit architectural approval:

* Adding new UI/CSS frameworks or competing libraries
* Direct database access from client code
* Using `any` type or disabling type checking
* Creating new global state managers without approval
* Inline complex styling that bypasses the design system
* Unapproved architectural changes
* Hardcoding API endpoints or configuration values
* Storing secrets or sensitive data in client code
* Bypassing established authentication/authorization patterns

---

## 13. Forbidden on Backend

The following are prohibited without explicit architectural approval:

* Adding new frameworks or ORMs that conflict with the stack
* Using `any` type or disabling type checking
* Direct SQL queries bypassing the ORM/query builder (unless performance-critical and approved)
* Hardcoded connection strings, secrets, or API keys
* Synchronous blocking operations in async contexts
* Endpoints without authentication/authorization checks
* Exposing internal error details or stack traces to clients
* Database schema changes without migrations
* Unapproved architectural changes
* Bypassing established logging/monitoring patterns
* Creating endpoints without rate limiting (where applicable)
* Accepting unvalidated input from clients
* Mass deletion operations without confirmation or soft-delete consideration
* Skipping database transaction boundaries for multi-step operations
* N+1 query patterns without justification and performance measurement
* Exposing admin/debug endpoints in production builds
* File uploads without size/type/content validation
* Returning sensitive data in API responses (passwords, tokens, internal IDs)
* Using eval() or dynamic code execution with user input
* Implementing custom cryptography instead of using standard libraries
* Skipping CORS configuration or using wildcard (*) origins in production
* Creating background jobs without error handling or retry logic
