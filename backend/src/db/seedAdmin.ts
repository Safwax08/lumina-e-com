import bcrypt from 'bcryptjs';
import { db, queryClient } from './index.js';
import { users } from './schema/index.js';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@lumina.com';
  const rawPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePass123!';

  console.log(`Seeding development admin account: ${email}...`);

  try {
    const passwordHash = await bcrypt.hash(rawPassword, 10);
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existing.length > 0) {
      await db
        .update(users)
        .set({
          passwordHash,
          role: 'ADMIN',
          fullName: 'Lumina Administrator',
          updatedAt: new Date(),
        })
        .where(eq(users.email, email));
      console.log(`Updated existing admin user '${email}' with encrypted password and ADMIN role.`);
    } else {
      await db.insert(users).values({
        id: `usr-admin-${Date.now()}`,
        email,
        passwordHash,
        fullName: 'Lumina Administrator',
        role: 'ADMIN',
      });
      console.log(`Successfully created new admin user '${email}' with ADMIN role.`);
    }
  } catch (err) {
    console.error('Failed to seed admin account:', err);
    throw err;
  }
}

if (process.argv[1]?.endsWith('seedAdmin.ts') || process.argv[1]?.endsWith('seedAdmin.js')) {
  seedAdmin()
    .then(() => queryClient.end())
    .catch(() => process.exit(1));
}
