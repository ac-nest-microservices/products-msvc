import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsPositive } from 'class-validator';

import { CreateProductDto } from './create-product.dto';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  id: number;
}
