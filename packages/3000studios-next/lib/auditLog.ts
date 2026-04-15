/**
 * Audit Log System
 * Immutable log of all voice commands and system changes
 */

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  userId: string;
  userEmail: string;
  action: string;
  category: 'content' | 'store' | 'system' | 'admin';
  target?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  error?: string;
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];

  async log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const logEntry: AuditLogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    // Add to local cache
    this.logs.push(logEntry);

    // Persist to backend
    try {
      await fetch('/api/audit-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error: unknown) {
      console.error("", error);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[AuditLog]', logEntry);
    }
  }

  async getLogs(filters?: {
    userId?: string;
    category?: string;
    startDate?: number;
    endDate?: number;
    limit?: number;
  }): Promise<AuditLogEntry[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.userId) params.append('userId', filters.userId);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.startDate) params.append('startDate', filters.startDate.toString());
      if (filters?.endDate) params.append('endDate', filters.endDate.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/audit-logs?${params.toString()}`);
      const data = await response.json();
      return data.logs || [];
    } catch (error: unknown) {
      console.error("", error);
      return this.logs; // Fallback to local cache
    }
  }

  getLocalLogs(): AuditLogEntry[] {
    return this.logs;
  }
}

// Singleton instance
let auditLoggerInstance: AuditLogger | null = null;

export function getAuditLogger(): AuditLogger {
  if (!auditLoggerInstance) {
    auditLoggerInstance = new AuditLogger();
  }
  return auditLoggerInstance;
}

