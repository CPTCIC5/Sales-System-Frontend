'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiMessageSquare, 
  FiUsers, 
  FiBox, 
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi'

const menuItems = [
  {
    title: 'Chats',
    icon: <FiMessageSquare className="w-5 h-5" />,
    path: '/dashboard/mainchat',
    subItems: [
      { title: 'All Chats', path: '/dashboard/mainchat' },
      { title: 'Archived', path: '/dashboard/mainchat/archived' }
    ]
  },
  {
    title: 'Contacts',
    icon: <FiUsers className="w-5 h-5" />,
    path: '/dashboard/maincontacts',
    subItems: [
      { title: 'All Contacts', path: '/dashboard/maincontacts' },
      { title: 'Groups', path: '/dashboard/groups' }
    ]
  },
  {
    title: 'Products',
    icon: <FiBox className="w-5 h-5" />,
    path: '/dashboard/mainproducts',
    subItems: [
      { title: 'All Products', path: '/dashboard/mainproducts' },
      { title: 'Add Product', path: '/dashboard/createproduct' }
    ]
  }
]

const Sidebar = () => {
  const [expandedItems, setExpandedItems] = useState([])
  const pathname = usePathname()

  const toggleExpand = (title) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (path) => pathname === path

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-40 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Your Logo</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <div key={item.title} className="mb-2">
            <button
              onClick={() => toggleExpand(item.title)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm
                ${isActive(item.path) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}
                transition-colors duration-200`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.title}</span>
              </div>
              {expandedItems.includes(item.title) ? (
                <FiChevronDown className="w-4 h-4" />
              ) : (
                <FiChevronRight className="w-4 h-4" />
              )}
            </button>

            {expandedItems.includes(item.title) && (
              <div className="overflow-hidden">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.path}
                    href={subItem.path}
                    className={`block pl-12 pr-4 py-2 text-sm
                      ${isActive(subItem.path) 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-gray-600 hover:bg-gray-50'}
                      transition-colors duration-200`}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div>
            <p className="text-sm font-medium text-gray-800">User Name</p>
            <p className="text-xs text-gray-500">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar