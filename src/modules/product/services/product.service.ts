import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem, Product, User } from 'src/database/entities';
import { productMessages } from 'src/messages/product.message';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from '../Dtos';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
  ) {}

  async create(data: CreateProductDto, seller: User) {
    const product = this.productRepo.create({ ...data, seller });
    await this.productRepo.save(product);
    return {
      message: productMessages.success.PRODUCT_CREATE_SUCCESS,
      data: {
        product,
      },
    };
  }

  async update(
    productId: number,
    data: UpdateProductDto,
    user: User,
    alsoAllowedIfNotOwner = false,
  ) {
    const owner = {};
    if (!alsoAllowedIfNotOwner) {
      owner['sellerId'] = user.userId;
    }
    const product = await this.findProductById(productId, owner);
    Object.assign(product, data);
    await this.productRepo.save(product);
    return {
      message: productMessages.success.PRODUCT_UPDATION_SUCCESS,
      data: {
        product,
      },
    };
  }

  async delete(productId: number, user: User, alsoAllowedIfNotOwner = false) {
    const owner = {};
    if (!alsoAllowedIfNotOwner) {
      owner['sellerId'] = user.userId;
    }
    const product = await this.findProductById(productId, owner);
    const cartItems = await this.cartItemRepo.findBy({
      productId: product.productId,
    });
    await this.cartItemRepo.remove(cartItems);
    await this.productRepo.softRemove(product);
    return {
      message: productMessages.success.PRODUCT_DELETE_SUCCESS,
      data: {},
    };
  }

  async findProductById(productId: number, filters?: Partial<Product>) {
    const product = await this.productRepo.findOneBy({ productId, ...filters });
    if (!product) {
      throw new NotFoundException(productMessages.error.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  async findProducts(skip: number, take: number) {
    const products = await this.productRepo.findAndCount({ skip, take });
    return {
      message: productMessages.success.PRODUCTS_FETCH_SUCCESS,
      data: { products: products[0], totalProducts: products[1] },
    };
  }

  async findUsersProducts(userId: number) {
    const products = await this.productRepo.findBy({ sellerId: userId });
    return {
      message: productMessages.success.PRODUCTS_FETCH_SUCCESS,
      data: { products: products[0], totalProducts: products[1] },
    };
  }
}
