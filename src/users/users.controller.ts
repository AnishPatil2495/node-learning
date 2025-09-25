import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('Doctor')
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
