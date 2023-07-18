import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}

  async validate(email: string) {
    return await this.prisma.user
      .findUnique({ where: { email } })
      .then((user) => !user);
  }
}
