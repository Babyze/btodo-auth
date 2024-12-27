import { Catch, ExceptionFilter, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ValidationError } from 'class-validator';
import { Observable, throwError } from 'rxjs';
import { Logger } from 'nestjs-pino';
import { InvalidAgrumentError, UnknownError } from 'btodo-utils';

@Catch()
@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: any): Observable<any> {
    this.logger.error(exception);
    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }

    if (exception instanceof ValidationError) {
      const errors = exception['message'] as string[];
      const message = 'Validation failed: ' + errors.join(', ');
      exception = new InvalidAgrumentError(message);
    } else {
      console.log(`unknow`, exception);
      exception = new UnknownError(exception?.toString() ?? 'Unknow');
    }

    return throwError(() => exception.getError());
  }
}
