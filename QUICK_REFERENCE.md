# Quick Reference - JWT Authentication System

## 🚀 Quick Start

1. **Install packages:**
   ```bash
   npm install bcrypt @types/bcrypt @nestjs/config
   ```

2. **Create `.env` file:**
   ```env
   JWT_SECRET=your-secret-key-here
   PORT=3000
   ```

3. **Start the application:**
   ```bash
   npm run start:dev
   ```

## 📡 API Endpoints

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get Current User
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

### Logout
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

## 🛡️ Protecting Routes

### Authentication Only
```typescript
@UseGuards(JwtAuthGuard)
```

### Role-Based
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
```

### Permission-Based
```typescript
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions(Permission.READ_USERS)
```

### Resource Ownership
```typescript
@UseGuards(JwtAuthGuard, ResourceOwnershipGuard)
```

## 🔑 Roles

- `admin` - Full access
- `user` - Basic user
- `service` - M2M service
- `Doctor` - Healthcare provider
- `Patient` - Patient
- `Pharmacy` - Pharmacy service

## 📋 Common Permissions

- `read:users`, `write:users`, `delete:users`
- `read:prescriptions`, `write:prescriptions`
- `read:pharmacy`, `write:pharmacy`
- `manage:system` (admin only)

## 🔧 Common Tasks

### Hash Password
```typescript
const hashedPassword = await authService.hashPassword('password123');
```

### Generate Tokens
```typescript
const tokens = await authService.generateTokens(user);
```

### Validate Token
```typescript
const payload = authService.validateToken(token);
```

### Check Blacklist
```typescript
const isBlacklisted = await tokenBlacklistService.isTokenBlacklisted(token);
```

## ⚠️ Error Codes

- `401 Unauthorized` - Invalid/missing token
- `403 Forbidden` - Insufficient permissions
- `400 Bad Request` - Invalid input

## 📝 Request Object

After authentication, `req.user` contains:
```typescript
{
  sub: number;        // User ID
  email: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}
```

