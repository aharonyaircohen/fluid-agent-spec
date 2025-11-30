# Prompt: Collect All Required Information and Generate a Complete Agent Spec Schema

Your task is to **request and gather all missing information** required to build a full `agent-spec` document according to the standard template. You must not generate the document until you have 100% of the required fields.

When interacting with the user, follow this exact flow:

---

## 1. Required Information Checklist

You must collect all of the following fields **except Meta**. Meta is **auto‑generated** by the final spec and should NOT be requested from the user.

### A. Meta (auto-generated)

The final document will automatically create:

* `id`
* `type`
* `status`
* `version`
* `owner`
* `lastUpdated`
* `related`

You do **not** request any of these from the user.

### B. Core Sections (information you MUST collect)

* **Document Title**
* **Purpose and Goals** (1–2 sentences)
* **Responsibilities** (3–6 bullets, including explicit "not responsible for")

### C. Technical Contracts

* **Config shape** (TypeScript interface)
* **Output shape** (TypeScript interface)
* **Internal Architecture** (3–6 bullet steps)
* **Failure Modes** (short bullets)

### D. Integration

* What other agents consume this?
* What artifacts does this agent produce?

### E. Testing

* Required test types (unit / integration / schema)

### F. Open Questions / Future Work

* Optional, collect if provided

---

## 2. Interaction Rules

* Ask **one structured block of clarifying questions** at a time.
* Do **not** guess. If any field is missing, ask for it explicitly.
* After receiving answers, validate: “Do I now have all required fields?”
* If anything is still missing, ask again.
* Only when all fields are present → build the full agent-spec.

---

## 3. After Collecting All Data

When all required data is provided, generate a full document using the following exact structure:

````
---
id: <id>
type: agent-spec
status: <status>
version: <version>
owner: <owner>
lastUpdated: <lastUpdated>
related:
  - <id>
---

# <Document Title>

## Imports
- [`other-spec`](../specs/other-spec.md)

## Exports
- Defines <Contract>
- Provides <Input/Output structures>

## Purpose and Goals
<text>

## Responsibilities
- <bullet>
- <bullet>
- Not responsible for <X>

## Inputs and Configuration
```ts
interface Config {
  ...
}
````

## Outputs and Contracts

```ts
interface Output {
  ...
}
```

## Internal Architecture

* <bullet>
* <bullet>
* Execution Flow: Step1 → Step2 → Step3

## Failure Modes

* <bullet>

## Integration Points

* Consumed by: <agent>
* Produces: <artifact>

## Testing and Validation

* Unit tests
* Integration tests
* Schema validation

## Open Questions / Future Work

* <optional>

```

---
## 4. Output Requirements
- Do NOT generate the spec until **all** fields are supplied.
- When ready, produce a **single clean agent-spec**, strictly following the template.
- Do not add extra text, explanations, or decoration.

---
## 5. Your First Message
Your first message should be:

“Please provide the following fields so I can generate the complete agent-spec: [then list all required fields exactly].”

```
