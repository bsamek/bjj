# Development Guide

## Prerequisites

- Node.js 20 or later
- npm

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Testing

```bash
npm run test        # Run tests in watch mode
npm run test:run    # Run tests once
```

## Linting

```bash
npm run lint
```

## Database

### Prerequisites

The database scripts require a Firebase service account file. Place `service-account.json` in the project root.

### Dump Database

Export all user data to a JSON file:

```bash
npm run db:dump              # Exports to db-dump.json
npm run db:dump <filename>   # Exports to custom file
```

### Restore Database

Import data from a JSON file:

```bash
npm run db:restore <filename>
```

### List Users

```bash
npm run db list-users
```

## Deployment

```bash
just deploy
```

## Pre-commit Hook

This project includes a pre-commit hook that runs the same checks as CI:

1. ESLint (`npm run lint`)
2. TypeScript type checking (`npx tsc -b`)
3. Tests (`npm run test:run`)

### Installing the Pre-commit Hook

To install the pre-commit hook, configure Git to use the `.githooks` directory:

```bash
git config core.hooksPath .githooks
```

This only needs to be done once per clone of the repository.

### Bypassing the Hook

If you need to commit without running the checks (not recommended), you can use:

```bash
git commit --no-verify
```
