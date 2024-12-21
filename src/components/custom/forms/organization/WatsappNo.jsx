'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const WatsappNo = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    whatsapp_number: '',
    country_code: '+91' // Default to India's country code
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'whatsapp_number') {
      // Only allow numbers and limit to 10 digits
      const formattedValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
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
    
    if (formData.whatsapp_number.length !== 10) {
      toast.error('Please enter a valid 10-digit WhatsApp number');
      return;
    }

    setIsLoading(true);

    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('WhatsApp number saved successfully!');
      
      // Redirect to next step or dashboard
      setTimeout(() => {
        router.push('/dashboard'); // Change this to your next route
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to save WhatsApp number');
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

  // Add comprehensive country codes list
  const countryCodes = [
    { code: '+91', country: 'IN' },
    { code: '+1', country: 'US' },
    { code: '+44', country: 'GB' },
    { code: '+86', country: 'CN' },
    { code: '+81', country: 'JP' },
    { code: '+49', country: 'DE' },
    { code: '+33', country: 'FR' },
    { code: '+61', country: 'AU' },
    { code: '+7', country: 'RU' },
    { code: '+39', country: 'IT' },
    { code: '+34', country: 'ES' },
    { code: '+82', country: 'KR' },
    { code: '+55', country: 'BR' },
    { code: '+52', country: 'MX' },
    { code: '+971', country: 'AE' },
    { code: '+65', country: 'SG' },
    { code: '+64', country: 'NZ' },
    { code: '+27', country: 'ZA' },
    { code: '+20', country: 'EG' },
    { code: '+966', country: 'SA' },
  ].sort((a, b) => a.code.localeCompare(b.code));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-lg mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Add WhatsApp Number
          </h2>
          <p className="text-gray-600">
            Connect your business WhatsApp number
          </p>
        </motion.div>

        <motion.form
          variants={containerVariants}
          className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              WhatsApp Number
            </label>
            <div className="flex space-x-2">
              <select
                name="country_code"
                value={formData.country_code}
                onChange={handleChange}
                className="w-20 px-2 py-3 rounded-lg border border-gray-300 
                  bg-gray-50 text-gray-900 text-sm
                  focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                  focus:bg-white
                  transition duration-200 ease-in-out"
              >
                {countryCodes.map(({ code, country }) => (
                  <option key={code} value={code}>
                    {code} {country}
                  </option>
                ))}
              </select>
              
              <input
                type="tel"
                name="whatsapp_number"
                required
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 
                  bg-gray-50 text-gray-900 
                  focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                  focus:bg-white
                  transition duration-200 ease-in-out
                  placeholder:text-gray-500"
                placeholder="WhatsApp number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                maxLength="10"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Enter a valid WhatsApp number without country code
            </p>
          </motion.div>

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
                  <span>Continue</span>
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
                      d="M13 7l5 5m0 0l-5 5m5-5H6" 
                    />
                  </svg>
                </>
              )}
            </motion.button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-4 text-sm text-gray-500 text-center"
          >
            <p>
              This number will be used for business communications
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default WatsappNo;
