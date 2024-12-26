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
      
      // Skip to next page even if fields are empty
      setTimeout(() => {
        router.push('/dashboard/watsapp-no');
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to save API configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard/watsapp-no');
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
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            API Configuration (Optional)
          </h2>
          <p className="text-gray-600">
            Configure your organization's API settings or skip this step
          </p>
        </motion.div>

        <motion.form
          variants={containerVariants}
          className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              API URL (Optional)
            </label>
            <input
              type="url"
              name="api_url"
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
              Enter the base URL for your API endpoint (if applicable)
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
              placeholder="Enter your API key (if applicable)"
              value={formData.api_key}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Your API key will be encrypted if provided
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="pt-4 space-y-4"
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
                  <span>Save & Continue</span>
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

            <motion.button
              type="button"
              onClick={handleSkip}
              className="w-full py-3 px-6 rounded-lg text-gray-600 font-medium
                bg-gray-100 hover:bg-gray-200
                transition-all duration-200 ease-in-out
                flex items-center justify-center space-x-2"
            >
              <span>Skip this step</span>
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
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </motion.button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-4 text-sm text-gray-500 text-center"
          >
            <p>
              You can always configure these settings later from your organization profile
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default OrganizationFile;
