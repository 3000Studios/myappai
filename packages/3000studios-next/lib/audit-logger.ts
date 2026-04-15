/**
 * Audit Logging System
 * Immutable log of all system changes
 */

import fs from 'fs';
import path from 'path';

const AUDIT_LOG = path.join(process.cwd(), 'audit.log');

export interface AuditEntry {
  timestamp: string;
  type: 'voice' | 'content' | 'media' | 'deploy' | 'revenue' | 'auth';
  action: string;
  user?: string;
  payload?: any;
}

export function logAudit(entry: Omit<AuditEntry, 'timestamp'>) {
  const auditEntry: AuditEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };

  const logLine = JSON.stringify(auditEntry) + '\n';
  fs.appendFileSync(AUDIT_LOG, logLine);

  return auditEntry;
}

export function getAuditLog(limit: number = 100): AuditEntry[] {
  if (!fs.existsSync(AUDIT_LOG)) return [];

  const logs = fs
    .readFileSync(AUDIT_LOG, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .reverse()
    .slice(0, limit);

  return logs;
}

export function searchAuditLog(type?: string, action?: string): AuditEntry[] {
  const logs = getAuditLog(1000);

  return logs.filter((log) => {
    if (type && log.type !== type) return false;
    if (action && !log.action.includes(action)) return false;
    return true;
  });
}

