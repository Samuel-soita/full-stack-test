# Fullstack Test Backend

A Node.js + Express backend for managing products with Prisma ORM and SQLite. Supports CRUD operations for products, including category filtering, image uploads, and variant handling.



## Project Structure


backend/
├─ prisma/
│  ├─ dev.db
│  ├─ migrations/
│  ├─ schema.prisma
│  └─ seed.ts
├─ src/
│  ├─ index.ts
│  └─ routes/
│     └─ products.ts
├─ uploads/
│  ├─ classic.jpg
│  ├─ denim.jpg
│  ├─ sneaker.jpg
│  └─ no-image.png
├─ package.json
├─ package-lock.json
├─ tsconfig.json
└─ README.md

## Setup
1. Install dependencies

-npm install


2. Run database migrations

-npx prisma migrate dev


3. Seed database (optional)

-npx ts-node prisma/seed.ts


4. Start the server

- npm run dev


Server will run on http://localhost:4000 (default).

## API Endpoints

-Base URL
    http://localhost:4000/products

## Routes

## Method	Endpoint	Description

- GET	/products	Get all products
- GET	/products?category=XYZ	Get products by category
- GET	/products/:id	Get a single product by ID
- POST	/products	Create a new product


## Sample cURL Requests

1. Get all products

-curl -X GET http://localhost:4000/products

2. Get products by category
- curl -X GET "http://localhost:4000/products?category=Apparel"

3. Get a single product by ID

- curl -X GET http://localhost:4000/products/1

4. Create a new product

- curl -X POST http://localhost:4000/products \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Denim Jacket",
        "price": 79.99,
        "image": "https://example.com/denim.jpg",
        "category": "Apparel",
        "inStock": true,
        "variants": [
          { "name": "Size", "options": ["S", "M", "L", "XL"] },
          { "name": "Color", "options": ["Blue", "Black"] }
        ]
      }'


## Notes:

- Replace http://localhost:4000 with your backend URL if running on a different host or port.

- variants are optional and stored as JSON in the database.

- Image URLs must be publicly accessible if using external URLs.

## File Uploads

- Local product images are stored in /uploads/.

- Default placeholder image: uploads/no-image.png

## Technologies Used

- Node.js + Express

- TypeScript

-Prisma ORM

-SQLite (for development)

-Zod for input validation

## Author 
Samuel Soita,.

## License

- This project is licensed under the MIT License.