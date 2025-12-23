/**
 * Password Migration Script
 * 
 * This script helps migrate existing users with plain-text passwords
 * to use bcrypt hashed passwords.
 * 
 * Usage (run from project root):
 * npx ts-node src/auth/scripts/migrate-passwords.ts
 * 
 * WARNING: This is a one-time migration script.
 * Make sure to backup your database before running.
 */

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/users.entity';

async function migratePasswords() {
  // Create database connection
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [User],
    synchronize: false, // Don't modify schema
  });

  try {
    await dataSource.initialize();
    console.log('Database connected');

    const userRepository = dataSource.getRepository(User);
    const users = await userRepository.find();

    console.log(`Found ${users.length} users to migrate`);

    let migrated = 0;
    let skipped = 0;

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      if (user.password.startsWith('$2')) {
        console.log(`Skipping user ${user.email} - password already hashed`);
        skipped++;
        continue;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;

      await userRepository.save(user);
      console.log(`Migrated password for user: ${user.email}`);
      migrated++;
    }

    console.log(`\nMigration complete!`);
    console.log(`- Migrated: ${migrated}`);
    console.log(`- Skipped: ${skipped}`);

    await dataSource.destroy();
  } catch (error) {
    console.error('Migration failed:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

// Run migration
migratePasswords();

