import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe, Headers } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserService, CreateUserDto, UpdateUserDto } from './user.service';

@Controller('api/user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @InjectPinoLogger(UserController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get('profile')
  getProfile(@Request() req: any) {
    return {
      user: req.auth,
      message: 'This is a protected route',
    };
  }

  @Post('sync')
  async syncUser(@Request() req: any, @Headers('authorization') authHeader: string) {
    const authId = req.auth.sub;
    this.logger.info({ authId }, 'User sync requested');

    // Check if user already exists
    let user = await this.userService.findByAuthId(authId);

    if (!user) {
      this.logger.info({ authId }, 'User not found, creating new user from Auth0');
      // Extract token from "Bearer <token>"
      const token = authHeader.replace('Bearer ', '');

      // Fetch user info from Auth0
      const userInfo = await this.authService.getUserInfo(token);

      // Create new user in database
      user = await this.userService.create({
        email: userInfo.email,
        authid: userInfo.sub,
      });
      this.logger.info({ userId: user.id, authId }, 'New user created from Auth0');
    } else {
      this.logger.info({ userId: user.id, authId }, 'User already exists in database');
    }

    return {
      user,
      message: user ? 'User synced successfully' : 'User created successfully',
    };
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.userService.delete(id);
    return { message: `User ${id} deleted successfully` };
  }
}