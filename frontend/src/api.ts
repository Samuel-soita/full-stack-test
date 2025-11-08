import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000",
});

export const fetchProducts = (category?: string) =>
    API.get("/products", { params: category ? { category } : undefined }).then(r => r.data);

export const fetchProduct = (id: number) =>
    API.get(`/products/${id}`).then(r => r.data);

// ✅ Use the correct type here
export type ProductInput = {
    name: string;
    price: number;
    category: string;
    imageUrl?: string;
    inStock?: boolean;
    variants?: { name: string; options?: string[] }[];
    description?: string;
};

export const createProduct = (payload: ProductInput) =>
    API.post("/products", payload).then(r => r.data);
