import { useEffect, useState } from "react";
import { deleteProduct, getAllProducts } from "../api/products.js";
import { Link } from "react-router-dom";
import { PLACEHOLDER_IMAGE } from "../config.js";

export default function ProductsList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (err) {
            setError(err.message || "Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"?`)) return;

        try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            setError(err.message || "Failed to delete product.");
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" />
            </div>
        );
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Products</h1>
                <Link to="/products/create" className="btn btn-primary">
                    New product
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {products.length === 0 ? (
                <p className="text-muted">No products found.</p>
            ) : (
                <div className="row g-4">
                    {products.map((p) => {
                        const hasDiscount =
                            p.isDiscountActive &&
                            p.discountPrice &&
                            p.discountPrice < p.price;

                        return (
                            <div key={p.id} className="col-sm-6 col-lg-6">
                                <div className="card h-100 shadow-sm">

                                    <div className="ratio ratio-4x3 bg-light">
                                        <Link to={`/products/${p.id}`}>
                                            <img
                                                src={p.imageUrl || PLACEHOLDER_IMAGE}
                                                alt={p.name}
                                                className="w-100 h-100"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </Link>
                                    </div>

                                    <div className="card-body d-flex flex-column">

                                        <h5>
                                            <Link
                                                to={`/products/${p.id}`}
                                                className="text-decoration-none text-dark"
                                            >
                                                {p.name}
                                            </Link>
                                        </h5>

                                        <p className="text-muted small">
                                            {p.category || "-"}
                                        </p>

                                        <div className="mb-3">
                                            {hasDiscount ? (
                                                <>
                                                    <span
                                                        style={{
                                                            textDecoration: "line-through",
                                                            color: "gray",
                                                            marginRight: "8px",
                                                        }}
                                                    >
                                                        ${Number(p.price).toFixed(2)}
                                                    </span>

                                                    <span
                                                        style={{
                                                            color: "red",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        ${Number(p.discountPrice).toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-primary fw-semibold">
                                                    ${Number(p.price).toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        <p className="mb-2">
                                            Discount:{" "}
                                            {p.isDiscountActive ? (
                                                <span className="badge bg-success">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="badge bg-secondary">
                                                    Inactive
                                                </span>
                                            )}
                                        </p>

                                        <div className="mt-auto d-flex gap-2">
                                            <Link
                                                to={`/products/edit/${p.id}`}
                                                className="btn btn-outline-secondary btn-sm"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() =>
                                                    handleDelete(p.id, p.name)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}