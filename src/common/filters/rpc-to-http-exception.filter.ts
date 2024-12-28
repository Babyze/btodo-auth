import {
  BadRequestException,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import {
  InvalidAgrumentError,
  UnauthenticatedError,
  UnknownError,
} from 'btodo-utils';
import { Logger } from 'nestjs-pino';
import { Observable, throwError } from 'rxjs';

@Catch()
@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: any): Observable<any> {
    this.logger.error(exception);
    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }

    if (exception instanceof BadRequestException) {
      const messages = (exception.getResponse() as any).message as string[];
      const message = messages.join(', ');
      exception = new InvalidAgrumentError(message);
    } else if (
      exception instanceof TokenExpiredError ||
      exception instanceof JsonWebTokenError
    ) {
      exception = new UnauthenticatedError(exception.message);
    } else {
      console.log(`unknow`, exception);
      exception = new UnknownError(exception?.toString() ?? 'Unknow');
    }

    return throwError(() => exception.getError());
  }
}
