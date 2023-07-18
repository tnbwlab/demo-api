import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@Req() req: Request) {
    console.log(req);
    return 'get me';
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    const user = this.userService.findById(id);
    console.log(user);
    return user;
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() body: { name?: string; password: string },
  ) {
    console.log(id);
    console.log(body);
    const result = this.userService.updateById(id, { ...body, test: 123 });
    console.log(result);
    return result;
  }

  @Delete(':id')
  @HttpCode(200)
  deleteUser(@Param('id') id: string) {
    const result = this.userService.deleteById(id);
    console.log(result);
    return result;
  }
}
