import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../api/products.js";
import { PLACEHOLDER_IMAGE } from "../config.js";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await getProductById(id);
                if (!cancelled) setProduct(data);
            } catch (err) {
                if (!cancelled) setError(err.message || "Error loading product");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="alert alert-warning">
                {error || "Product not found"}
            </div>
        );
    }

    const hasDiscount =
        product.isDiscountActive === true &&
        product.discountPrice !== null &&
        product.discountPrice < product.price;

    return (
        <div className="card shadow-sm">

            <img
                src={product.imageUrl || PLACEHOLDER_IMAGE}
                alt={product.name}
                style={{ height: 300, objectFit: "cover" }}
            />

            <div className="card-body">

                <h3>{product.name}</h3>

                <p className="text-muted">{product.category || "-"}</p>

                <div className="mb-3">
                    {hasDiscount ? (
                        <>
                            <span
                                style={{
                                    textDecoration: "line-through",
                                    color: "gray",
                                    marginRight: "10px",
                                    fontSize: "18px",
                                }}
                            >
                                ${Number(product.price).toFixed(2)}
                            </span>

                            {/* DISCOUNT PRICE */}
                            <span
                                style={{
                                    color: "red",
                                    fontWeight: "bold",
                                    fontSize: "20px",
                                }}
                            >
                                ${Number(product.discountPrice).toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <span
                            style={{
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: "#0d6efd",
                            }}
                        >
                            ${Number(product.price).toFixed(2)}
                        </span>
                    )}
                </div>

                <p>
                    Discount:{" "}
                    {product.isDiscountActive ? (
                        <span className="badge bg-success">Active</span>
                    ) : (
                        <span className="badge bg-secondary">Inactive</span>
                    )}
                </p>

                <Link
                    to={`/products/edit/${product.id}`}
                    className="btn btn-outline-primary"
                >
                    Edit
                </Link>
            </div>
        </div>
    );
}