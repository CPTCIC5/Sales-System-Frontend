'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const DUMMY_PRODUCT = {
  title: 'Premium Wireless Headphones',
  description: 'High-quality wireless headphones with noise cancellation feature and 20-hour battery life.',
  image: null,
  imagePreview: null,
  availability: true,
  price: '299.99',
  currency: 'USD',
  category: 'Electronics',
  customCategory: ''
};

const CreateProduct = () => {
  const [formData, setFormData] = useState(DUMMY_PRODUCT);

  const [isLoading, setIsLoading] = useState(false);

  // Product categories
  const categories = [
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Home & Garden',
    'Sports & Outdoors',
    'Books',
    'Health & Beauty',
    'Toys & Games',
    'Automotive',
    'Others'
  ];

  // Updated comprehensive currency list
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'AFN', symbol: '؋', name: 'Afghan Afghani' },
    { code: 'ALL', symbol: 'L', name: 'Albanian Lek' },
    { code: 'AMD', symbol: '֏', name: 'Armenian Dram' },
    { code: 'ANG', symbol: 'ƒ', name: 'Netherlands Antillean Guilder' },
    { code: 'AOA', symbol: 'Kz', name: 'Angolan Kwanza' },
    { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
    { code: 'BAM', symbol: 'KM', name: 'Bosnia-Herzegovina Mark' },
    { code: 'BBD', symbol: '$', name: 'Barbadian Dollar' },
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
    { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev' },
    { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar' },
    { code: 'BIF', symbol: 'FBu', name: 'Burundian Franc' },
    { code: 'BMD', symbol: '$', name: 'Bermudan Dollar' },
    { code: 'BND', symbol: 'B$', name: 'Brunei Dollar' },
    { code: 'BOB', symbol: 'Bs.', name: 'Bolivian Boliviano' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'BSD', symbol: '$', name: 'Bahamian Dollar' },
    { code: 'BTN', symbol: 'Nu.', name: 'Bhutanese Ngultrum' },
    { code: 'BWP', symbol: 'P', name: 'Botswanan Pula' },
    { code: 'BYN', symbol: 'Br', name: 'Belarusian Ruble' },
    { code: 'BZD', symbol: 'BZ$', name: 'Belize Dollar' },
    { code: 'CDF', symbol: 'FC', name: 'Congolese Franc' },
    { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
    { code: 'COP', symbol: '$', name: 'Colombian Peso' },
    { code: 'CRC', symbol: '₡', name: 'Costa Rican Colón' },
    { code: 'CUP', symbol: '₱', name: 'Cuban Peso' },
    { code: 'CVE', symbol: '$', name: 'Cape Verdean Escudo' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    { code: 'DJF', symbol: 'Fdj', name: 'Djiboutian Franc' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
    { code: 'DOP', symbol: 'RD$', name: 'Dominican Peso' },
    { code: 'DZD', symbol: 'د.ج', name: 'Algerian Dinar' },
    { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
    { code: 'ERN', symbol: 'Nfk', name: 'Eritrean Nakfa' },
    { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
    { code: 'FJD', symbol: 'FJ$', name: 'Fijian Dollar' },
    { code: 'GEL', symbol: '₾', name: 'Georgian Lari' },
    { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
    { code: 'GMD', symbol: 'D', name: 'Gambian Dalasi' },
    { code: 'GNF', symbol: 'FG', name: 'Guinean Franc' },
    { code: 'GTQ', symbol: 'Q', name: 'Guatemalan Quetzal' },
    { code: 'HNL', symbol: 'L', name: 'Honduran Lempira' },
    { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },
    { code: 'HTG', symbol: 'G', name: 'Haitian Gourde' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel' },
    { code: 'IQD', symbol: 'ع.د', name: 'Iraqi Dinar' },
    { code: 'IRR', symbol: '﷼', name: 'Iranian Rial' },
    { code: 'ISK', symbol: 'kr', name: 'Icelandic Króna' },
    { code: 'JMD', symbol: 'J$', name: 'Jamaican Dollar' },
    { code: 'JOD', symbol: 'د.ا', name: 'Jordanian Dinar' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    { code: 'KGS', symbol: 'с', name: 'Kyrgystani Som' },
    { code: 'KHR', symbol: '៛', name: 'Cambodian Riel' },
    { code: 'KMF', symbol: 'CF', name: 'Comorian Franc' },
    { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar' },
    { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge' },
    { code: 'LAK', symbol: '₭', name: 'Laotian Kip' },
    { code: 'LBP', symbol: 'ل.ل', name: 'Lebanese Pound' },
    { code: 'LKR', symbol: '₨', name: 'Sri Lankan Rupee' },
    { code: 'LRD', symbol: 'L$', name: 'Liberian Dollar' },
    { code: 'LSL', symbol: 'L', name: 'Lesotho Loti' },
    { code: 'LYD', symbol: 'ل.د', name: 'Libyan Dinar' },
    { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham' },
    { code: 'MDL', symbol: 'L', name: 'Moldovan Leu' },
    { code: 'MGA', symbol: 'Ar', name: 'Malagasy Ariary' },
    { code: 'MKD', symbol: 'ден', name: 'Macedonian Denar' },
    { code: 'MMK', symbol: 'K', name: 'Myanmar Kyat' },
    { code: 'MNT', symbol: '₮', name: 'Mongolian Tugrik' },
    { code: 'MOP', symbol: 'MOP$', name: 'Macanese Pataca' },
    { code: 'MRU', symbol: 'UM', name: 'Mauritanian Ouguiya' },
    { code: 'MUR', symbol: '₨', name: 'Mauritian Rupee' },
    { code: 'MVR', symbol: 'Rf', name: 'Maldivian Rufiyaa' },
    { code: 'MWK', symbol: 'MK', name: 'Malawian Kwacha' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'MZN', symbol: 'MT', name: 'Mozambican Metical' },
    { code: 'NAD', symbol: 'N$', name: 'Namibian Dollar' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'NIO', symbol: 'C$', name: 'Nicaraguan Córdoba' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    { code: 'NPR', symbol: '₨', name: 'Nepalese Rupee' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
    { code: 'OMR', symbol: 'ر.ع.', name: 'Omani Rial' },
    { code: 'PAB', symbol: 'B/.', name: 'Panamanian Balboa' },
    { code: 'PEN', symbol: 'S/.', name: 'Peruvian Nuevo Sol' },
    { code: 'PGK', symbol: 'K', name: 'Papua New Guinean Kina' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
    { code: 'PYG', symbol: '₲', name: 'Paraguayan Guarani' },
    { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Rial' },
    { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
    { code: 'RSD', symbol: 'дин.', name: 'Serbian Dinar' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    { code: 'RWF', symbol: 'FRw', name: 'Rwandan Franc' },
    { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
    { code: 'SBD', symbol: 'SI$', name: 'Solomon Islands Dollar' },
    { code: 'SCR', symbol: '₨', name: 'Seychellois Rupee' },
    { code: 'SDG', symbol: 'ج.س.', name: 'Sudanese Pound' },
    { code: 'SOS', symbol: 'S', name: 'Somali Shilling' },
    { code: 'SRD', symbol: '$', name: 'Surinamese Dollar' },
    { code: 'SSP', symbol: '£', name: 'South Sudanese Pound' },
    { code: 'STN', symbol: 'Db', name: 'São Tomé and Príncipe Dobra' },
    { code: 'SYP', symbol: '£S', name: 'Syrian Pound' },
    { code: 'SZL', symbol: 'E', name: 'Swazi Lilangeni' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    { code: 'TJS', symbol: 'ЅМ', name: 'Tajikistani Somoni' },
    { code: 'TMT', symbol: 'm', name: 'Turkmenistani Manat' },
    { code: 'TND', symbol: 'د.ت', name: 'Tunisian Dinar' },
    { code: 'TOP', symbol: 'T$', name: 'Tongan Paʻanga' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    { code: 'TTD', symbol: 'TT$', name: 'Trinidad and Tobago Dollar' },
    { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar' },
    { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
    { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
    { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
    { code: 'UYU', symbol: '$U', name: 'Uruguayan Peso' },
    { code: 'UZS', symbol: 'so\'m', name: 'Uzbekistani Som' },
    { code: 'VES', symbol: 'Bs.', name: 'Venezuelan Bolívar' },
    { code: 'VND', symbol: '₫', name: 'Vietnamese Đồng' },
    { code: 'VUV', symbol: 'VT', name: 'Vanuatu Vatu' },
    { code: 'WST', symbol: 'WS$', name: 'Samoan Tala' },
    { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA Franc' },
    { code: 'XCD', symbol: 'EC$', name: 'East Caribbean Dollar' },
    { code: 'XOF', symbol: 'CFA', name: 'West African CFA Franc' },
    { code: 'XPF', symbol: '₣', name: 'CFP Franc' },
    { code: 'YER', symbol: '﷼', name: 'Yemeni Rial' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha' },
    { code: 'ZWL', symbol: 'Z$', name: 'Zimbabwean Dollar' },
  ].sort((a, b) => a.name.localeCompare(b.name));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'file') {
      const file = e.target.files[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file)
        }));
      }
    } else if (name === 'price') {
      // Only allow numbers and decimal point
      const formattedValue = value.replace(/[^\d.]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'category' && value !== 'Others') {
      // Clear custom category when a predefined category is selected
      setFormData(prev => ({
        ...prev,
        [name]: value,
        customCategory: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Product created successfully!');
      // Reset form or redirect
    } catch (error) {
      toast.error('Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-2xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Create New Product
          </h2>
          <p className="text-gray-600">
            Add your product details below
          </p>
        </motion.div>

        <motion.form
          variants={containerVariants}
          className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Title */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Title
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                bg-gray-50 text-gray-900 
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                focus:bg-white
                transition duration-200 ease-in-out"
              placeholder="Enter product title"
              value={formData.title}
              onChange={handleChange}
            />
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              required
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                bg-gray-50 text-gray-900 
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                focus:bg-white
                transition duration-200 ease-in-out"
              placeholder="Describe your product..."
              value={formData.description}
              onChange={handleChange}
            />
          </motion.div>

          {/* Image Upload */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {formData.imagePreview ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={formData.imagePreview}
                      alt="Product preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      name="image"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </motion.div>

          {/* Price, Currency and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Currency */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                name="currency"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                  bg-gray-50 text-gray-900 
                  focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                  focus:bg-white
                  transition duration-200 ease-in-out"
                value={formData.currency}
                onChange={handleChange}
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol}) - {currency.name}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Price */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {currencies.find(c => c.code === formData.currency)?.symbol}
                  </span>
                </div>
                <input
                  type="text"
                  name="price"
                  required
                  className="w-full pl-7 px-4 py-3 rounded-lg border border-gray-300 
                    bg-gray-50 text-gray-900 
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                    focus:bg-white
                    transition duration-200 ease-in-out"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </motion.div>

            {/* Category */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                  bg-gray-50 text-gray-900 
                  focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                  focus:bg-white
                  transition duration-200 ease-in-out"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Custom Category Input - Shows only when 'Others' is selected */}
              {formData.category === 'Others' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3"
                >
                  <input
                    type="text"
                    name="customCategory"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 
                      bg-gray-50 text-gray-900 
                      focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                      focus:bg-white
                      transition duration-200 ease-in-out"
                    placeholder="Enter custom category"
                    value={formData.customCategory}
                    onChange={handleChange}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Please specify your custom category
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Availability */}
          <motion.div variants={itemVariants} className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Product is available for sale
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            variants={itemVariants}
            className="pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg text-white font-medium
                ${isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
                } 
                transition-all duration-200 ease-in-out
                shadow-lg hover:shadow-xl
                flex items-center justify-center space-x-2`}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <span>Create Product</span>
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
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default CreateProduct;
