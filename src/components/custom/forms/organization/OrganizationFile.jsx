'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const OrganizationFile = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    api_url: '',
    api_key: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('API configuration saved successfully!');
      
      setTimeout(() => {
        router.push('/watsapp-no');
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to save API configuration');
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
        className="max-w-lg mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            API Configuration
          </h2>
          <p className="text-gray-600">
            Configure your organization's API settings
          </p>
        </motion.div>

        <motion.form
          variants={containerVariants}
          className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              API URL
            </label>
            <input
              type="url"
              name="api_url"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                bg-gray-50 text-gray-900 
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                focus:bg-white
                transition duration-200 ease-in-out
                placeholder:text-gray-500"
              placeholder="https://api.example.com/v1"
              value={formData.api_url}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the base URL for your API endpoint
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              API Key (Optional)
            </label>
            <input
              type="password"
              name="api_key"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                bg-gray-50 text-gray-900 
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                focus:bg-white
                transition duration-200 ease-in-out
                placeholder:text-gray-500"
              placeholder="Enter your API key (optional)"
              value={formData.api_key}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Your API key will be encrypted if provided
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
                  <span>Save Configuration</span>
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
                      d="M5 13l4 4L19 7" 
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
              Make sure to keep your API key secure and never share it publicly
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default OrganizationFile;
