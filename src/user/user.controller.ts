import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/user')
export class UserController {
  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Request() req: any) {
    return {
      user: req.auth,
      message: 'This is a protected route',
    };
  }
}