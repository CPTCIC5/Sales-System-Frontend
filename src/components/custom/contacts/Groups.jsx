'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const DUMMY_GROUPS = [
  {
    id: 1,
    name: 'VIP Clients',
    contacts: [1, 2, 3],
    created_at: '2024-01-15'
  },
  {
    id: 2,
    name: 'Potential Leads',
    contacts: [4, 5],
    created_at: '2024-01-20'
  },
  {
    id: 3,
    name: 'Cold Contacts',
    contacts: [6, 7, 8, 9],
    created_at: '2024-01-25'
  }
];

const DUMMY_CONTACTS = [
  {
    id: 1,
    name: 'John Doe',
    phone_number: '9876543210'
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone_number: '8765432109'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    phone_number: '7654321098'
  }
];

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null);
  const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    selected_contacts: []
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchGroups(),
        fetchContacts()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGroups(DUMMY_GROUPS);
    } catch (error) {
      toast.error('Error fetching groups');
    }
  };

  const fetchContacts = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContacts(DUMMY_CONTACTS);
    } catch (error) {
      toast.error('Error fetching contacts');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/contacts/groups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formData.name }),
      });

      if (!response.ok) throw new Error('Failed to create group');
      
      const newGroup = await response.json();
      
      // Add selected contacts to the group
      await Promise.all(
        formData.selected_contacts.map(contactId =>
          fetch(`/api/contacts/groups/${contactId}/assign/${newGroup.id}`, {
            method: 'POST',
          })
        )
      );
      
      toast.success('Group created successfully');
      setShowCreateModal(false);
      setFormData({ name: '', selected_contacts: [] });
      fetchGroups();
      
    } catch (error) {
      toast.error('Error creating group');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const contactId = parseInt(value);
      setFormData(prev => ({
        ...prev,
        selected_contacts: e.target.checked
          ? [...prev.selected_contacts, contactId]
          : prev.selected_contacts.filter(id => id !== contactId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleGroupClick = (group) => {
    const groupWithContacts = {
      ...group,
      contactDetails: contacts.filter(contact => 
        group.contacts.includes(contact.id)
      )
    };
    setSelectedGroupDetails(groupWithContacts);
    setShowGroupDetailsModal(true);
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
            <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
            <p className="mt-2 text-sm text-gray-600">
              Create and manage contact groups
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg 
              hover:bg-indigo-700 transition-colors duration-200"
          >
            Create Group
          </motion.button>
        </div>

        {/* Groups List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {groups.map(group => (
              <div 
                key={group.id}
                onClick={() => handleGroupClick(group)}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg
                  hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                  <p className="text-sm text-gray-500">
                    {group.contacts?.length || 0} members
                  </p>
                </div>
                <div className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Group Details Modal */}
      {showGroupDetailsModal && selectedGroupDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedGroupDetails.name}
              </h2>
              <button 
                onClick={() => setShowGroupDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Group Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Created on: {new Date(selectedGroupDetails.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Total Members: {selectedGroupDetails.contacts.length}
                </p>
              </div>

              {/* Members List */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Group Members</h3>
                <div className="space-y-3">
                  {selectedGroupDetails.contactDetails.map(contact => (
                    <div 
                      key={contact.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {contact.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{contact.name}</p>
                          <p className="text-sm text-gray-500">{contact.phone_number}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowGroupDetailsModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg
                    hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowGroupDetailsModal(false);
                    setShowCreateModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg
                    hover:bg-indigo-700 transition-colors duration-200"
                >
                  Edit Group
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Group</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-6">
              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 
                    bg-gray-100 text-gray-900 
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                    focus:bg-white
                    transition duration-200 ease-in-out"
                  placeholder="Enter group name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Contact Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Contacts
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {contacts.map(contact => (
                    <label key={contact.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        name="contacts"
                        value={contact.id}
                        checked={formData.selected_contacts.includes(contact.id)}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-gray-900">{contact.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium
                  ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}
                  transition-colors duration-200`}
              >
                {isLoading ? 'Creating...' : 'Create Group'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Groups;
