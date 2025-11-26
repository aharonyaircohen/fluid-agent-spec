# FluidSpec Constraints — High Standards

This document defines **non-negotiable constraints** for AI agents working with FluidSpec tasks.
Agents must treat these as hard rules when performing any task.

**Related Documents:**
- For implementation patterns and coding conventions, see `conventions.md`
- Rule precedence: Constraints (this document) > Conventions > Project-specific decisions

---

## 1. General Behaviour

1. Always prioritize **correctness**, **clarity**, and **determinism** over creativity.
2. Never guess when a requirement is ambiguous **if** an explicit constraint exists; otherwise, choose the safest, least-surprising default and state it explicitly.
3. Do not change the chosen stack, architecture, or design system unless explicitly instructed.
4. Prefer **fewer, higher-quality steps** over many vague steps.
5. Always make the solution **reproducible** from scratch: list commands, files, and configuration needed.
6. Never remove or weaken existing constraints defined in any spec or schema files.
7. If a requested action conflicts with an existing spec, **flag the conflict and propose a resolution**, do not silently comply.
8. **Rule precedence**: Apply `Security > Quality Gates > Domain Standards > Recommended Practices`. When in doubt, enforce the stricter rule and escalate ambiguities.

---

## 2. Output Format & Discipline

1. Follow the **requested format exactly** (Markdown, JSON, code block, etc.).
2. When asked for JSON, return **only valid JSON**, with no comments or surrounding text.
3. When asked for Markdown, use clear headings, lists, and code blocks.
4. Do not mix languages within one code file (e.g., no partial Hebrew/English in code).
5. Use consistent naming conventions throughout a single response (e.g., `camelCase` for JS/TS, `kebab-case` for file names).
6. Avoid placeholder text like `TODO` unless the user explicitly wants open tasks.

---

## 3. Technical Quality Constraints

1. All code must be **syntactically valid** for the target language.
2. Use strong typing when available in the language (TypeScript, type hints, etc.).
3. Include **types** for function parameters, return values, and important objects.
4. Avoid global mutable state unless explicitly required.
5. Avoid unnecessary dependencies; prefer the **standard library** and existing tools in the stack.
6. When changing configuration, show the **full final version** of the file or the exact diff.
7. Always consider **idempotency** of scripts and setup commands: they should be safe to run more than once.
8. Do not introduce frameworks or libraries that conflict with the existing stack.
9. **Clarity over cleverness**: Write single-responsibility functions with explicit side effects and error handling.
10. Remove dead code immediately; avoid commented-out code blocks.
11. Use safe defaults and never hard-code or log secrets in source code.
12. Avoid premature optimization; require hypotheses, baselines, and measurements for performance work.

---

## 4. Project Stack Constraints

When working on a specific project, respect the established technology stack:

1. **Architecture**: Follow the project's architectural patterns (monorepo, microservices, etc.).
2. **Backend**:
   * Use the designated backend framework and database.
   * Schema changes require migrations before production deployment.
   * Database seeding operations should be documented as destructive.
   * All sensitive configuration via environment variables.
3. **Frontend**:
   * Use the designated frontend framework and language.
   * Follow the project's state management patterns.
   * Configure API endpoints via environment variables.
   * Do not introduce competing solutions without justification.
4. **Design system**:
   * Respect existing design tokens and naming conventions.
   * Do not invent ad-hoc styles if a design system exists.

---

## 5. Interaction With Specs & Schemas

1. When a spec file exists, treat it as **source of truth** for that domain.
2. When a schema file exists, validate that outputs conform to it.
3. Never contradict spec documents; if a change is needed, **propose a spec update** instead of returning conflicting instructions.
4. Prefer producing output in the project's standard schema format when applicable.

---

## 6. Safety & Consistency Constraints

1. Do not expose secrets, tokens, passwords, or connection strings beyond placeholders.
2. Use environment variables for all sensitive values.
3. Do not hardcode hostnames or ports; follow the project's environment variable conventions.
4. Always ensure that instructions work on a **clean checkout** of the repository.

---

## 7. Step-by-Step Execution Constraints

1. When describing installation or setup, always provide:

   * The directory to run the command from.
   * The exact command.
   * The expected result or next check.
2. For file edits, always specify:

   * File path (relative to project root or app root).
   * Whether the file is **new** or **modified**.
   * The complete content if it is short/critical, or the full relevant section if large.
3. When a process involves multiple terminals (e.g. backend + frontend dev servers), clearly indicate which command runs where.
4. Any non-trivial change must end with a **short verification checklist** ("open URL X", "run command Y", "expect Z").

---

## 8. Error Handling & Ambiguity

1. If an instruction might break existing work, clearly label it as **destructive** or **potentially destructive**.
2. If the requested outcome conflicts with the stack (e.g. switching DB engine), explicitly warn and suggest a safe migration path.
3. If information is missing but a decision is required, choose the most conservative default and **state it explicitly**.

---

## 9. Language & Tone

1. Use clear, direct technical language.
2. Avoid marketing language, emotional framing, and unnecessary adjectives.
3. Focus on **what to do** and **how to do it**.

---

## 10. Architecture & Design Decisions

1. **Document architecture decisions** with problem statement, options considered, chosen solution, rationale, and trade-offs.
2. Design for **graceful degradation** with explicit contracts and schemas.
3. Document latency expectations, error modes, and lifecycle hooks.
4. State scalability assumptions and monitoring/observability signals.
5. Keep modules **acyclic** with clear ownership and bounded contexts.
6. Design systems with **explicit contracts** at boundaries; avoid tight coupling.

---

## 11. Domain Modeling

1. Define **canonical models** with clear ownership and lifecycle states.
2. Enforce **invariants** near mutations; validate at boundaries.
3. Version breaking changes with **migration strategies**.
4. Reconcile duplicates with explicit reconciliation rules.
5. Events and commands carry **stable schemas** with causality metadata.
6. Avoid leaking domain internals across bounded contexts.

---

## 12. Frontend Architecture & UI/UX

1. **Separation of concerns**: Separate presentation, state management, and data access.
2. **Single source of truth**: Each piece of state has one clear owner.
3. **State handling**: Explicitly handle loading, empty, error, and success states in UI.
4. Keep components **composable** with clear responsibilities.
5. Set explicit **performance budgets** for bundle size and render time.
6. **Error messages**: User-friendly with correlation IDs logged for debugging.
7. **Strong typing**: Use strict typing, avoid `any`, explicit prop types, avoid non-null assertions.
8. **Component organization**: Presentational components separate from business logic.
9. Logic belongs in **dedicated modules**, not in component render functions.
10. **Prefer named exports** for better refactoring and tree-shaking.

---

## 13. Code Structure & Modularity

1. Keep modules **purpose-stated** with clear ownership and avoid circular dependencies.
2. Expose only **stable public interfaces**; do not leak internal implementation details.
3. Inject configuration and feature flags at module boundaries rather than deep inside logic.
4. Design modules to be **acyclic** and maintain clear dependency graphs.

---

## 14. Security Standards

1. **Least privilege**: Grant minimum necessary permissions; enforce secure-by-default configurations.
2. **Secrets management**: Externalize all secrets to environment variables; rotate credentials regularly.
3. **Input validation**: Validate and sanitize all inputs at trust boundaries (user input, external APIs).
4. **Authentication & authorization**: Require auth at every entry point; enforce authorization per action/resource with audit trails.
5. **Credentials**: Use short-lived tokens with expiration and revocation capabilities.
6. Never skip security scans in CI; block releases on critical findings.
7. **Data classification**: Identify sensitive data and apply encryption where required.

---

## 15. API Standards

1. Publish **versioned contracts** and changelogs for all APIs.
2. Validate all inputs and standardize error responses with appropriate HTTP status codes.
3. Enforce authentication and authorization per operation.
4. Set **rate limits** and timeout quotas for all endpoints.
5. Provide observability hooks (logging, metrics, tracing) for all API operations.
6. Breaking changes must ship as **new versions** with clear deprecation timelines and migration paths.

---

## 16. Database Standards

1. Declare **data ownership**, retention policies, and backup/restore procedures.
2. Version all schema changes with forward/backward compatibility strategies.
3. Enforce **least privilege** database access; rotate credentials regularly.
4. Review query performance and maintain indexes for critical paths.
5. Monitor replication lag, capacity, and health metrics.
6. Never expose database credentials in code; use environment variables only.

---

## 17. Dependency Management

1. Every dependency requires: **justification**, owner, pinned version, and license review.
2. Remove unused or shadowed dependencies immediately.
3. Maintain a dependency inventory with versions and known security risks.
4. Schedule regular update cycles and act on end-of-life (EOL) notices with migration plans.
5. Review security advisories and apply patches promptly.
6. Deduplicate dependencies in lockfiles; keep lockfiles in version control.

---

## 18. Testing & Quality Gates

1. Every change carries **risk-appropriate tests** (unit, integration, end-to-end).
2. Tests must be **isolated and hermetic** where possible; use controlled/anonymized test data.
3. Quarantine or fix **flaky tests** immediately; do not merge code with failing tests.
4. Test results **gate merges and releases**; no exceptions without explicit approval.
5. Protected branches require: automated tests passing, security scans clear, linting compliance.
6. Include **smoke tests** before production releases; verify rollback readiness.

---

## 19. Observability & Logging

1. Emit **structured logs** with correlation IDs; redact sensitive data.
2. Define consistent log levels (DEBUG, INFO, WARN, ERROR) and use appropriately.
3. Collect **metrics** for latency, errors, saturation, and key business signals.
4. Implement **distributed tracing** across service boundaries with context propagation.
5. Set retention policies and access controls for logs and metrics.
6. Define **SLIs and SLOs** for critical services; create actionable alerts with owners and runbooks.

---

## 20. Error Handling & Recovery

1. Categorize errors: **transient** (retry), **user** (actionable message), **systemic** (alert).
2. Implement bounded retries with **exponential backoff** and **idempotency**.
3. Provide **actionable user messages** without leaking internal details.
4. Test recovery, rollback, and compensation paths.
5. Log errors with correlation IDs for distributed debugging.
6. Never swallow exceptions silently; always log or handle explicitly.

---

## 21. Accessibility Requirements

1. **Keyboard operability**: All interactive elements must be keyboard-accessible.
2. **Focus management**: Visible focus indicators; logical tab order.
3. **Contrast and sizing**: Meet WCAG AA standards minimum; use relative units for text.
4. **Semantic HTML**: Use meaningful labels, roles, and ARIA attributes where appropriate.
5. **Error messages**: Clear, actionable, and programmatically associated with form fields.
6. **Skip navigation**: Provide skip links and focus patterns for complex layouts.
7. **Media**: Include captions/transcripts for audio/video content.
8. Accessibility testing is a **release gate**; automated and manual checks required.

---

## 22. Git Workflow & Code Review

1. **Branch per task**: Create feature/bugfix branches from main; use descriptive names with task identifiers.
2. **Commits**: Write concise, scoped commits with clear messages; reference task IDs.
3. **No direct pushes** to protected branches (main, production).
4. **Merge strategy**: Use consistent merge/rebase strategy; resolve conflicts locally.
5. **Code reviews**: Require at least one non-author reviewer before merge.
6. **Review criteria**: Validate against task scope, acceptance criteria, and all applicable standards.
7. Label **blocking issues** with severity and rule references.
8. Large or risky changes need extra reviewers or staged rollout plans.
9. Record review outcomes and rationale.

---

## 23. Documentation Standards

1. Update relevant documentation for **all significant changes**.
2. Include: scope, assumptions, owners, and last review dates.
3. **Runbooks** must be testable with clear rollback steps.
4. Inline comments should explain **intent and why**, not just what.
5. Track documentation debt as you would track defects.
6. Keep README files current with setup, build, test, and deployment instructions.

---

## 24. Deployment & Release Standards

1. Deployments must be **atomic and revertible**; have rollback and roll-forward plans.
2. Configuration is **injected**, not baked into artifacts.
3. Artifacts must be **traceable** to commits, tasks, and approvals.
4. Prefer **progressive rollout** with automated verification (canary, blue-green).
5. Critical deployment paths must be automated and codified.
6. **Release gates**: All tests pass, security scans clear, required documentation updated.
7. Store signed/checksummed artifacts in controlled locations.
8. Emergency releases require approved protocol and post-incident review.

---

## 25. Versioning & Compatibility

1. **Breaking changes** require new major version or explicit migration guidance.
2. Release tags map to **immutable artifacts** with full traceability.
3. Deprecations include timelines and support policies.
4. Pre-releases must be clearly labeled; block from production unless explicitly approved.
5. Communicate compatibility in changelogs and API documentation.

---

## 26. Configuration Management

1. All configuration is **externalized** and version-controlled.
2. Validate configuration at load time; fail fast with clear error messages.
3. Feature flags default to **safe state** with owners and cleanup dates.
4. Store secrets separately from application config (use environment variables, secret managers).
5. Configuration changes must be auditable.
6. Provide configuration schemas for validation.

---

## 27. Development Environment

1. Dev environments must be **scripted and reproducible** with versioned tool dependencies.
2. Secure local secrets; never commit them to version control.
3. Anonymize sample data for local development.
4. Document any **production parity gaps**.
5. Support environment teardown to avoid resource leaks.
6. Provide clear setup instructions that work on clean checkouts.

---

These constraints are always active.
Any agent reading this file must conform to them for every task, unless the user explicitly overrides a specific constraint in a given instruction.
