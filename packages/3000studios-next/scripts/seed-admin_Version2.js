#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function seed() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment to seed admin user.');
    process.exit(1);
  }

  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('Admin already exists:', email);
      await prisma.$disconnect();
      process.exit(0);
    }
    const hashed = await bcrypt.hash(password, 12);
    const created = await prisma.user.create({
      data: { email, name: 'Admin', password: hashed, emailVerified: new Date() },
    });
    console.log('Created admin user via Prisma:', created.id);
    await prisma.$disconnect();
    process.exit(0);
  } catch (prismaErr) {
    console.log('Prisma not available or error; falling back to JSON store.');
  }

  const dataDir = path.join(process.cwd(), '.data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, 'users.json');

  let users = [];
  if (fs.existsSync(file)) {
    try {
      users = JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
    } catch {
      users = [];
    }
  }

  const found = users.find((u) => u.email === email);
  if (found) {
    console.log('Admin already exists in JSON store:', email);
    process.exit(0);
  }

  const hashed = bcrypt.hashSync(password, 12);
  const newUser = {
    id: `local-${Date.now()}`,
    email,
    name: 'Admin',
    password: hashed,
    role: 'admin',
    emailVerified: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  fs.writeFileSync(file, JSON.stringify(users, null, 2), 'utf8');
  console.log('Created admin user in .data/users.json:', newUser.id);
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });