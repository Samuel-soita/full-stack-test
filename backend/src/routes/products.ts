import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

// ✅ Zod schema for input validation
const productCreateSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    price: z.number().nonnegative("Price must be positive"),
    image: z.string().url("Invalid image URL").optional(),
    category: z.string().min(1, "Category is required"),
    inStock: z.boolean().default(true),
    variants: z.any().optional()
});

export default function productsRouter(prisma: PrismaClient) {
    const router = Router();

    // -----------------------------
    // 1 & 3. GET /products OR /products?category=Apparel
    // -----------------------------
    router.get("/", async (req, res) => {
        try {
            const { category } = req.query;
            const where = category ? { category: String(category) } : {};
            const products = await prisma.product.findMany({ where });
            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    });

    // -----------------------------
    // 2. GET /products/:id
    // -----------------------------
    router.get("/:id", async (req, res) => {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "Invalid ID" });
            }

            const product = await prisma.product.findUnique({ where: { id } });
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    });

    // -----------------------------
    // 4. POST /products — Create product
    // -----------------------------
    router.post("/", async (req, res) => {
        try {
            const parsed = productCreateSchema.parse(req.body);

            const newProduct = await prisma.product.create({
                data: {
                    name: parsed.name,
                    price: parsed.price,
                    imageUrl: parsed.image || null, // <-- map image to imageUrl
                    category: parsed.category,
                    inStock: parsed.inStock,
                    variants: parsed.variants ? JSON.stringify(parsed.variants) : null
                }
            });

            res.status(201).json(newProduct);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    });

    return router;
}
