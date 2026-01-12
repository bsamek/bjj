import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { AppData } from '../src/types/index.ts';
import {
  createDump,
  parseDump,
  formatUserSummary,
  serializeDump,
  type UserData,
} from './db-utils.ts';

const SERVICE_ACCOUNT_PATH = resolve(process.cwd(), 'service-account.json');
const DEFAULT_DUMP_PATH = resolve(process.cwd(), 'db-dump.json');

function initFirebase() {
  if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error('Error: service-account.json not found in project root.');
    console.error('');
    console.error('To set up Firebase Admin credentials:');
    console.error('1. Go to https://console.firebase.google.com/');
    console.error('2. Select your project');
    console.error('3. Go to Project Settings > Service Accounts');
    console.error('4. Click "Generate new private key"');
    console.error('5. Save the file as service-account.json in the project root');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(
    readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8')
  ) as ServiceAccount;

  initializeApp({
    credential: cert(serviceAccount),
  });

  return getFirestore();
}

async function listUsers(db: FirebaseFirestore.Firestore) {
  console.log('Fetching users from Firestore...\n');

  const usersSnapshot = await db.collection('users').get();

  if (usersSnapshot.empty) {
    console.log('No users found in the database.');
    return;
  }

  console.log(`Found ${usersSnapshot.size} user(s):\n`);

  for (const doc of usersSnapshot.docs) {
    const data = doc.data() as AppData;
    console.log(`  ${formatUserSummary(doc.id, data)}`);
    console.log('');
  }
}

async function dumpDatabase(db: FirebaseFirestore.Firestore, outputPath: string) {
  console.log('Exporting database...\n');

  const usersSnapshot = await db.collection('users').get();

  if (usersSnapshot.empty) {
    console.log('No users found in the database.');
    return;
  }

  const users: UserData[] = [];

  for (const doc of usersSnapshot.docs) {
    users.push({
      userId: doc.id,
      data: doc.data() as AppData,
    });
  }

  const dump = createDump(users);
  writeFileSync(outputPath, serializeDump(dump));
  console.log(`Exported ${users.length} user(s) to ${outputPath}`);
}

async function restore(db: FirebaseFirestore.Firestore, inputPath: string) {
  if (!existsSync(inputPath)) {
    console.error(`Error: File not found: ${inputPath}`);
    process.exit(1);
  }

  console.log(`Reading from ${inputPath}...\n`);

  const content = readFileSync(inputPath, 'utf-8');
  const dump = parseDump(content);

  console.log(`Found ${dump.users.length} user(s) to restore.`);
  console.log(`Export date: ${dump.exportedAt}\n`);

  for (const user of dump.users) {
    console.log(`  Restoring user: ${user.userId}...`);
    await db.collection('users').doc(user.userId).set(user.data);
    console.log(`    Done.`);
  }

  console.log('\nRestore complete.');
}

function printUsage() {
  console.log('BJJ Study Database Management Tool\n');
  console.log('Usage:');
  console.log('  npm run db <command> [options]\n');
  console.log('Commands:');
  console.log('  list-users              List all users in the database');
  console.log('  dump [output-file]      Export all data to JSON (default: db-dump.json)');
  console.log('  restore <input-file>    Import data from JSON file\n');
  console.log('Examples:');
  console.log('  npm run db list-users');
  console.log('  npm run db dump');
  console.log('  npm run db dump my-backup.json');
  console.log('  npm run db restore db-dump.json');
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help' || command === '--help') {
    printUsage();
    process.exit(0);
  }

  const db = initFirebase();

  switch (command) {
    case 'list-users':
      await listUsers(db);
      break;

    case 'dump': {
      const outputPath = args[1] ? resolve(process.cwd(), args[1]) : DEFAULT_DUMP_PATH;
      await dumpDatabase(db, outputPath);
      break;
    }

    case 'restore': {
      const inputPath = args[1];
      if (!inputPath) {
        console.error('Error: Please specify a file to restore from.');
        console.error('Usage: npm run db restore <input-file>');
        process.exit(1);
      }
      await restore(db, resolve(process.cwd(), inputPath));
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run "npm run db help" for usage information.');
      process.exit(1);
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
