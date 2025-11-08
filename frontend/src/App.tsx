import { useEffect, useState, useCallback } from "react";
import type { AxiosError } from "axios";
import { fetchProducts, createProduct } from "./api";
import ProductCard from "./components/ProductCard";

export type Variant = { name: string; options?: string[] };

export type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  inStock: boolean;
  quantity: number;
  category: string;
  variants?: Variant[] | string | null;
};

export type ProductInput = {
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  inStock?: boolean;
  quantity?: number;
  variants?: Variant[];
};

type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  variants?: Variant[];
};

// ✅ Backend base URL
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [cat, setCat] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [variants, setVariants] = useState<Variant[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  // ----------------------------------
  // Fetch Products
  // ----------------------------------
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filter = category === "All" ? undefined : category;
      const data = await fetchProducts(filter);
      setProducts(
        (data || []).map((p: Product) => ({
          ...p,
          quantity: p.quantity ?? 1,
          inStock: (p.quantity ?? 1) > 0,
        }))
      );
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { load(); }, [load]);

  // ----------------------------------
  // Get Image Source (local or remote)
  // ----------------------------------
  const getImageSrc = (url?: string) => {
    if (!url) return `${API_BASE}/uploads/no-image.png`;

    try {
      const parsed = new URL(url);
      return parsed.href; // valid external image
    } catch {
      // treat as backend upload path
      const normalized = url.startsWith("/") ? url.substring(1) : url;
      return `${API_BASE}/uploads/${normalized}`;
    }
  };

  // ----------------------------------
  // Add to Cart
  // ----------------------------------
  const addToCart = (product: Product) => {
    if (!product.inStock) return;

    setProducts(prev =>
      prev.map(p =>
        p.id === product.id
          ? { ...p, quantity: p.quantity - 1, inStock: p.quantity - 1 > 0 }
          : p
      )
    );

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      const parsedVariants =
        typeof product.variants === "string"
          ? JSON.parse(product.variants || "[]")
          : product.variants;

      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: getImageSrc(product.imageUrl),
          variants: parsedVariants,
        },
      ];
    });

    showToast("🛒 Added to cart!");
  };

  // ----------------------------------
  // Remove from Cart
  // ----------------------------------
  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, quantity: p.quantity + 1, inStock: true }
          : p
      )
    );
    showToast("🗑️ Removed from cart");
  };

  // ----------------------------------
  // Add Product Form Submit
  // ----------------------------------
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ProductInput = {
      name,
      price,
      category: cat,
      imageUrl: imageUrl || undefined,
      inStock: quantity > 0,
      quantity: quantity || 1,
      variants: variants.length ? variants : undefined,
    };

    try {
      await createProduct(payload);
      showToast("✅ Product added!");
      resetForm();
      load();
    } catch (err) {
      console.error(err);
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "❌ Failed to add product");
      setTimeout(() => setError(null), 3000);
    }
  };

  const resetForm = () => {
    setName(""); setPrice(0); setCat(""); setImageUrl(""); setVariants([]); setQuantity(1); setShowForm(false);
  };

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2000);
  };

  const categories = Array.from(new Set(["All", ...products.map(p => p.category)]));
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ----------------------------------
  // Render UI
  // ----------------------------------
  return (
    <div className="container">
      <header className="header">
        <h1>🛍️ Product Catalog</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </header>

      {/* Add Product Form */}
      {showForm && (
        <form onSubmit={handleAddProduct} className="add-product-form">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" required />
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Price" required />
          <input value={cat} onChange={e => setCat(e.target.value)} placeholder="Category" required />
          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL (upload or external)" />
          <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} placeholder="Quantity" min={1} required />
          <input
            value={variants.map(v => `${v.name}:${v.options?.join(",")}`).join(";")}
            onChange={e => {
              const newVariants: Variant[] = e.target.value.split(";").filter(Boolean).map(v => {
                const [name, options] = v.split(":");
                return { name: name.trim(), options: options?.split(",").map(o => o.trim()) };
              });
              setVariants(newVariants);
            }}
            placeholder="Variants (Size:S,M,L;Color:Red,Blue)"
          />
          <button type="submit" className="btn-submit">Save Product</button>
        </form>
      )}

      {/* Cart Section */}
      <section className="cart-top">
        <h2>🛒 My Cart</h2>
        {cart.length === 0 ? (
          <p>Cart is empty.</p>
        ) : (
          <ul>
            {cart.map(item => (
              <li key={item.productId} className="cart-item">
                <img
                  src={item.imageUrl || `${API_BASE}/uploads/no-image.png`}
                  alt={item.name}
                  width={50}
                  height={50}
                  onError={(e) => e.currentTarget.src = `${API_BASE}/uploads/no-image.png`}
                />
                <div className="cart-info">
                  <span className="cart-name">{item.name}</span>
                  <span className="cart-qty">Qty: {item.quantity}</span>
                  <span className="cart-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <button className="btn-remove" onClick={() => removeFromCart(item.productId)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
        <strong>Total: ${cartTotal.toFixed(2)}</strong>
      </section>

      {/* Filter */}
      <div className="controls">
        <label>
          Category:
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>

      {loading && <p className="status">Loading products...</p>}
      {error && <p className="error">{error}</p>}
      {feedback && <div className="toast">{feedback}</div>}

      {/* Product Grid */}
      <main className="grid">
        {!loading && !error && products.length === 0 && <p className="status">No products found.</p>}
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={{ ...product, imageUrl: getImageSrc(product.imageUrl) }}
            onAddToCart={addToCart}
          />
        ))}
      </main>
    </div>
  );
}
