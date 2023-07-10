import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const refresh = this.config.get('JWT_REFRESH');
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '1m',
      secret,
    });
    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: refresh,
    });

    return { access_token, refresh_token };
  }

  async updateRefreshToken(userId: number, refresh_token: string) {
    const hash = await argon.hash(refresh_token);
    await this.prisma.user.update({
      data: { refreshHash: hash },
      where: {
        id: userId,
      },
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user && (await argon.verify(user.password, password))) {
      delete user.password;
      return user;
    }

    return null;
  }

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
      },
    });

    if (user) {
      const tokens = await this.signToken(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refresh_token);
      return tokens;
    }

    return null;
  }

  async signin(dto: AuthDto) {
    const user = await this.validateUser(dto.email, dto.password);

    if (user) {
      const tokens = await this.signToken(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refresh_token);
      return tokens;
    }

    return null;
  }

  async signout(userId: number) {
    await this.prisma.user.update({
      data: { refreshHash: null },
      where: { id: userId },
    });
    return true;
  }

  async refreshTokens() {
    const tokens = '';
    return tokens;
  }
}
