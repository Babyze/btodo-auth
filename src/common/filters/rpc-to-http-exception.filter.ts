import {
  BadRequestException,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InvalidAgrumentError, UnknownError } from 'btodo-utils';
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
    } else {
      console.log(`unknow`, exception);
      exception = new UnknownError(exception?.toString() ?? 'Unknow');
    }

    return throwError(() => exception.getError());
  }
}
