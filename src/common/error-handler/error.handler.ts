import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

      let message = 'Internal Server Error';
      if (exception instanceof HttpException) {
        const response = exception.getResponse();
        if (typeof response === 'string') {
          message = response;
        } else if (typeof response === 'object' && 'message' in response) {
          message = (response['message'] as string);
        }
      } else if (exception.message) {
        message = exception.message;
      }
      
    this.logger.error(`An error occurred on path ${request.url}: ${message}`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}