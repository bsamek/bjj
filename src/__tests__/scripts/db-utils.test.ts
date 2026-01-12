import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createDump,
  parseDump,
  formatUserSummary,
  serializeDump,
  type UserData,
  type DatabaseDump,
} from '../../../scripts/db-utils';
import type { AppData } from '../../types';

describe('db-utils', () => {
  describe('createDump', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-15T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('creates a dump with timestamp and users', () => {
      const users: UserData[] = [
        {
          userId: 'user1',
          data: {
            positions: [],
            principles: [],
          },
        },
      ];

      const dump = createDump(users);

      expect(dump.exportedAt).toBe('2025-01-15T12:00:00.000Z');
      expect(dump.users).toEqual(users);
    });

    it('handles empty users array', () => {
      const dump = createDump([]);

      expect(dump.users).toEqual([]);
      expect(dump.exportedAt).toBeDefined();
    });
  });

  describe('parseDump', () => {
    it('parses valid dump content', () => {
      const content = JSON.stringify({
        exportedAt: '2025-01-15T12:00:00.000Z',
        users: [
          {
            userId: 'user1',
            data: {
              positions: [],
              principles: [],
            },
          },
        ],
      });

      const dump = parseDump(content);

      expect(dump.exportedAt).toBe('2025-01-15T12:00:00.000Z');
      expect(dump.users).toHaveLength(1);
      expect(dump.users[0].userId).toBe('user1');
    });

    it('throws on invalid JSON', () => {
      expect(() => parseDump('invalid json{')).toThrow();
    });

    it('throws when exportedAt is missing', () => {
      const content = JSON.stringify({
        users: [],
      });

      expect(() => parseDump(content)).toThrow('Invalid dump format');
    });

    it('throws when users is not an array', () => {
      const content = JSON.stringify({
        exportedAt: '2025-01-15T12:00:00.000Z',
        users: 'not-an-array',
      });

      expect(() => parseDump(content)).toThrow('Invalid dump format');
    });

    it('throws when user entry is missing userId', () => {
      const content = JSON.stringify({
        exportedAt: '2025-01-15T12:00:00.000Z',
        users: [{ data: { positions: [], principles: [] } }],
      });

      expect(() => parseDump(content)).toThrow('Invalid user entry');
    });

    it('throws when user entry is missing data', () => {
      const content = JSON.stringify({
        exportedAt: '2025-01-15T12:00:00.000Z',
        users: [{ userId: 'user1' }],
      });

      expect(() => parseDump(content)).toThrow('Invalid user entry');
    });
  });

  describe('formatUserSummary', () => {
    it('formats user with positions and principles', () => {
      const data: AppData = {
        positions: [
          {
            id: '1',
            name: 'Guard',
            top: { doFirst: [], techniques: [], transitions: [], notes: [] },
            bottom: { doFirst: [], techniques: [], transitions: [], notes: [] },
          },
          {
            id: '2',
            name: 'Mount',
            top: { doFirst: [], techniques: [], transitions: [], notes: [] },
            bottom: { doFirst: [], techniques: [], transitions: [], notes: [] },
          },
        ],
        principles: [
          { id: '1', content: 'Principle 1' },
          { id: '2', content: 'Principle 2' },
          { id: '3', content: 'Principle 3' },
        ],
      };

      const summary = formatUserSummary('user123', data);

      expect(summary).toContain('User ID: user123');
      expect(summary).toContain('Positions: 2');
      expect(summary).toContain('Principles: 3');
    });

    it('handles empty data', () => {
      const data: AppData = {
        positions: [],
        principles: [],
      };

      const summary = formatUserSummary('user123', data);

      expect(summary).toContain('Positions: 0');
      expect(summary).toContain('Principles: 0');
    });

    it('handles undefined arrays', () => {
      const data = {} as AppData;

      const summary = formatUserSummary('user123', data);

      expect(summary).toContain('Positions: 0');
      expect(summary).toContain('Principles: 0');
    });
  });

  describe('serializeDump', () => {
    it('serializes dump to formatted JSON', () => {
      const dump: DatabaseDump = {
        exportedAt: '2025-01-15T12:00:00.000Z',
        users: [
          {
            userId: 'user1',
            data: {
              positions: [],
              principles: [],
            },
          },
        ],
      };

      const serialized = serializeDump(dump);
      const parsed = JSON.parse(serialized);

      expect(parsed).toEqual(dump);
      // Check it's formatted (has indentation)
      expect(serialized).toContain('\n  ');
    });
  });
});
