import React, { useState, useEffect } from 'react';
import { Package, X, Upload } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', discounted_price: '', stock: '', category_id: '', subcategory_id: '',
        is_sale: false, sale_message: '', delivery_charges: '', sizes: []
    });
    const [imageFiles, setImageFiles] = useState([]);

    const availableSizes = ["S", "M", "L", "XL", "XXL"];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`),
                fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`)
            ]);
            const prodData = await prodRes.json();
            const catData = await catRes.json();

            if (!prodRes.ok) console.error('Products API Error:', prodData);
            if (!catRes.ok) console.error('Categories API Error:', catData);

            setProducts(Array.isArray(prodData) ? prodData : []);
            setCategories(Array.isArray(catData) ? catData : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleCategoryChange = async (e) => {
        const catId = e.target.value;
        setFormData({ ...formData, category_id: catId, subcategory_id: '' });

        if (catId) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories/${catId}/subcategories`);
                setSubcategories(await res.json());
            } catch (err) {
                console.error('Error fetching subcategories', err);
            }
        } else {
            setSubcategories([]);
        }
    };

    const handleSizeToggle = (size) => {
        setFormData(prev => {
            const sizes = prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];
            return { ...prev, sizes };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('categories', formData.category_id);
        if (formData.subcategory_id) data.append('subcategory_id', formData.subcategory_id);

        if (formData.discounted_price) data.append('discounted_price', formData.discounted_price);
        data.append('is_sale', formData.is_sale);
        if (formData.sale_message) data.append('sale_message', formData.sale_message);
        if (formData.delivery_charges) data.append('delivery_charges', formData.delivery_charges);

        if (formData.sizes && formData.sizes.length > 0) {
            data.append('sizes', JSON.stringify(formData.sizes));
        }

        imageFiles.forEach(file => {
            data.append('images', file);
        });

        try {
            const token = JSON.parse(localStorage.getItem('adminInfo'))?.token;
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: data
            });
            if (res.ok) {
                setShowModal(false);
                setFormData({ name: '', description: '', price: '', discounted_price: '', stock: '', category_id: '', subcategory_id: '', is_sale: false, sale_message: '', delivery_charges: '', sizes: [] });
                setImageFiles([]);
                fetchData();
            } else {
                let errorMessage = 'Failed to add product';
                try {
                    const errorData = await res.json();
                    errorMessage = `Failed to add product: ${errorData.message} \nCode: ${errorData.code || 'N/A'}`;
                } catch (e) { }
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Submission error', error);
            alert(`Submission error: ${error.message}`);
        }
    };

    if (loading) return <div className="p-8 text-center text-muted">Loading Products...</div>;

    return (
        <div className="fade-in pb-12">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-main">Products List</h2>
                    <p className="text-muted mt-2 text-sm">Manage your store's inventory and categories.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn bg-primary hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all">
                    + Add Product
                </button>
            </div>

            <div className="bg-surface rounded-2xl shadow-sm border border-surface-light overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-light text-muted uppercase text-xs tracking-wider border-b border-surface-light">
                                <th className="p-5 font-semibold">Product Name</th>
                                <th className="p-5 font-semibold">Category</th>
                                <th className="p-5 font-semibold">Subcategory</th>
                                <th className="p-5 font-semibold">Price</th>
                                <th className="p-5 font-semibold">Stock</th>
                                <th className="p-5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-light text-sm text-main">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-muted">No products found.</td>
                                </tr>
                            ) : (
                                products.map(product => (
                                    <tr key={product.id} className="hover:bg-bg-color/50 transition-colors">
                                        <td className="p-5 font-medium flex items-center gap-4">
                                            {product.image_urls && product.image_urls.length > 0 ? (
                                                <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image_urls[0]}`} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-surface-light shadow-sm" />
                                            ) : product.image_url ? (
                                                <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image_url}`} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-surface-light shadow-sm" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-surface-light flex items-center justify-center text-muted shadow-sm"><Package size={20} /></div>
                                            )}
                                            {product.name}
                                        </td>
                                        <td className="p-5">
                                            <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-md text-xs font-semibold">
                                                {product.category_names || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-muted font-medium">
                                            {product.subcategory_name || '-'}
                                        </td>
                                        <td className="p-5 font-bold">
                                            {product.is_sale && product.discounted_price ? (
                                                <div>
                                                    <span className="text-red-500 mr-2">Rs. {product.discounted_price}</span>
                                                    <span className="text-muted line-through text-xs">Rs. {product.price}</span>
                                                </div>
                                            ) : (
                                                <span>Rs. {product.price}</span>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1.5 rounded-md text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button className="text-primary hover:underline text-xs font-bold mr-4 transition-all">Edit</button>
                                            <button className="text-red-500 hover:underline text-xs font-bold transition-all">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Product Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-2xl border border-surface-light overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-surface-light bg-surface-light/50">
                            <h3 className="text-xl font-bold text-main">Add New Product</h3>
                            <button onClick={() => setShowModal(false)} className="text-muted hover:text-red-500 transition-colors rounded-full p-1 hover:bg-black/5">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-main block">Product Name *</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-bg-color border border-surface-light rounded-lg p-2.5 outline-none focus:border-primary transition-colors text-sm" placeholder="e.g. Premium Leather Jacket" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-main block">Regular Price (Rs) *</label>
                                        <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-bg-color border border-surface-light rounded-lg p-2.5 outline-none focus:border-primary transition-colors text-sm" placeholder="e.g. 5000" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-main block">Discount Price (Rs)</label>
                                        <input type="number" value={formData.discounted_price} onChange={e => setFormData({ ...formData, discounted_price: e.target.value })} className="w-full bg-bg-color border border-surface-light rounded-lg p-2.5 outline-none focus:border-primary transition-colors text-sm" placeholder="e.g. 4000" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-main block">Stock *</label>
                                        <input required type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full bg-bg-color border border-surface-light rounded-lg p-2.5 outline-none focus:border-primary transition-colors text-sm" placeholder="e.g. 50" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-main block">Delivery (Rs)</label>
                                        <input type="number" value={formData.delivery_charges} onChange={e => setFormData({ ...formData, delivery_charges: e.target.value })} className="w-full bg-bg-color border border-surface-light rounded-lg p-2.5 outline-none focus:border-primary transition-colors text-sm" placeholder="e.g. 200" />
                                    </div>
                                </div>
                                <div className="space-y-1 border border-surface-light p-3 rounded-lg flex flex-col justify-center">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-main">
                                        <input type="checkbox" checked={formData.is_sale} onChange={e => setFormData({ ...formData, is_sale: e.target.checked })} className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary" />
                                        On Sale Mode
                                    </label>
                                    {formData.is_sale && (
                                        <input type="text" value={formData.sale_message} onChange={e => setFormData({ ...formData, sale_message: e.target.value })} className="mt-2 w-full bg-bg-color border border-surface-light rounded-md p-1.5 outline-none focus:border-primary transition-colors text-xs" placeholder="Sale Message (e.g. 20% OFF!)" />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-main block">Category *</label>
                                    <select required value={formData.category_id} onChange={handleCategoryChange} className="w-full bg-bg-color border border-surface-light rounded-lg p-2.5 outline-none focus:border-primary transition-colors text-sm text-main">
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-main block">Subcategory</label>
                                    <select disabled={!formData.category_id || subcategories.length === 0} value={formData.subcategory_id} onChange={e => setFormData({ ...formData, subcategory_id: e.target.value })} className="w-full bg-bg-color border border-surface-light rounded-lg p-2.5 outline-none focus:border-primary transition-colors text-sm text-main disabled:opacity-50">
                                        <option value="">Select Subcategory</option>
                                        {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Sizes Section - Conditionally Shown or always shown as optional */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-main block">Available Sizes (Optional, for Clothing)</label>
                                <div className="flex flex-wrap gap-3">
                                    {availableSizes.map(size => (
                                        <label key={size} className={`flex items-center justify-center min-w-[3rem] px-3 py-1.5 border rounded-lg cursor-pointer transition-all text-sm font-bold select-none ${formData.sizes.includes(size) ? 'bg-primary text-white border-primary shadow-sm' : 'bg-bg-color border-surface-light text-main hover:border-primary'}`}>
                                            <input type="checkbox" className="hidden" checked={formData.sizes.includes(size)} onChange={() => handleSizeToggle(size)} />
                                            {size}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-main block">Description</label>
                                <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-bg-color border border-surface-light rounded-lg p-2.5 outline-none focus:border-primary transition-colors text-sm resize-none" placeholder="Enter product description here..." />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-main block">Product Images (Upload Multiple)</label>
                                <div className="border-2 border-dashed border-surface-light rounded-lg p-6 flex flex-col items-center justify-center text-muted hover:bg-surface-light/30 transition-colors bg-bg-color relative cursor-pointer">
                                    <input type="file" multiple accept="image/*" onChange={e => setImageFiles(Array.from(e.target.files))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <Upload size={28} className="mb-2 text-primary" />
                                    <span className="text-sm font-medium text-main text-center">
                                        {imageFiles.length > 0 ? `${imageFiles.length} files selected` : 'Click to Upload Images'}
                                    </span>
                                    {imageFiles.length > 0 && (
                                        <div className="flex gap-2 mt-3 overflow-x-auto w-full justify-center">
                                            {imageFiles.map((file, idx) => (
                                                <span key={idx} className="bg-surface-light px-2 py-1 rounded text-xs truncate max-w-[100px]">{file.name}</span>
                                            ))}
                                        </div>
                                    )}
                                    <span className="text-xs mt-1">PNG, JPG, JPEG up to 5MB</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-surface-light flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-muted hover:text-main hover:bg-surface-light rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 text-sm font-bold bg-primary hover:bg-yellow-600 text-white rounded-lg shadow-md transition-all">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
