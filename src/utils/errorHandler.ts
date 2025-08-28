/**
 * Error Handling and Logging Utilities
 * 
 * Provides centralized error handling, logging, and debugging utilities
 * for the entire application with component-specific error tracking.
 */

export interface AppError extends Error {
    component?: string;
    action?: string;
    service?: string;
    originalError?: unknown;
    timestamp?: string;
    userId?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface LogContext {
    component?: string;
    action?: string;
    service?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
}

class ErrorHandler {
    private isDevelopment = process.env.NODE_ENV === 'development';

    /**
     * Create a standardized error object
     */
    createError(
        message: string,
        context: LogContext,
        originalError?: unknown,
        severity: AppError['severity'] = 'medium'
    ): AppError {
        const error: AppError = {
            name: `${context.component || 'App'}Error`,
            message,
            component: context.component,
            action: context.action,
            service: context.service,
            originalError,
            timestamp: new Date().toISOString(),
            userId: context.userId,
            severity
        };

        return error;
    }

    /**
     * Log error with context
     */
    logError(error: AppError | Error, context?: LogContext): void {
        const errorInfo = {
            errorMessage: error.message,
            errorName: error.name,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            ...context,
            ...(error as AppError)
        };

        // Always log to console with component prefix
        const componentPrefix = context?.component ? `[${context.component}]` : '[App]';
        const actionSuffix = context?.action ? ` (${context.action})` : '';

        console.error(`${componentPrefix}${actionSuffix} Error:`, errorInfo);

        // In production, you might want to send to a logging service
        if (!this.isDevelopment) {
            this.sendToLoggingService(errorInfo);
        }
    }

    /**
     * Log info message with context
     */
    logInfo(message: string, context: LogContext, data?: unknown): void {
        const componentPrefix = context.component ? `[${context.component}]` : '[App]';
        const actionSuffix = context.action ? ` (${context.action})` : '';

        console.log(`${componentPrefix}${actionSuffix} Info:`, message, data || '');
    }

    /**
     * Log warning with context
     */
    logWarning(message: string, context: LogContext, data?: unknown): void {
        const componentPrefix = context.component ? `[${context.component}]` : '[App]';
        const actionSuffix = context.action ? ` (${context.action})` : '';

        console.warn(`${componentPrefix}${actionSuffix} Warning:`, message, data || '');
    }

    /**
     * Handle async operation with error catching
     */
    async handleAsync<T>(
        operation: () => Promise<T>,
        context: LogContext,
        fallbackValue?: T
    ): Promise<T | undefined> {
        try {
            this.logInfo(`Starting async operation`, context);
            const result = await operation();
            this.logInfo(`Async operation completed successfully`, context);
            return result;
        } catch (error) {
            const appError = this.createError(
                `Async operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                context,
                error,
                'high'
            );

            this.logError(appError, context);

            if (fallbackValue !== undefined) {
                this.logInfo(`Using fallback value`, context, fallbackValue);
                return fallbackValue;
            }

            throw appError;
        }
    }

    /**
     * Create a debug-friendly function wrapper
     */
    debugFunction<T extends (...args: any[]) => any>(
        fn: T,
        context: LogContext
    ): T {
        return ((...args: Parameters<T>) => {
            try {
                this.logInfo(`Function called`, context, { args: this.isDevelopment ? args : undefined });
                const result = fn(...args);

                if (result instanceof Promise) {
                    return result.catch((error) => {
                        const appError = this.createError(
                            `Function promise rejected: ${error instanceof Error ? error.message : 'Unknown error'}`,
                            context,
                            error
                        );
                        this.logError(appError, context);
                        throw appError;
                    });
                }

                this.logInfo(`Function completed`, context);
                return result;
            } catch (error) {
                const appError = this.createError(
                    `Function failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    context,
                    error
                );
                this.logError(appError, context);
                throw appError;
            }
        }) as T;
    }

    /**
     * Send error to external logging service (placeholder)
     */
    private sendToLoggingService(errorInfo: any): void {
        // In a real application, you would send this to a service like:
        // - Sentry
        // - LogRocket
        // - DataDog
        // - Custom logging API

        // For now, just store in localStorage as a simple example
        try {
            const existingLogs = JSON.parse(localStorage.getItem('app_error_logs') || '[]');
            existingLogs.push(errorInfo);

            // Keep only last 50 errors to prevent localStorage bloat
            const recentLogs = existingLogs.slice(-50);
            localStorage.setItem('app_error_logs', JSON.stringify(recentLogs));
        } catch (storageError) {
            console.warn('Failed to store error log:', storageError);
        }
    }

    /**
     * Get stored error logs (for debugging)
     */
    getStoredLogs(): any[] {
        try {
            return JSON.parse(localStorage.getItem('app_error_logs') || '[]');
        } catch {
            return [];
        }
    }

    /**
     * Clear stored error logs
     */
    clearStoredLogs(): void {
        try {
            localStorage.removeItem('app_error_logs');
            console.log('[ErrorHandler] Stored error logs cleared');
        } catch (error) {
            console.warn('[ErrorHandler] Failed to clear stored logs:', error);
        }
    }
}

// Export singleton instance
const errorHandler = new ErrorHandler();

// Export convenient utility functions
export const logError = errorHandler.logError.bind(errorHandler);
export const logInfo = errorHandler.logInfo.bind(errorHandler);
export const logWarning = errorHandler.logWarning.bind(errorHandler);
export const createError = errorHandler.createError.bind(errorHandler);
export const handleAsync = errorHandler.handleAsync.bind(errorHandler);
export const debugFunction = errorHandler.debugFunction.bind(errorHandler);
export const getStoredLogs = errorHandler.getStoredLogs.bind(errorHandler);
export const clearStoredLogs = errorHandler.clearStoredLogs.bind(errorHandler);

export default errorHandler;
