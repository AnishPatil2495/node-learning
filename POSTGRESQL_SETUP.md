# PostgreSQL Database Configuration

This guide explains how to configure PostgreSQL database for the prescription management application.

## 📦 Installation

### 1. Install PostgreSQL Driver

```bash
npm install pg
```

### 2. Install PostgreSQL (if not already installed)

**macOS**:
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian**:
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows**:
Download and install from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

## 🔧 Configuration

### 1. Create Database

Connect to PostgreSQL and create a database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE prescription_db;

# Create user (optional, for better security)
CREATE USER prescription_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE prescription_db TO prescription_user;

# Exit psql
\q
```

### 2. Environment Variables

Create or update your `.env` file:

```env
# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=prescription_db
DB_SSL=false

# For production with SSL
# DB_SSL=true

# Application Configuration
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-key-change-this-in-production

# CORS (optional)
CORS_ORIGIN=http://localhost:3000
```

### 3. Database Type Selection

The application supports both SQLite (default) and PostgreSQL:

**SQLite** (default):
```env
DB_TYPE=sqlite
DB_DATABASE=db.sqlite
```

**PostgreSQL**:
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=prescription_db
```

## 🚀 Usage

### Development Mode

1. Set environment variables in `.env` file
2. Start the application:
   ```bash
   npm run start:dev
   ```

The application will automatically:
- Connect to PostgreSQL
- Create tables based on entities (if `synchronize: true`)
- Run migrations if configured

### Production Mode

**⚠️ IMPORTANT**: Set `synchronize: false` in production and use migrations!

1. Update `.env`:
   ```env
   NODE_ENV=production
   DB_TYPE=postgres
   DB_HOST=your-production-host
   DB_PORT=5432
   DB_USERNAME=your-username
   DB_PASSWORD=your-secure-password
   DB_NAME=prescription_db
   DB_SSL=true
   ```

2. Run migrations:
   ```bash
   npm run migration:run
   ```

3. Start the application:
   ```bash
   npm run start:prod
   ```

## 📊 Database Schema

The application automatically creates the following tables:

- `user` - User accounts
- `prescription` - Prescriptions
- `pharmacy` - Pharmacy information
- `history` - Prescription history
- `token_blacklist` - Blacklisted JWT tokens

## 🔐 Security Best Practices

1. **Use Environment Variables**: Never hardcode database credentials
2. **Use SSL in Production**: Set `DB_SSL=true` for production
3. **Create Dedicated User**: Don't use the `postgres` superuser in production
4. **Strong Passwords**: Use strong, unique passwords
5. **Connection Pooling**: TypeORM handles connection pooling automatically
6. **Backup Regularly**: Set up automated database backups

## 🛠️ Troubleshooting

### Connection Refused

**Error**: `connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:
1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Start PostgreSQL:
   ```bash
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

### Authentication Failed

**Error**: `password authentication failed for user`

**Solution**:
1. Check username and password in `.env`
2. Verify user exists:
   ```bash
   psql -U postgres -c "\du"
   ```
3. Reset password if needed:
   ```sql
   ALTER USER postgres WITH PASSWORD 'new_password';
   ```

### Database Does Not Exist

**Error**: `database "prescription_db" does not exist`

**Solution**:
```bash
psql -U postgres
CREATE DATABASE prescription_db;
\q
```

### SSL Connection Issues

**Error**: `SSL connection required`

**Solution**:
1. For local development, set `DB_SSL=false`
2. For production, ensure SSL certificates are configured
3. For cloud providers (AWS RDS, etc.), they usually handle SSL automatically

## 📝 Migration Guide (SQLite to PostgreSQL)

If you're migrating from SQLite to PostgreSQL:

1. **Export data from SQLite**:
   ```bash
   sqlite3 db.sqlite .dump > backup.sql
   ```

2. **Create PostgreSQL database** (as shown above)

3. **Import data** (manual process required due to SQL differences):
   - Export data as CSV or JSON
   - Transform data format if needed
   - Import into PostgreSQL

4. **Update `.env`** to use PostgreSQL

5. **Test the application**:
   ```bash
   npm run start:dev
   ```

## 🔄 Switching Between Databases

You can easily switch between SQLite and PostgreSQL by changing the `DB_TYPE` in `.env`:

**SQLite**:
```env
DB_TYPE=sqlite
DB_DATABASE=db.sqlite
```

**PostgreSQL**:
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=prescription_db
```

The application will automatically use the configured database type.

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeORM PostgreSQL Guide](https://typeorm.io/data-source-options#postgres--cockroachdb-data-source-options)
- [NestJS Database Documentation](https://docs.nestjs.com/techniques/database)

