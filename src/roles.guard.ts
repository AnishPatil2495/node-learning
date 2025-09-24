import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    // In a real app, you'd get the user from the request
    // const { user } = context.switchToHttp().getRequest();
    // For this example, we'll mock it.
    const mockUser = {
      id: 1,
      name: 'Dr. Smith',
      roles: [Role.Doctor], // or [Role.Patient]
    };

    return requiredRoles.some((role) => mockUser.roles?.includes(role));
  }
}
