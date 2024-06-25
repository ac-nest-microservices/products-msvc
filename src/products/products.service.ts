import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  readonly #logger = new Logger(ProductsService.name);

  async onModuleInit() {
    await this.$connect();
    this.#logger.log('Connected to the database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto });
  }

  async findAll({ page, limit }: PaginationDto) {
    const totalProducts = await this.product.count({
      where: { available: true },
    });
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      data: await this.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: { available: true },
      }),
      meta: {
        total: totalProducts,
        lastPage: totalPages,
        page,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID #${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const { id: _, ...data } = updateProductDto;

    return this.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // return this.product.delete({ where: { id } });

    return this.product.update({
      where: { id },
      data: { available: false },
    });
  }
}
