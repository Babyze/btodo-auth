import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { transformgRPCToData } from 'btodo-utils';

@Injectable()
export class GrpcDataTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'custom') {
      return value;
    }

    return transformgRPCToData(value);
  }
}
