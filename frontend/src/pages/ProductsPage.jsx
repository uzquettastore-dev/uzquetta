import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
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

    // Sync URL parameter changes to local state
    useEffect(() => {
        setSelectedCategory(categoryParam || 'all');
    }, [categoryParam]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Categories
                const catRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData);
                }

                // Fetch Products
                const prodRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    setProducts(prodData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
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

    return (
        <div className="products-page container py-16">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl mb-2">Our Collection</h1>
                    <p className="text-muted">Showing {filteredProducts.length} unique items</p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="search-bar-wrapper flex">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="btn btn-primary search-btn"><Search size={20} /></button>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Mobile Filter Toggle */}
                <button
                    className="btn btn-outline lg:hidden flex items-center gap-2 mb-4 w-fit"
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                >
                    <Filter size={20} /> Filters
                </button>

                {/* Sidebar Filters */}
                <aside className={`filters-sidebar glass p-6 rounded-xl ${isMobileFiltersOpen ? 'open' : ''} lg:block`}>
                    <div className="flex justify-between items-center mb-6 lg:mb-4">
                        <h3 className="text-xl">Categories</h3>
                        {isMobileFiltersOpen && (
                            <button className="lg:hidden text-muted" onClick={() => setIsMobileFiltersOpen(false)}>Close</button>
                        )}
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
                <div className="lg:col-span-3">
                    {filteredProducts.length === 0 ? (
                        <div className="glass p-10 text-center rounded-xl">
                            <h3 className="text-2xl mb-2">No products found</h3>
                            <p className="text-muted">Try adjusting your filters or search criteria.</p>
                            <button onClick={() => { handleCategoryChange('all'); setSearchTerm(''); searchParams.delete('search'); setSearchParams(searchParams); }} className="btn btn-outline mt-6">Clear All Filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-2 md:px-0">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="product-card-minimal group relative fade-in">
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
                                        <img src={product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : product.image_url} alt={product.name} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ aspectRatio: '3/4' }} />
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
                                        <div className="flex items-center justify-center gap-2 mt-auto" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                            {product.discounted_price ? (
                                                <>
                                                    <span className="text-[0.85rem] text-gray-500 line-through font-normal">{Number(product.price).toFixed(2)} PKR</span>
                                                    <span className="text-black tracking-tight" style={{ fontWeight: 900, fontSize: '1.2rem', textShadow: '0 0 1px rgba(0,0,0,0.5)' }}>{Number(product.discounted_price).toFixed(2)} PKR</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[0.85rem] text-gray-500 line-through font-normal">{(Number(product.price) + 500).toFixed(2)} PKR</span>
                                                    <span className="text-black tracking-tight" style={{ fontWeight: 900, fontSize: '1.2rem', textShadow: '0 0 1px rgba(0,0,0,0.5)' }}>{Number(product.price).toFixed(2)} PKR</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProductsPage;
