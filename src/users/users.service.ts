import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.prismaService.user.create({
        data,
      });
    } catch (error) {
      console.log('create error', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (error.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new user cannot be created with this email',
          );
        }
      }
      // Make sure to either rethrow the error or return something appropriate
      throw error; // or return a custom response
    }
  }

  async findAll() {
    return await this.prismaService.user.findMany({
      omit: {
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prismaService.user.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
