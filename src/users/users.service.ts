import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { email: username },
    });
    return user || undefined;
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user || undefined;
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // ... other methods
}
