import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

export interface ControllerResponse<T> {
  message: string;
  data: T;
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string | null;
}

function isControllerResponse<T>(data: unknown): data is ControllerResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    'data' in data
  );
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data: T) => {
        if (isControllerResponse<T>(data)) {
          return {
            statusCode: response.statusCode,
            message: data.message,
            data: data.data,
          };
        }

        return {
          statusCode: response.statusCode,
          message: 'Success',
          data,
        };
      }),
    );
  }
}
