import { ServerWritableStreamImpl } from '@grpc/grpc-js/build/src/server-call';
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
    const serverWritableStreamImpl = context
      .getArgs()
      .find((obj) => obj instanceof ServerWritableStreamImpl);
    const path = serverWritableStreamImpl.getPath();
    const data = context.switchToRpc().getData();
    const metadata = context.switchToRpc().getContext();
    this.logger.log(
      `Path: ${path} | Data: ${JSON.stringify(data)} | Metadata: ${JSON.stringify(metadata)}`,
    );

    return next
      .handle()
      .pipe(map((data: any) => transformDataTogRPCData(data)));
  }
}
