import { useState } from "react";
import type { Product, Variant } from "../App";

type Props = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

export default function ProductCard({ product, onAddToCart }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const {
    name = "Unnamed Product",
    price = 0,
    quantity = 0,
    inStock = false,
    category = "Uncategorized",
    imageUrl,
    variants,
  } = product;

  // -----------------------------
  // Parse variants safely
  // -----------------------------
  const parsedVariants: Variant[] = (() => {
    if (!variants) return [];
    if (typeof variants === "string") {
      try {
        return JSON.parse(variants);
      } catch {
        return [];
      }
    }
    return Array.isArray(variants) ? variants : [];
  })();

  // -----------------------------
  // Add to Cart
  // -----------------------------
  function handleAddToCart() {
    if (!inStock || quantity <= 0) return;
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => setIsAdding(false), 800);
  }

  // -----------------------------
  // Stock badge
  // -----------------------------
  const stockLabel =
    quantity > 10
      ? "In Stock"
      : quantity > 5
      ? `Hurry! Only ${quantity} left`
      : quantity > 0
      ? `Almost gone! ${quantity} remaining`
      : "Out of Stock";

  // -----------------------------
  // Image logic (fixed)
  // -----------------------------
  const backendURL = import.meta.env.VITE_API_BASE;
  const isExternal =
    imageUrl?.startsWith("http://") || imageUrl?.startsWith("https://");

  let imgSrc = imageUrl
    ? isExternal
      ? imageUrl
      : `${backendURL}${imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl}`
    : "/uploads/no-image.png";

  if (imgError) {
    imgSrc = "https://via.placeholder.com/400x300?text=Image+Unavailable";
  }

  return (
    <article
      className={`card ${!inStock || quantity <= 0 ? "card-out" : ""}`}
      aria-label={`${name} product card`}
    >
      <div className="imgWrap">
        <img
          src={imgSrc}
          alt={name}
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div
          className={`badge ${
            !inStock || quantity <= 0 ? "badge-out" : "badge-stock"
          }`}
        >
          {stockLabel}
        </div>
      </div>

      <div className="body">
        <h3 className="title" title={name}>
          {name}
        </h3>
        <p className="category">{category}</p>

        {parsedVariants.length > 0 && (
          <div className="variants">
            <small>
              Variants:{" "}
              {parsedVariants
                .map(
                  (v) =>
                    `${v.name}${
                      v.options?.length ? ` (${v.options.join(", ")})` : ""
                    }`
                )
                .join("; ")}
            </small>
          </div>
        )}

        <div className="meta">
          <strong className="price">${price.toFixed(2)}</strong>
          <button
            className={`btn ${
              !inStock || quantity <= 0 ? "btn-disabled" : ""
            }`}
            onClick={handleAddToCart}
            disabled={!inStock || quantity <= 0 || isAdding}
            title={inStock ? "Add to cart" : "Out of stock"}
          >
            {isAdding
              ? "Adding..."
              : quantity <= 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
