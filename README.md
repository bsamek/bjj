# BJJ Study

A React application for BJJ study and training.

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Testing

```bash
npm run test        # Run tests in watch mode
npm run test:run    # Run tests once
```

### Linting

```bash
npm run lint
```

### Deployment

```bash
just deploy
```

## Database Management

The project includes a CLI script for managing Firestore data.

### Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Save the file as `service-account.json` in the project root

### Commands

```bash
# List all users and their data counts
npm run db list-users

# Export all data to db-dump.json
npm run db dump

# Export to a custom file
npm run db dump my-backup.json

# Restore data from a JSON file
npm run db restore db-dump.json
```

### Backup and Restore Workflow

1. Export current data: `npm run db dump`
2. Edit `db-dump.json` as needed
3. Apply changes: `npm run db restore db-dump.json`

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
