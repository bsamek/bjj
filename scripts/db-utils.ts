import type { AppData } from '../src/types/index.ts';

export interface UserData {
  userId: string;
  data: AppData;
}

export interface DatabaseDump {
  exportedAt: string;
  users: UserData[];
}

export function createDump(users: UserData[]): DatabaseDump {
  return {
    exportedAt: new Date().toISOString(),
    users,
  };
}

export function parseDump(content: string): DatabaseDump {
  const parsed = JSON.parse(content) as DatabaseDump;

  if (!parsed.exportedAt || !Array.isArray(parsed.users)) {
    throw new Error('Invalid dump format: missing exportedAt or users array');
  }

  for (const user of parsed.users) {
    if (!user.userId || !user.data) {
      throw new Error(`Invalid user entry: missing userId or data`);
    }
  }

  return parsed;
}

export function formatUserSummary(userId: string, data: AppData): string {
  const positionCount = data.positions?.length ?? 0;
  const principleCount = data.principles?.length ?? 0;
  return `User ID: ${userId}\n  Positions: ${positionCount}\n  Principles: ${principleCount}`;
}

export function serializeDump(dump: DatabaseDump): string {
  return JSON.stringify(dump, null, 2);
}
