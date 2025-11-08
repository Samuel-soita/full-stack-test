import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await prisma.product.deleteMany();

    const products = [
    {
        name: "Classic Tee",
        description: "Comfortable cotton tee.",
        price: 19.99,
        quantity: 5,
        imageUrl: "http://localhost:4000/uploads/classic.jpg",
        category: "Apparel",
        inStock: true,
        variants: JSON.stringify([{ name: "Size", options: ["S","M","L"] }])
    },
    {
        name: "Sneaker Runner",
        description: "Lightweight running shoe.",
        price: 79.99,
        quantity: 10,
        imageUrl: "http://localhost:4000/uploads/sneaker.jpg",
        category: "Footwear",
        inStock: true,
        variants: JSON.stringify([{ name: "Size", options: ["8","9","10"] }])
    },
    {
        name: "Denim Jacket",
        description: "Stylish denim jacket.",
        price: 99.5,
        quantity: 3,
        imageUrl: "http://localhost:4000/uploads/denim.jpg",
        category: "Apparel",
        inStock: true,
        variants: JSON.stringify([{ name: "Size", options: ["8","9","10"] }])
    }
    ];

    for (const p of products) {
    await prisma.product.create({ data: p });
    }

    console.log(" Seeded products successfully!");
}

main()
    .catch((e) => { 
    console.error(e); 
    process.exit(1); 
    })
    .finally(async () => { 
    await prisma.$disconnect(); 
    });