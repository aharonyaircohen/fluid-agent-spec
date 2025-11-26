## Feature Branch Creation Command

**Agent Goal:** Interactively create a new feature branch following Conventional Commits semantics, ensuring the process starts from a clean, updated `dev` branch.

**IMPORTANT:** This command is INTERACTIVE. Ask the user two questions before creating the branch.

---

### 1. Ask User for Branch Information

**Agent Action:** Ask the user two questions to gather branch information.

**Question 1: Branch Type**
Ask: "What type of change is this?"

Provide these options:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code restructuring
- `style` - Code style changes (formatting, etc.)
- `chore` - Maintenance, tooling, dependencies
- `docs` - Documentation only

**Question 2: Task Purpose**
Ask: "What is the short purpose of this task?"

Example answers:
- "add multiple answers to exercise"
- "fix login authentication bug"
- "refactor course component"

---

### 2. Pre-Flight Checks & Preparation

**Agent Action:** Execute necessary Git commands to ensure the environment is ready.

1.  **Check Current Branch:** Verify the current branch is `dev`.
    * *If not `dev`:* Execute `git checkout dev`.
    * *If `dev` checkout fails:* Abort and inform the user.
2.  **Check Working Directory:** Verify the working directory is clean.
    * *If dirty:* Abort and inform the user: "Working directory is dirty. Please commit or stash changes before creating a new branch."
3.  **Fetch & Pull Latest:** Update the local `dev` branch.
    * Execute `git fetch --all --prune`.
    * Execute `git pull origin dev`.
    * *If pull fails:* Abort and inform the user.

---

### 3. Generate Branch Name

**Agent Action:** Use the user's answers to generate the branch name.

**Input Variables:**
- `<Branch_Type>` - From Question 1 (e.g., `feat`, `fix`, `refactor`, etc.)
- `<Task_Purpose>` - From Question 2 (e.g., "add multiple answers to exercise")

**Branch Name Generation:**
1. **Type:** Use the exact type provided by the user
2. **Description Slug:** Convert the task purpose to lowercase with hyphens
   - Example: "add multiple answers to exercise" → `add-multiple-answers-to-exercise`
3. **Final Format:** `<type>/<description-slug>`

**Examples:**
- Type: `feat`, Purpose: "add multiple answers to exercise" → `feat/add-multiple-answers-to-exercise`
- Type: `fix`, Purpose: "fix login authentication bug" → `fix/fix-login-authentication-bug`
- Type: `refactor`, Purpose: "refactor course component" → `refactor/refactor-course-component`

---

### 4. Create and Switch Branch

**Agent Action:** Execute the final branch creation command.

1.  **Generate Branch Name:** Construct the final name (e.g., `feat/profile/implement-user-profile-page`).
2.  **Execute Command:** Execute `git checkout -b <Agent-Generated-Branch-Name>`.

**Final Output to User:** "Successfully created and switched to branch: `<Agent-Generated-Branch-Name>`"

---

## Execution Summary

**INTERACTIVE WORKFLOW** - Execute these steps in order:

1. ✅ **Ask Question 1:** "What type of change is this?" (Provide 6 options: feat, fix, refactor, style, chore, docs)
2. ✅ **Ask Question 2:** "What is the short purpose of this task?" (Wait for user's description)
3. ✅ **Pre-flight checks:**
   - Check current branch (switch to `dev` if needed)
   - Verify clean working directory
   - Fetch and pull latest from `origin/dev`
4. ✅ **Generate branch name:** `<type>/<task-purpose-slug>`
5. ✅ **Create and checkout new branch**
6. ✅ **Report success to user**

**Example Interaction:**
```
Agent: "What type of change is this?"
Options: feat, fix, refactor, style, chore, docs

User: "feat"

Agent: "What is the short purpose of this task?"

User: "add multiple answers to exercise"

Agent: [Executes pre-flight checks]
Agent: "Successfully created and switched to branch: feat/add-multiple-answers-to-exercise"
```
