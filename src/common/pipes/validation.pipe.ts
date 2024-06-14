import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ValidationPipe implements PipeTransform {
    transform(value: any, { metatype }: ArgumentMetadata): any {}
}
