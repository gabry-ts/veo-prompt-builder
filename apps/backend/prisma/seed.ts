import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('🌱 Starting seed...');

  const defaultEmail = process.env['DEFAULT_USER_EMAIL'];
  const defaultPassword = process.env['DEFAULT_USER_PASSWORD'];

  if (!defaultEmail || !defaultPassword) {
    // eslint-disable-next-line no-console
    console.log('⚠️  No default user credentials provided via env vars (DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD)');
    // eslint-disable-next-line no-console
    console.log('   Skipping default user creation.');
    return;
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: defaultEmail },
  });

  if (existingUser) {
    // eslint-disable-next-line no-console
    console.log(`👤 User ${defaultEmail} already exists, skipping...`);
    return;
  }

  // Create default user
  const hashedPassword = await hash(defaultPassword, 10);

  // Extract name from email if not provided
  const userName = process.env['DEFAULT_USER_NAME'] ?? defaultEmail.split('@')[0];

  const user = await prisma.user.create({
    data: {
      email: defaultEmail,
      password: hashedPassword,
      name: userName,
      role: 'ADMIN', // First user is always ADMIN
    },
  });

  // eslint-disable-next-line no-console
  console.log('✅ Default user created:');
  // eslint-disable-next-line no-console
  console.log(`   Email: ${defaultEmail}`);
  // eslint-disable-next-line no-console
  console.log('   Password: ********');
  // eslint-disable-next-line no-console
  console.log('   ID:', user.id);

  // eslint-disable-next-line no-console
  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
