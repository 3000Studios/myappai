import { PrismaClient } from '@prisma/client';
import { products as productsData } from '../src/lib/products-data';
// @ts-expect-error - bcrypt types might be missing
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create Admin User for Matrix Access
  const adminEmail = 'mr.jwswain@gmail.com';
  // Create or Update Admin User for Matrix Access
  const hashedPassword = await bcrypt.hash('Gabby3000', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      name: 'Matrix Admin',
      password: hashedPassword,
    },
  });
  console.log('Ensured Admin User: mr.jwswain@gmail.com');

  for (const p of productsData) {
    // Check if product with the same SKU already exists
    const existingProduct = await prisma.product.findFirst({
      where: { sku: p.sku },
    });

    if (existingProduct) {
      console.log(`Product with SKU ${p.sku} already exists. Skipping.`);
      continue;
    }
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        category: p.category,
        images: p.images.join(','),
        inStock: p.inStock,
        inventory: p.inventory,
        sku: p.sku,
        supplier: p.supplier,
        features: p.features.join(','),
        specifications: JSON.stringify(p.specifications),
        shippingWeight: p.shippingWeight,
        tags: p.tags.join(','),
      },
    });
    console.log(`Created product with id: ${product.id}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

