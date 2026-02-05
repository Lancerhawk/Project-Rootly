import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function setupDatabase() {
    try {
        console.log('🔧 Setting up database...');

        // Create session table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      );
    `);

        await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);

        console.log('✅ Session table created');
        console.log('✅ Database setup complete!');
    } catch (error) {
        console.error('❌ Error setting up database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

setupDatabase();
