const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  const hashedPassword = await bcrypt.hash('loai', 10);
  const admin = await prisma.admin.create({
    data: {
      username: 'loai',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Admin created:', admin);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });