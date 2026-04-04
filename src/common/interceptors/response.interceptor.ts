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

export interface ApiResponse<T> {
  message: string;
  data: T;
  statusCode: number;
}

function isControllerResponse<T>(
  value: unknown,
): value is ControllerResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    'data' in value
  );
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T | ControllerResponse<T>,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T | ControllerResponse<T>>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((payload): ApiResponse<T> => {
        if (isControllerResponse<T>(payload)) {
          return {
            message: payload.message,
            data: payload.data,
            statusCode: response.statusCode,
          };
        }

        return {
          message: 'Success',
          data: payload,
          statusCode: response.statusCode,
        };
      }),
    );
  }
}
