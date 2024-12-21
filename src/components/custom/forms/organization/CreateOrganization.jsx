'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const CreateOrganization = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    business_name: '',
    business_webURL: '',
    industry_type: '',
    business_model: ''
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
      toast.success('Organization created successfully!');
      
      // Redirect to OrganizationFile page after successful creation
      setTimeout(() => {
        router.push('/organizationfile');
      }, 1000); // Small delay to show the success message
      
    } catch (error) {
      toast.error('Failed to create organization');
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
            Create Organization
          </h2>
          <p className="text-gray-600">
            Let's set up your business profile
          </p>
        </motion.div>

        <motion.form
          variants={containerVariants}
          className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              name="business_name"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                bg-gray-50 text-gray-900 
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                focus:bg-white
                transition duration-200 ease-in-out
                placeholder:text-gray-500"
              placeholder="Enter your business name"
              value={formData.business_name}
              onChange={handleChange}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Website URL
            </label>
            <input
              type="url"
              name="business_webURL"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                bg-gray-50 text-gray-900 
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                focus:bg-white
                transition duration-200 ease-in-out
                placeholder:text-gray-500"
              placeholder="https://example.com"
              value={formData.business_webURL}
              onChange={handleChange}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Industry Type
            </label>
            <input
              type="text"
              name="industry_type"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                bg-gray-50 text-gray-900 
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                focus:bg-white
                transition duration-200 ease-in-out
                placeholder:text-gray-500"
              placeholder="e.g. Technology, Healthcare, Retail"
              value={formData.industry_type}
              onChange={handleChange}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Business Model
            </label>
            <select
              name="business_model"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                bg-gray-50 text-gray-900 
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                focus:bg-white
                transition duration-200 ease-in-out"
              value={formData.business_model}
              onChange={handleChange}
            >
              <option value="">Select Business Model</option>
              <option value="B2B">B2B</option>
              <option value="B2C">B2C</option>
              <option value="BOTH">Both B2B & B2C</option>
            </select>
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
                  <span>Create Organization</span>
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
        </motion.form>
      </motion.div>
    </div>
  );
};

export default CreateOrganization;
