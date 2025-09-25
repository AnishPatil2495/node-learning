import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: Partial<User>): Promise<User> {
    const { email } = userData;
    if (!email) {
      throw new ConflictException('Email is required for registration');
    }
    const existingUser = await this.usersService.findByUsername(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    // In a real application, you should hash the password here.
    // For example, using bcrypt:
    // userData.password = await bcrypt.hash(userData.password, 10);
    return this.usersService.create(userData);
  }
}
