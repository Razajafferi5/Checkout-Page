type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

const sanitizeData = (data: unknown): unknown => {
  if (!data || typeof data !== 'object') return data;
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  const sensitiveKeys = [
    'password', 'token', 'secret', 'authorization', 'api_token',
    'cardNumber', 'cvv', 'cvc', 'pan', 'card_number', 'accessToken'
  ];

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const formatLog = (level: LogLevel, message: string, context?: Record<string, unknown>) => {
  const timestamp = new Date().toISOString();
  const safeContext = context ? ` | Context: ${JSON.stringify(sanitizeData(context))}` : '';
  return `[${timestamp}] [${level}] [PayFlow]: ${message}${safeContext}`;
};

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    console.log(formatLog('INFO', message, context));
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(formatLog('WARN', message, context));
  },
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined }
      : error;
    console.error(formatLog('ERROR', message, { ...context, error: errorDetails }));
  },
  debug: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatLog('DEBUG', message, context));
    }
  }
};
