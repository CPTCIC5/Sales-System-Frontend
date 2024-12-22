'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiEdit2, FiTrash2, FiEye, FiStar } from 'react-icons/fi';

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Description for product 1',
    price: 99.99,
    category: 'Electronics',
    stock: 50,
    image_url: '',
    is_featured: true,
    org_id: '1'
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'Description for product 2',
    price: 149.99,
    category: 'Accessories',
    stock: 30,
    image_url: '',
    is_featured: false,
    org_id: '1'
  },
];

const DUMMY_CATEGORIES = [
  {
    id: 1,
    name: 'Electronics',
    products: [1, 2]
  },
  {
    id: 2,
    name: 'Accessories',
    products: [3, 4]
  }
];

const DUMMY_TAGS = [
  {
    id: 1,
    tag_name: 'New Arrival',
    color_code: '#FF4444'
  },
  {
    id: 2,
    tag_name: 'Best Seller',
    color_code: '#44FF44'
  }
];

const MainProduct = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategory, setSelectedCategory] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image_url: '',
    is_featured: false,
    org_id: '' // This should be set based on user's organization
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchTags()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(DUMMY_PRODUCTS);
    } catch (error) {
      toast.error('Error fetching products');
    }
  };

  const fetchCategories = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCategories(DUMMY_CATEGORIES);
    } catch (error) {
      toast.error('Error fetching categories');
    }
  };

  const fetchTags = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTags(DUMMY_TAGS);
    } catch (error) {
      toast.error('Error fetching tags');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create product');
      
      toast.success('Product created successfully');
      setShowCreateModal(false);
      fetchProducts();
      
    } catch (error) {
      toast.error('Error creating product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/delete/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      toast.success('Product deleted successfully');
      fetchProducts();
      
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'file' && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.files[0],
        image_url: URL.createObjectURL(e.target.files[0])
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddProduct = () => {
    router.push('/createproduct');
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'text/csv') {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/products/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload CSV');
      
      toast.success('Products imported successfully');
      fetchProducts(); // Refresh the products list
    } catch (error) {
      toast.error('Error uploading CSV file');
      console.error('CSV upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/products/update/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update product');
      
      toast.success('Product updated successfully');
      setShowEditModal(false);
      fetchProducts(); // Refresh products list
      
    } catch (error) {
      toast.error('Error updating product');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    // Text search (name, description)
    const textMatch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Price range filter
    const priceMatch = 
      (!priceRange.min || product.price >= Number(priceRange.min)) &&
      (!priceRange.max || product.price <= Number(priceRange.max));

    // Category filter
    const categoryMatch = 
      !selectedCategory || product.category === selectedCategory;

    return textMatch && priceMatch && categoryMatch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Updated with CSV upload button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your product inventory and listings
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
                id="csvUpload"
              />
              <motion.label
                htmlFor="csvUpload"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg 
                  hover:bg-green-700 transition-all duration-200 
                  shadow-sm hover:shadow-md flex items-center space-x-2
                  cursor-pointer"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
                <span>Import CSV</span>
              </motion.label>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddProduct}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg 
                hover:bg-indigo-700 transition-all duration-200 
                shadow-sm hover:shadow-md flex items-center space-x-2"
            >
              <span>Add Product</span>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-6 space-y-4">
          {/* Text Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
                bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 
                shadow-sm hover:border-gray-400 
                transition-colors duration-200"
            />
          </div>

          {/* Advanced Filters */}
          <div className="flex gap-4 flex-wrap">
            {/* Price Range */}
            <div className="flex items-center gap-2 min-w-[300px]">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-1/2 px-4 py-2 rounded-lg border border-gray-300 
                  bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-1/2 px-4 py-2 rounded-lg border border-gray-300 
                  bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 
                bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 
                shadow-sm hover:border-gray-400 
                transition-colors duration-200"
            >
              <option value="">All Categories</option>
              {DUMMY_CATEGORIES.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Clear Filters Button */}
            {(searchQuery || priceRange.min || priceRange.max || selectedCategory) && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSearchQuery('');
                  setPriceRange({ min: '', max: '' });
                  setSelectedCategory('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg 
                  hover:bg-gray-200 transition-colors duration-200 
                  flex items-center space-x-2"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
                <span>Clear Filters</span>
              </motion.button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-500">
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
              {/* Categories Section */}
              <div>
                <div className="p-3 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                </div>
                <ul className="mt-3 space-y-2">
                  {categories.map(category => (
                    <motion.li 
                      key={category.id} 
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-gray-700">{category.name}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {category.products?.length || 0}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Tags Section - Removed Manage button */}
              <div>
                <div className="p-3 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900">Tags</h3>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-sm cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: tag.color_code + '20', color: tag.color_code }}
                    >
                      {tag.tag_name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-400">No img</span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.stock} units</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowDetailModal(true);
                            }}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setFormData(product);
                              setShowEditModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No products found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Product</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium
                  ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}
                  transition-colors duration-200`}
              >
                {isLoading ? 'Creating...' : 'Create Product'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Detail View Modal */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                {selectedProduct.image_url ? (
                  <Image
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No img</span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h3>
                  <p className="text-gray-500">{selectedProduct.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Product Information</h4>
                  <div className="mt-2 space-y-2">
                    <p className="text-gray-900">Price: ${selectedProduct.price}</p>
                    <p className="text-gray-900">Stock: {selectedProduct.stock} units</p>
                    <p className="text-gray-900">Category: {selectedProduct.category}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="mt-2 text-gray-900">{selectedProduct.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditProduct} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                      hover:border-gray-400
                      transition-colors duration-200"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                      hover:border-gray-400
                      transition-colors duration-200"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                      hover:border-gray-400
                      transition-colors duration-200"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                      hover:border-gray-400
                      transition-colors duration-200"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                      hover:border-gray-400
                      transition-colors duration-200"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                      hover:border-gray-400
                      transition-colors duration-200"
                  />
                  {formData.image_url && (
                    <div className="mt-2">
                      <Image
                        src={formData.image_url}
                        alt="Product preview"
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium
                  ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}
                  transition-colors duration-200`}
              >
                {isLoading ? 'Updating...' : 'Update Product'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MainProduct;
