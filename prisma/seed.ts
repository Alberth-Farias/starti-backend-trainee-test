import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  console.log('Starting database seed...');

  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('Password@123', 12);

  const [pablo, raquel, silvano] = await Promise.all([
    prisma.user.create({
      data: {
        username: 'RaulSeixas',
        name: 'Raul Seixas',
        email: 'raul.seixas@email.com',
        password,
        biography: 'Singer of "Maluco Beleza"',
      },
    }),
    prisma.user.create({
      data: {
        username: 'PrinceOfKeyboards',
        name: 'Zezo',
        email: 'zezo.keyboard@email.com',
        password,
        biography: 'Keyboard player and singer.',
      },
    }),
    prisma.user.create({
      data: {
        username: 'SilvanoSalles',
        name: 'Silvano Salles',
        email: 'silvano.salles@email.com',
        password,
        biography: 'The passionate singer.',
      },
    }),
  ]);

  const [pabloPost, raquelPost, silvanoPost] = await Promise.all([
    prisma.post.create({
      data: {
        userId: pablo.id,
        text: 'Tonight the crowd will sing along with every line.',
      },
    }),
    prisma.post.create({
      data: {
        userId: raquel.id,
        text: 'The keyboard intro has to be emotional and unforgettable.',
      },
    }),
    prisma.post.create({
      data: {
        userId: silvano.id,
        text: 'Big stage energy, perfect timing, and a lot of heart.',
      },
    }),
  ]);

  await Promise.all([
    prisma.comment.create({
      data: {
        userId: raquel.id,
        postId: pabloPost.id,
        message: 'That chorus is pure emotion, Pablo.',
      },
    }),
    prisma.comment.create({
      data: {
        userId: silvano.id,
        postId: pabloPost.id,
        message: 'The audience is going to love this one.',
      },
    }),
    prisma.comment.create({
      data: {
        userId: pablo.id,
        postId: raquelPost.id,
        message: 'Raquel, that keyboard line is heavenly.',
      },
    }),
    prisma.comment.create({
      data: {
        userId: pablo.id,
        postId: silvanoPost.id,
        message: 'Silvano, this show feels legendary already.',
      },
    }),
  ]);

  console.log('Seed completed successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
