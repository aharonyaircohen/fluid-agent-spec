## Conventional Commit and Stage/Execute Prompt

**Agent Goal:** Generate a concise, conventional commit message based on the input, then **stage all modified/untracked files** and **execute the commit** with the generated message.

-----

### 1 Commit Message Generation

**Agent Action:** Generate the final commit message string (`<GENERATED_COMMIT_MESSAGE>`) using the provided inputs and instructions.

** Input Variables:**

  * **Branch Name:** `<current_branch_name>`
  * **Changes Summary:** `<brief_list_of_files_and_changes>`
  * **Issue ID:** `<JIRA-123 or #456>`

**Instructions for Generation:**

1.  **Header (Max 50 chars):** Use the format `<type>(<scope>): <description>`.
      * **Types:** `feat`, `fix`, `refactor`, `style`, `chore`, `docs`.
      * **Breaking Change:** Add exclamation mark before the colon if applicable.
2.  **Body (Optional):** Explain what changed and why it was necessary.
3.  **Footer:** Add issue closure (e.g., `Closes: JIRA-123`).

**Example Generation (for reference):**

```
fix(auth): Correctly sanitize user input

The previous sanitization logic failed to catch certain encoded characters. Updated to use the latest version of the utility library which handles all known edge cases.

Closes: #456
```

-----

### 2 Staging and Execution

**Agent Action:** Execute the following Git commands in sequence.

1.  **Stage All Changes:** Stage all modified and untracked files in the working directory.

      * **Command:** `git add -A` (or `git add .` if `-A` is not supported in the environment)

2.  **Execute Commit:** Apply the generated commit message.

      * **Command:** `git commit -m "<GENERATED_COMMIT_MESSAGE>"`
      * *Note:* Ensure the full multi-line message is passed correctly to the commit command. If the commit command only takes a subject line (`-m`), the agent should use a script or wrapper to apply the full body and footer.

-----

### 3 Final Confirmation

**Agent Action:** Inform the user of the successful execution.

**Output to User:** "Files staged, and commit executed successfully with the following message: \\n\\n`<GENERATED_COMMIT_MESSAGE>`"
