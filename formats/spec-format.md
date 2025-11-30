---

id: <document-id>
type: agent-spec            # agent-spec | task-spec | arch-doc | convention | schema
status: draft               # active | draft | deprecated
version: 1.0.0
owner: platform/aios
lastUpdated: YYYY-MM-DD
related: []                 # list of document ids
--------------------------------------------------

# <Document Title>

## Imports

* [`other-spec`](../specs/other-spec.md)

> REF: type=agent-spec id=other-spec path=../specs/other-spec.md

## Exports

* Defines <Contract>
* Provides <Input/Output structures>

## Purpose and Goals

1–2 short sentences describing the agent’s purpose and required outcome.

## Responsibilities

* Responsibility A
* Responsibility B
* Not responsible for X, Y

## Inputs and Configuration

```ts
interface Config {
  enabled: boolean;
  rootDir: string;
}
```

## Outputs and Contracts

```ts
interface Output {
  summary: string;
}
```

## Internal Architecture

* Module A
* Module B
* Execution Flow: Step1 → Step2 → Step3

## Failure Modes

* Invalid config → fail
* Missing dependency → fail
* Unexpected error → fail gracefully

## Integration Points

* Consumed by: [`task-manager-spec`](../specs/task-manager-spec.md)

## Testing and Validation

* Unit tests for Module A
* Integration tests for Module B
* Schema validation

## Open Questions / Future Work

* Future extension A
* Optimization opportunity B
