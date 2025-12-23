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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { Permission } from '../common/enums/permission.enum';
import { Role } from '../common/enums/role.enum';

/**
 * Users Controller
 * 
 * All endpoints require authentication.
 * Different endpoints have different authorization requirements.
 */
@Controller('users')
@UseGuards(JwtAuthGuard) // All endpoints require authentication
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user
   * Requires: Doctor role or WRITE_USERS permission
   */
  @Post()
  @UseGuards(RolesGuard, PermissionsGuard)
  @Roles(Role.Doctor, Role.ADMIN)
  @Permissions(Permission.WRITE_USERS)
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  /**
   * Get a user by ID
   * Requires: READ_USERS permission
   */
  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.READ_USERS)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Get all users
   * Requires: READ_USERS permission
   */
  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(Permission.READ_USERS)
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
