# Task Types

This document defines the **standard task types** used across the system.  
Every task MUST be classified as exactly one of these types.

---

## 1. feature

**Purpose:**  
Introduce new behavior, capability, or user-facing functionality.

**Examples:**
- Add a new page or screen.
- Implement a new API endpoint.
- Add a new integration.

**Typical specs to load:**
- architecture-standards
- coding-standards
- domain-modeling-rules
- api-rules
- testing-and-qa-standards
- logging-and-observability
- quality-gates

---

## 2. bugfix

**Purpose:**  
Correct existing behavior that is wrong, broken, or inconsistent with expectations.

**Examples:**
- Fix a crash.
- Correct wrong calculations.
- Fix a UI that doesn’t behave as specified.

**Typical specs to load:**
- coding-standards
- logging-and-observability
- error-recovery-protocols
- testing-and-qa-standards
- quality-gates

---

## 3. refactor

**Purpose:**  
Improve internal structure, readability, or design without changing observable behavior.

**Examples:**
- Split a large module into smaller ones.
- Simplify complex logic.
- Improve naming and structure.

**Typical specs to load:**
- architecture-standards
- code-structure-and-modularity
- coding-standards
- testing-and-qa-standards
- reliability-and-stability

---

## 4. infra

**Purpose:**  
Change infrastructure, CI/CD, deployment, environments, or observability.

**Examples:**
- Adjust build pipeline.
- Change deployment config.
- Improve monitoring or logging pipelines.

**Typical specs to load:**
- dev-environment-standards
- deployment-standards-ci-cd
- monitoring-and-observability
- release-engineering

---

## 5. spec

**Purpose:**  
Change specifications, standards, or documentation – including AIOS docs.

**Examples:**
- Update architecture guidelines.
- Add a new standard.
- Rewrite documentation.

**Typical specs to load:**
- documentation-standards
- versioning-and-release-management
- AIOS-CHANGELOG
