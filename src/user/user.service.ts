import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    return user;
  }

  async updateById(userId: string, body: any) {
    const hash = await argon.hash(body.password);
    const user = await this.prisma.user.update({
      data: {
        name: body.name,
        password: hash,
      },
      where: {
        id: Number(userId),
      },
    });

    return user.id;
  }

  async deleteById(userId: string) {
    const user = await this.prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });

    return user.id;
  }
}
