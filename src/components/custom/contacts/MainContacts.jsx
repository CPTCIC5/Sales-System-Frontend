'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiEdit2, FiTrash2, FiEye, FiStar } from 'react-icons/fi';

const DUMMY_CONTACTS = [
  {
    id: 1,
    name: 'John Doe',
    phone_number: '9876543210',
    industry: 'Technology',
    website_url: 'https://johndoe.com',
    avatar: '',
    utm_campaign: 'summer_2024',
    utm_source: 'linkedin',
    utm_medium: 'social',
    is_favorite: true,
    org_id: '1'
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone_number: '8765432109',
    industry: 'Healthcare',
    website_url: 'https://janesmith.com',
    avatar: '',
    utm_campaign: 'spring_2024',
    utm_source: 'facebook',
    utm_medium: 'social',
    is_favorite: false,
    org_id: '1'
  },
  // Add more dummy contacts as needed
];

const DUMMY_GROUPS = [
  {
    id: 1,
    name: 'VIP Clients',
    contacts: [1, 2]
  },
  {
    id: 2,
    name: 'Potential Leads',
    contacts: [3, 4]
  }
];

const DUMMY_TAGS = [
  {
    id: 1,
    tag_name: 'High Priority',
    color_code: '#FF4444'
  },
  {
    id: 2,
    tag_name: 'Follow Up',
    color_code: '#44FF44'
  }
];

const MainContacts = () => {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    industry: '',
    website_url: '',
    avatar: '',
    utm_campaign: '',
    utm_source: '',
    utm_medium: '',
    is_favorite: false,
    org_id: '' // This should be set based on user's organization
  });

  useEffect(() => {
    
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchContacts(),
        fetchGroups(),
        fetchTags()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContacts(DUMMY_CONTACTS);
    } catch (error) {
      toast.error('Error fetching contacts');
    }
  };

  // const fetchGroups = async () => {
  //   try {
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //     setGroups(DUMMY_GROUPS);
  //   } catch (error) {
  //     toast.error('Error fetching groups');
  //   }
  // };

  const fetchTags = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTags(DUMMY_TAGS);
    } catch (error) {
      toast.error('Error fetching tags');
    }
  };

  const handleCreateContact = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/contacts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create contact');
      
      toast.success('Contact created successfully');
      setShowCreateModal(false);
      fetchContacts(); // Refresh contacts list
      
    } catch (error) {
      toast.error('Error creating contact');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch(`/api/contacts/delete/${contactId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete contact');
      
      toast.success('Contact deleted successfully');
      fetchContacts(); // Refresh contacts list
      
    } catch (error) {
      toast.error('Error deleting contact');
    }
  };

  const handleAssignTag = async (contactId, tagId) => {
    try {
      const response = await fetch(`/api/contacts/tags/${contactId}/assign/${tagId}`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to assign tag');
      
      toast.success('Tag assigned successfully');
      fetchContacts(); // Refresh contacts list
      
    } catch (error) {
      toast.error('Error assigning tag');
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
        avatar: URL.createObjectURL(e.target.files[0])
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNavigateToGroups = () => {
    router.push('/dashboard/groups');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone_number.includes(searchQuery)
  );
  const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const handleEditContact = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/contacts/update/${selectedContact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update contact');
      
      toast.success('Contact updated successfully');
      setShowEditModal(false);
      fetchContacts();
      
    } catch (error) {
      toast.error('Error updating contact');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const handleToggleFavorite = async (contactId, currentStatus) => {
    try {
      const response = await fetch(`/api/contacts/toggle-favorite/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_favorite: !currentStatus }),
      });

      if (!response.ok) throw new Error('Failed to toggle favorite');
      fetchContacts();
      
    } catch (error) {
      toast.error('Error updating favorite status');
    }
  };

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your business contacts and relationships
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg 
              hover:bg-indigo-700 transition-colors duration-200"
          >
            Add Contact
          </motion.button>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
                bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 
                shadow-sm hover:border-gray-400 
                transition-colors duration-200"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 
                bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 
                shadow-sm hover:border-gray-400 
                transition-colors duration-200"
            >
              <option value="name">Name</option>
              <option value="industry">Industry</option>
              <option value="created_at">Date Added</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
              {/* Groups Section - Now Clickable */}
              <div>
                <div 
                  onClick={handleNavigateToGroups}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
                >
                  <h3 className="text-lg font-medium text-gray-900">Groups</h3>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm"
                  >
                    View All
                  </motion.div>
                </div>
                <ul className="mt-3 space-y-2">
                  {groups.slice(0, 3).map(group => (
                    <li key={group.id} className="flex items-center justify-between p-2">
                      <span className="text-gray-700">{group.name}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {group.contacts?.length || 0}
                      </span>
                    </li>
                  ))}
                  {groups.length > 3 && (
                    <li className="text-sm text-gray-500 text-center pt-2">
                      + {groups.length - 3} more groups
                    </li>
                  )}
                </ul>
              </div>

              {/* Tags Section - Now Clickable */}
              <div>
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
                  onClick={() => toast.info('Tags management coming soon!')}
                >
                  <h3 className="text-lg font-medium text-gray-900">Tags</h3>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm"
                  >
                    Manage
                  </motion.div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.slice(0, 5).map(tag => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-sm cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: tag.color_code + '20', color: tag.color_code }}
                    >
                      {tag.tag_name}
                    </span>
                  ))}
                  {tags.length > 5 && (
                    <span className="text-sm text-gray-500">
                      + {tags.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contacts List */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {contact.avatar ? (
                            <Image
                              src={contact.avatar}
                              alt={contact.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {contact.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                            <div className="text-sm text-gray-500">{contact.phone_number}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contact.industry}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contact.website_url && (
                          <a 
                            href={contact.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Visit Site
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFavorite(contact.id, contact.is_favorite)}
                          className={`${
                            contact.is_favorite 
                              ? 'text-yellow-400 hover:text-yellow-500' 
                              : 'text-gray-400 hover:text-gray-500'
                          }`}
                        >
                          <FiStar className={`w-5 h-5 ${contact.is_favorite ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleViewContact(contact)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedContact(contact);
                              setFormData(contact);
                              setShowEditModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-end">
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Create Contact Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Contact</h2>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({
                    name: '',
                    phone_number: '',
                    industry: '',
                    website_url: '',
                    avatar: '',
                    utm_campaign: '',
                    utm_source: '',
                    utm_medium: '',
                    is_favorite: false,
                    org_id: ''
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Basic Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 
                      shadow-sm hover:border-gray-400 
                      transition-colors duration-200"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone_number"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 
                      shadow-sm hover:border-gray-400 
                      transition-colors duration-200"
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 
                      shadow-sm hover:border-gray-400 
                      transition-colors duration-200"
                    value={formData.industry}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    name="website_url"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 
                      shadow-sm hover:border-gray-400 
                      transition-colors duration-200"
                    value={formData.website_url}
                    onChange={handleChange}
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
                {isLoading ? 'Creating...' : 'Create Contact'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Detail View Modal */}
      {showDetailModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
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
                {selectedContact.avatar ? (
                  <Image
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-2xl text-indigo-600 font-medium">
                      {selectedContact.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedContact.name}</h3>
                  <p className="text-gray-500">{selectedContact.industry || 'No industry specified'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                  <div className="mt-2 space-y-2">
                    <p className="text-gray-900">Phone: {selectedContact.phone_number}</p>
                    {selectedContact.website_url && (
                      <p className="text-gray-900">
                        Website: <a href={selectedContact.website_url} target="_blank" rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800">{selectedContact.website_url}</a>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Marketing Information</h4>
                  <div className="mt-2 space-y-2">
                    {selectedContact.utm_source && (
                      <p className="text-gray-900">Source: {selectedContact.utm_source}</p>
                    )}
                    {selectedContact.utm_campaign && (
                      <p className="text-gray-900">Campaign: {selectedContact.utm_campaign}</p>
                    )}
                    {selectedContact.utm_medium && (
                      <p className="text-gray-900">Medium: {selectedContact.utm_medium}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Contact</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditContact} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Same fields as Create Modal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 
                      shadow-sm hover:border-gray-400 
                      transition-colors duration-200"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone_number"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 
                      shadow-sm hover:border-gray-400 
                      transition-colors duration-200"
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 
                      shadow-sm hover:border-gray-400 
                      transition-colors duration-200"
                    value={formData.industry}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    name="website_url"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 
                      bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 
                      shadow-sm hover:border-gray-400 
                      transition-colors duration-200"
                    value={formData.website_url}
                    onChange={handleChange}
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
                {isLoading ? 'Updating...' : 'Update Contact'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MainContacts;
