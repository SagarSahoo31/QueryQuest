import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    hint?: string;
    details?: Record<string, unknown>;
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        errorResponse = {
          success: false,
          error: {
            code: (resp.code as string) || this.getCodeFromStatus(status),
            message: (resp.message as string) || exception.message,
            hint: resp.hint as string | undefined,
            details: resp.details as Record<string, unknown> | undefined,
          },
        };
      } else {
        errorResponse = {
          success: false,
          error: {
            code: this.getCodeFromStatus(status),
            message: exception.message,
          },
        };
      }
    } else if (exception instanceof Error) {
      errorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message:
            process.env.NODE_ENV === 'production'
              ? 'An unexpected error occurred'
              : exception.message,
        },
      };
    }

    // Log error in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Exception:', exception);
    }

    response.status(status).json(errorResponse);
  }

  private getCodeFromStatus(status: number): string {
    const codeMap: Record<number, string> = {
      400: 'VALIDATION_ERROR',
      401: 'AUTH_UNAUTHORIZED',
      403: 'AUTH_FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      429: 'RATE_LIMIT_EXCEEDED',
      500: 'INTERNAL_ERROR',
      503: 'SERVICE_UNAVAILABLE',
    };
    return codeMap[status] || 'UNKNOWN_ERROR';
  }
}
