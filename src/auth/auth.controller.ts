import {
  Body,
  Controller,
  Get,
  Req,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { JwtRefreshGuard } from './guard';
import { Public } from 'src/decorator/';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Public()
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('me')
  getMe() {
    return 'my info';
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refreshToken(@Headers('Authorization') header: string, @Req() req: any) {
    const refreshToken = header.replace('Bearer', '').trim();
    const userId: number = req.user['sub'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
