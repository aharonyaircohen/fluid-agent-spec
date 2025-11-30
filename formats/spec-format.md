task_id: test-task-001
title: "Authentication landing"
type: feature
status: active
summary: "Implement a secure login surface for the application."
goal: "Allow users to authenticate with username and password."
background: "This page sits in front of the existing auth service."
aios_specs:
  core:
    - "src/auth/login.ts"
    - "config/auth.json"
    - "src/database/connection.ts"
  extra:
    - "docs/login.md"
constraints:
  - "Use existing design tokens"
  - "Validate input on the client and server"
acceptance_criteria:
  - "Login form renders username and password inputs"
  - "Submitting valid credentials returns JWT tokens"
expected_outputs:
  - "index.html"
  - "session token"
notes: "No additional assets beyond static HTML are required."
owner: platform/test
version: "1.0.0"
git_integration:
  enabled: true
  branch: dev
  commit_message_format: "feature(task-<id>): <short description>"
