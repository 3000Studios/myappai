/**
 * Production Logger Utility
 * Replaces console.log with environment-aware logging
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  info(message: string, ...args: unknown[]) {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]) {
    console.warn(`[WARN] ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]) {
    console.error(`[ERROR] ${message}`, ...args);
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  }

  debug(message: string, ...args: unknown[]) {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  log(level: LogLevel, message: string, ...args: unknown[]) {
    switch (level) {
      case 'info':
        this.info(message, ...args);
        break;
      case 'warn':
        this.warn(message, ...args);
        break;
      case 'error':
        this.error(message, ...args);
        break;
      case 'debug':
        this.debug(message, ...args);
        break;
    }
  }
}

export const logger = new Logger();

