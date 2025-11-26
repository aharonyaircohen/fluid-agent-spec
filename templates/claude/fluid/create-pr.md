### 1 PR Message Generation

**Agent Action:** Generate the final PR Title and Body string (`<GENERATED_PR_TITLE>` and `<GENERATED_PR_BODY>`) using the provided inputs and instructions.

**Input Variables:**

  * **Branch Name:** $\text{\textless\text{current\_branch\_name}\textgreater}$
  * **Changes Summary:** $\text{\textless\text{high-level\_summary}\textgreater}$
  * **Issue ID:** $\text{\textless\text{JIRA-123 or \#456}\textgreater}$
  * **Testing Steps:** $\text{\textless\text{steps\_for\_reviewer}\textgreater}$
  * **Target Branch (default `dev`):** $\text{\textless\text{target\_branch\_name}\textgreater}$

**Instructions for Generation:**

1.  **Title:** Create a direct, descriptive title. (Use this for `<GENERATED_PR_TITLE>`)
2.  **Summary, Details, Verification:** Format the rest of the content (Overview, Changes, Verification) into the Markdown body. (Use this for `<GENERATED_PR_BODY>`)

-----

### 2 Publish and Create PR Execution

**Agent Action:** Execute the necessary Git and CLI commands to publish the changes and create the PR.

1.  **Push Branch to Origin:** Ensure all local commits are on the remote.

      * **Command:** `git push -u origin <current_branch_name>`

2.  **Create Pull Request:** Use the appropriate CLI tool (assuming `gh` for GitHub or similar abstraction) to create the PR, piping in the generated content.

      * **Command (Conceptual):**
        ```bash
        <cli\_tool> pr create --title "<GENERATED_PR_TITLE>" \
            --body-file <temp\_file\_with\_GENERATED\_PR\_BODY> \
            --base <target\_branch\_name>
        ```

-----

### 3 Final Confirmation

**Agent Action:** Inform the user of the successful execution and provide the PR link.

**Output to User:** "Branch `<current\_branch\_name>` pushed to `origin`. Pull Request created successfully\! \\n\\n**Title:** `<GENERATED\_PR\_TITLE>` \\n**Link:** `<LINK\_TO\_NEWLY\_CREATED\_PR>`"
