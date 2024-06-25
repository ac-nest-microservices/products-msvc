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
    const totalProducts = await this.product.count();
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      data: await this.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
      }),
      meta: {
        total: totalProducts,
        lastPage: totalPages,
        page,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID #${id} not found`);
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
