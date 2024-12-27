import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { transformDataTogRPCData } from 'btodo-utils';
import { Logger } from 'nestjs-pino';
import { map, Observable } from 'rxjs';

@Injectable()
export class GrpcDataTransformInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    this.logger.log(
      `Data: ${JSON.stringify(
        context.switchToRpc().getData(),
      )} - Context: ${JSON.stringify(context.switchToRpc().getContext())}`,
    );

    return next
      .handle()
      .pipe(map((data: any) => transformDataTogRPCData(data)));
  }
}
