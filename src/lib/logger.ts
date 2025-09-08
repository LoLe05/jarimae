export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  data?: any
  userId?: string
  requestId?: string
}

class Logger {
  private logLevel: LogLevel
  private logs: LogEntry[] = []

  constructor() {
    this.logLevel = process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel
  }

  private createLogEntry(level: LogLevel, message: string, data?: any, context?: { userId?: string; requestId?: string }): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      data,
      userId: context?.userId,
      requestId: context?.requestId
    }
  }

  private formatMessage(entry: LogEntry): string {
    const levelNames = ['ERROR', 'WARN', 'INFO', 'DEBUG']
    const levelName = levelNames[entry.level]
    const timestamp = entry.timestamp.toISOString()
    
    let message = `[${timestamp}] ${levelName}: ${entry.message}`
    
    if (entry.userId) {
      message += ` | User: ${entry.userId}`
    }
    
    if (entry.requestId) {
      message += ` | Request: ${entry.requestId}`
    }
    
    return message
  }

  private writeLog(entry: LogEntry) {
    if (!this.shouldLog(entry.level)) return

    const message = this.formatMessage(entry)
    
    // 콘솔 출력
    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(message, entry.data)
        break
      case LogLevel.WARN:
        console.warn(message, entry.data)
        break
      case LogLevel.INFO:
        console.info(message, entry.data)
        break
      case LogLevel.DEBUG:
        console.debug(message, entry.data)
        break
    }

    // 메모리에 로그 저장 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      this.logs.push(entry)
      
      // 메모리 사용량 제한
      if (this.logs.length > 1000) {
        this.logs = this.logs.slice(-500)
      }
    }
  }

  error(message: string, data?: any, context?: { userId?: string; requestId?: string }) {
    const entry = this.createLogEntry(LogLevel.ERROR, message, data, context)
    this.writeLog(entry)
  }

  warn(message: string, data?: any, context?: { userId?: string; requestId?: string }) {
    const entry = this.createLogEntry(LogLevel.WARN, message, data, context)
    this.writeLog(entry)
  }

  info(message: string, data?: any, context?: { userId?: string; requestId?: string }) {
    const entry = this.createLogEntry(LogLevel.INFO, message, data, context)
    this.writeLog(entry)
  }

  debug(message: string, data?: any, context?: { userId?: string; requestId?: string }) {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, data, context)
    this.writeLog(entry)
  }

  // API 요청 로깅
  apiRequest(method: string, url: string, userId?: string, requestId?: string) {
    this.info(`API ${method} ${url}`, undefined, { userId, requestId })
  }

  // API 응답 로깅
  apiResponse(method: string, url: string, status: number, duration: number, userId?: string, requestId?: string) {
    const message = `API ${method} ${url} - ${status} (${duration}ms)`
    
    if (status >= 400) {
      this.error(message, undefined, { userId, requestId })
    } else {
      this.info(message, undefined, { userId, requestId })
    }
  }

  // 데이터베이스 쿼리 로깅
  dbQuery(query: string, duration: number, error?: any) {
    if (error) {
      this.error(`DB Query failed: ${query}`, { error, duration })
    } else {
      this.debug(`DB Query: ${query} (${duration}ms)`)
    }
  }

  // 사용자 활동 로깅
  userActivity(userId: string, action: string, data?: any) {
    this.info(`User activity: ${action}`, data, { userId })
  }

  // 보안 관련 로깅
  security(message: string, data?: any, userId?: string) {
    this.warn(`SECURITY: ${message}`, data, { userId })
  }

  // 메모리 내 로그 조회 (개발 환경)
  getLogs(level?: LogLevel, limit: number = 100): LogEntry[] {
    let filteredLogs = this.logs
    
    if (level !== undefined) {
      filteredLogs = this.logs.filter(log => log.level === level)
    }
    
    return filteredLogs.slice(-limit)
  }

  // 로그 클리어
  clearLogs() {
    this.logs = []
  }
}

// 싱글톤 로거 인스턴스
export const logger = new Logger()

// 글로벌 에러 핸들러 (클라이언트 사이드)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.error('Global error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
      reason: event.reason
    })
  })
}

// API 미들웨어용 로깅 함수
export function logApiRequest(request: Request, userId?: string) {
  const requestId = Math.random().toString(36).substring(2, 15)
  const url = new URL(request.url)
  
  logger.apiRequest(request.method, url.pathname, userId, requestId)
  
  return requestId
}

export function logApiResponse(
  request: Request,
  response: Response,
  startTime: number,
  requestId: string,
  userId?: string
) {
  const url = new URL(request.url)
  const duration = Date.now() - startTime
  
  logger.apiResponse(
    request.method,
    url.pathname,
    response.status,
    duration,
    userId,
    requestId
  )
}