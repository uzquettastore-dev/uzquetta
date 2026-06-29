import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Search, PackageOpen } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../utils/imageHelper';
import './ProductsPage.css';

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const searchQuery = searchParams.get('search');

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
    const [searchTerm, setSearchTerm] = useState(searchQuery || '');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');

    // Sync URL parameter changes to local state
    useEffect(() => {
        setSelectedCategory(categoryParam || 'all');
    }, [categoryParam]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Categories
                const catRes = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'https://uzquetta.vercel.app'}`}`}/api/categories`);
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData);
                }

                // Fetch Products
                const prodRes = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'https://uzquetta.vercel.app'}`}`}/api/products`);
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    setProducts(prodData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCategoryChange = (val) => {
        setSelectedCategory(val);
        if (val === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', val);
        }
        setSearchParams(searchParams);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            searchParams.set('search', searchTerm);
        } else {
            searchParams.delete('search');
        }
        setSearchParams(searchParams);
    };

    // Filter products
    const filteredProducts = products.filter(p => {
        let matchCat = true;
        if (selectedCategory !== 'all' && selectedCategory !== 'sale') {
            if (!p.category_ids || !Array.isArray(p.category_ids)) {
                matchCat = false;
            } else {
                matchCat = p.category_ids.includes(Number(selectedCategory));
            }
        } else if (selectedCategory === 'sale') {
            matchCat = p.is_sale;
        }

        let matchSearch = true;
        if (searchQuery) {
            matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        }

        return matchCat && matchSearch;
    });

    // Sort the filtered products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = Number(a.discounted_price || a.price);
        const priceB = Number(b.discounted_price || b.price);
        switch (sortBy) {
            case 'price-asc': return priceA - priceB;
            case 'price-desc': return priceB - priceA;
            case 'name': return a.name.localeCompare(b.name);
            default: return 0; // 'newest' — keep API order (created_at DESC)
        }
    });

    // Scroll-reveal observer — re-runs when filteredProducts change
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .section-title').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [filteredProducts]);

    // Skeleton card component
    const SkeletonCard = () => (
        <div className="skeleton-card">
            <div className="skeleton skeleton-image"></div>
            <div style={{ padding: '1rem' }}>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text-sm"></div>
                <div className="skeleton skeleton-text-sm" style={{ width: '40%', marginTop: '0.75rem' }}></div>
            </div>
        </div>
    );

    return (
        <div className="products-page container py-16" style={{ marginTop: '100px' }}>

            {/* Page Header */}
            <div className="products-page-header">
                <div className="products-page-header__text">
                    <h1 className="section-title">Our Collection</h1>
                    <p className="text-muted" style={{ marginTop: '0.5rem' }}>
                        Curated essentials, handpicked for quality and style.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="search-bar-wrapper">
                    <div className="search-input-group">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary search-btn">Search</button>
                </form>
            </div>

            {/* Mobile Category Pills (horizontal scroll) */}
            <div className="mobile-category-pills">
                <button
                    className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => handleCategoryChange('all')}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`category-pill ${selectedCategory === String(cat.id) ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(String(cat.id))}
                    >
                        {cat.name}
                    </button>
                ))}
                <button
                    className={`category-pill category-pill--sale ${selectedCategory === 'sale' ? 'active' : ''}`}
                    onClick={() => handleCategoryChange('sale')}
                >
                    Offers %
                </button>
            </div>

            <div className="products-layout">

                {/* Desktop Sidebar Filters */}
                <aside className="filters-sidebar glass rounded-xl">
                    <div className="filters-sidebar__header">
                        <h3 style={{ fontSize: '1.1rem', marginBottom: 0 }}>
                            <Filter size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '8px' }} />
                            Categories
                        </h3>
                    </div>
                    <ul className="category-filters-list">
                        <li
                            className={selectedCategory === 'all' ? 'active' : ''}
                            onClick={() => handleCategoryChange('all')}
                        >
                            All Products
                        </li>
                        {categories.map(cat => (
                            <li
                                key={cat.id}
                                className={selectedCategory === String(cat.id) ? 'active' : ''}
                                onClick={() => handleCategoryChange(String(cat.id))}
                            >
                                {cat.name}
                            </li>
                        ))}
                        <li
                            className={`sale-filter ${selectedCategory === 'sale' ? 'active' : ''}`}
                            onClick={() => handleCategoryChange('sale')}
                        >
                            Special Offers %
                        </li>
                    </ul>
                </aside>

                {/* Product Grid */}
                <div className="products-grid-area">
                    {loading ? (
                        /* Skeleton Loading State */
                        <div className="products-grid">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        /* Empty State */
                        <div className="empty-state reveal">
                            <div className="empty-state__icon">
                                <PackageOpen size={56} strokeWidth={1.2} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No products found</h3>
                            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Try adjusting your filters or search criteria.</p>
                            <button
                                onClick={() => { handleCategoryChange('all'); setSearchTerm(''); searchParams.delete('search'); setSearchParams(searchParams); }}
                                className="btn btn-outline"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        /* Product Cards */
                        <>
                        <div className="products-toolbar">
                            <span className="products-toolbar__count">
                                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                            </span>
                            <div className="products-toolbar__sort">
                                <label htmlFor="sort">Sort by</label>
                                <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="newest">Newest</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                            </div>
                        </div>
                        <div className="products-grid">
                            {sortedProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className={`product-card-minimal group relative reveal stagger-${(index % 8) + 1}`}
                                >
                                    <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
                                        {product.is_sale && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <span className="badge-yellow-blink">
                                                    {product.sale_message || 'SALE'}
                                                </span>
                                            </div>
                                        )}
                                        {!product.is_sale && (
                                             <div className="absolute top-3 left-3 z-10">
                                                <span className="badge-yellow-blink">
                                                    NEW IN
                                                </span>
                                            </div>
                                        )}
                                        <img src={product.image_urls && product.image_urls.length > 0 ? optimizeCloudinaryUrl(product.image_urls[0]) : optimizeCloudinaryUrl(product.image_url)} alt={product.name} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ aspectRatio: '3/4' }} />
                                    </Link>
                                    <div className="pt-4 pb-6 px-4 flex flex-col items-center bg-white flex-grow justify-between">
                                        <div className="text-center w-full">
                                            <Link to={`/product/${product.id}`}>
                                                <h3 className="text-sm text-center mx-auto tracking-widest font-bold mb-1 text-truncate hover:text-primary transition-colors text-main uppercase" style={{ fontFamily: 'var(--font-heading)' }}>{product.name}</h3>
                                            </Link>
                                            {product.description && (
                                                <p className="text-[0.8rem] text-muted mb-3 line-clamp-2 w-full overflow-hidden leading-relaxed italic" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>{product.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-center gap-3 mt-auto" style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                                            {product.discounted_price ? (
                                                <>
                                                    <span className="text-[0.8rem] text-gray-400 line-through font-normal">Rs. {Math.round(product.price).toLocaleString()}</span>
                                                    <span className="text-main tracking-tight font-extrabold text-[1.1rem]">Rs. {Math.round(product.discounted_price).toLocaleString()}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[0.8rem] text-gray-400 line-through font-normal">Rs. {Math.round(Number(product.price) + 500).toLocaleString()}</span>
                                                    <span className="text-main tracking-tight font-extrabold text-[1.1rem]">Rs. {Math.round(product.price).toLocaleString()}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProductsPage;
