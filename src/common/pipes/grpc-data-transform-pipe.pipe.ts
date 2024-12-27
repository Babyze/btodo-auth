import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Timestamp } from 'btodo-utils';
import Long from 'long';

@Injectable()
export class GrpcDataTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'custom') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.transformValue(item));
    }

    return this.transformValue(value);
  }

  private transformValue(value: any) {
    if (value && value.second) {
      return new Timestamp(value.second);
    }

    if (Long.isLong(value)) {
      return value.toNumber();
    }

    if (typeof value === 'object') {
      const transformed: any = {};
      for (const key of Object.keys(value)) {
        transformed[key] = this.transformValue(value[key]);
      }
      return transformed;
    }

    return value;
  }
}
