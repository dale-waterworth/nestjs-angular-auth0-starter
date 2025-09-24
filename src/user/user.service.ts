import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { User } from './user.entity';

export interface CreateUserDto {
  email: string;
  authid: string;
}

export interface UpdateUserDto {
  email?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger,
  ) {}

  async findAll(): Promise<User[]> {
    this.logger.info('Finding all users');
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    this.logger.info({ userId: id }, 'Finding user by ID');
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn({ userId: id }, 'User not found by ID');
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.info({ userId: id, email: user.email }, 'User found by ID');
    return user;
  }

  async findByAuthId(authid: string): Promise<User | null> {
    this.logger.info({ authid }, 'Finding user by Auth ID');
    const user = await this.userRepository.findOne({ where: { authid } });
    if (user) {
      this.logger.info({ userId: user.id, authid }, 'User found by Auth ID');
    } else {
      this.logger.info({ authid }, 'User not found by Auth ID');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.info({ email }, 'Finding user by email');
    return this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.info({ email: createUserDto.email, authid: createUserDto.authid }, 'Creating new user');
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);
    this.logger.info({ userId: savedUser.id, email: savedUser.email }, 'User created successfully');
    return savedUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.info({ userId: id, updates: updateUserDto }, 'Updating user');
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    this.logger.info({ userId: id }, 'User updated successfully');
    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    this.logger.info({ userId: id }, 'Deleting user');
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn({ userId: id }, 'User not found for deletion');
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.info({ userId: id }, 'User deleted successfully');
  }
}
