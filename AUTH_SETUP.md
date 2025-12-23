# Authentication System Setup Guide

This guide will help you set up the production-grade JWT-based authentication system.

## 📦 Required Packages

Install the following packages:

```bash
npm install bcrypt @types/bcrypt @nestjs/config
```

Optional (for cookie-based refresh tokens):
```bash
npm install cookie-parser @types/cookie-parser
```

## 🔧 Configuration

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development

# CORS (optional)
CORS_ORIGIN=http://localhost:3000
```

**⚠️ IMPORTANT:** 
- Change `JWT_SECRET` to a strong, random string in production
- Never commit `.env` file to version control
- Use different secrets for different environments

### 2. Database Migration

The `TokenBlacklist` entity will be automatically created when you run the application (since `synchronize: true` is enabled).

For production, create a migration:

```bash
# The token_blacklist table will be created automatically
# Make sure TypeORM synchronize is set to false in production
```

## 🚀 Usage

### Authentication Endpoints

#### 1. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user",
    "permissions": ["read:prescriptions", "read:history"]
  }
}
```

#### 2. Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // optional
}
```

#### 4. Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

#### 5. Machine-to-Machine Token
```http
POST /auth/m2m/token
Content-Type: application/json

{
  "serviceId": "example-service",
  "serviceSecret": "example-secret"
}
```

### Protecting Routes

See `src/auth/examples/protected-route.example.ts` for comprehensive examples.

#### Basic Protection (Authentication Only)
```typescript
@Get('protected')
@UseGuards(JwtAuthGuard)
getProtectedData(@Request() req) {
  return { user: req.user };
}
```

#### Role-Based Access
```typescript
@Get('admin-only')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
getAdminData() {
  return { message: 'Admin data' };
}
```

#### Permission-Based Access
```typescript
@Get('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions(Permission.READ_USERS)
getUsers() {
  return { users: [] };
}
```

#### Resource Ownership
```typescript
@Get('profile/:id')
@UseGuards(JwtAuthGuard, ResourceOwnershipGuard)
getProfile(@Request() req) {
  // Only allows access if req.params.id === req.user.sub
  // (unless user is admin/service)
  return { profile: {} };
}
```

## 🔐 Security Features

### Token Strategy
- **Access Tokens**: Short-lived (15 minutes) for API authorization
- **Refresh Tokens**: Long-lived (7 days) for token renewal
- **Token Rotation**: Refresh tokens are rotated on every use
- **Blacklisting**: Tokens can be revoked immediately

### Password Security
- Passwords are hashed using bcrypt (10 salt rounds)
- Constant-time comparison prevents timing attacks
- Never stored in plain text

### Token Security
- Signed with HS256 algorithm
- Includes standard JWT claims (iss, aud, exp, iat)
- Blacklist checking on every request
- Clock skew handling

## 📊 Roles and Permissions

### Roles
- `admin`: Full system access
- `user`: Basic authenticated user
- `service`: Machine-to-machine service accounts
- `Doctor`: Healthcare provider (domain-specific)
- `Patient`: Patient role (domain-specific)
- `Pharmacy`: Pharmacy service (domain-specific)

### Permissions
See `src/common/enums/permission.enum.ts` for full list.

Role-to-permission mapping is defined in `src/common/mappings/role-permissions.map.ts`.

## 🔍 Auditing and Logging

All authentication events are logged:
- Login attempts (success/failure)
- Token refresh events
- Logout events
- Authorization failures
- Suspicious activity

Logs are output to console. In production, integrate with:
- External logging services (Splunk, CloudWatch, etc.)
- Database storage for compliance
- Security monitoring systems

## 🛠️ Troubleshooting

### "Cannot find module 'bcrypt'"
```bash
npm install bcrypt @types/bcrypt
```

### "Cannot find module '@nestjs/config'"
```bash
npm install @nestjs/config
```

### Token validation fails
- Check JWT_SECRET matches between token generation and validation
- Verify token hasn't expired
- Check if token is blacklisted
- Ensure Authorization header format: `Bearer <token>`

### Password hashing issues
- Ensure passwords are hashed when creating users
- Use `AuthService.hashPassword()` method
- Legacy plain-text passwords won't work (migration needed)

## 📝 Next Steps

1. **Install required packages** (see above)
2. **Set up environment variables** (create `.env` file)
3. **Update user registration** to hash passwords:
   ```typescript
   const hashedPassword = await authService.hashPassword(password);
   // Use hashedPassword when creating user
   ```
4. **Migrate existing users** (if any) to use hashed passwords
5. **Configure CORS** for your frontend domain
6. **Set up production secrets** (use secrets manager)
7. **Enable rate limiting** for login endpoints
8. **Set up monitoring** for authentication events

## 🔄 Extensibility

The system is designed to support:
- OAuth2 providers (Google, GitHub)
- SSO / external identity providers
- API key authentication
- Multi-tenant authorization
- Custom permission models

See code comments for extension points.

