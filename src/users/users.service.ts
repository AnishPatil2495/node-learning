import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    const cacheKey = `user:email:${username}`;
    const cached = await this.cacheManager.get<User>(cacheKey);
    if (cached) {
      return cached;
    }

    const user = await this.usersRepository.findOne({
      where: { email: username },
    });
    if (user) {
      await this.cacheManager.set(cacheKey, user, 60_000); // 60s
    }
    return user || undefined;
  }

  async findOne(id: number): Promise<User | undefined> {
    const cacheKey = `user:id:${id}`;
    const cached = await this.cacheManager.get<User>(cacheKey);
    if (cached) {
      return cached;
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      await this.cacheManager.set(cacheKey, user, 60_000); // 60s
    }
    return user || undefined;
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    const saved = await this.usersRepository.save(newUser);
    // Invalidate basic user caches
    await this.cacheManager.del('users:all');
    await this.cacheManager.del(`user:email:${saved.email}`);
    await this.cacheManager.del(`user:id:${saved.id}`);
    return saved;
  }

  async findAll(): Promise<User[]> {
    const cacheKey = 'users:all';
    const cached = await this.cacheManager.get<User[]>(cacheKey);
    if (cached) {
      return cached;
    }
    const users = await this.usersRepository.find();
    await this.cacheManager.set(cacheKey, users, 60_000); // 60s
    return users;
  }

  // ... other methods
}
