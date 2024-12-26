'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const MainChat = () => {
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDropdown, setShowDropdown] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const mockChats = [
      {
        id: 1,
        name: 'Teamo',
        lastMessage: 'Hello there!',
        timestamp: 'Yesterday',
        phone: '+34 621 38 74 91'
      },
    ]
    setChats(mockChats)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const newMsg = {
      id: messages.length + 1,
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages([...messages, newMsg])
    setNewMessage('')
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Chats (192)</h2>
            <button className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700">
              Initiate Conversation
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2 top-2.5 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search name or number..."
                className="w-full px-8 py-2 border border-gray-200 rounded-md text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700">
              #
            </button>
          </div>
        </div>

        <div className="overflow-auto h-[calc(100vh-140px)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === chat.id ? 'bg-gray-50' : ''
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  {chat.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">{chat.name}</span>
                    <span className="text-sm text-gray-500">
                      {chat.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800">{selectedChat.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedChat.phone}
                </p>
              </div>
              <div className="relative">
                <button 
                  className="p-2 rounded-md hover:bg-gray-50 text-gray-700"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  ⋮
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                    <div className="py-1">
                      <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                        Add tags
                      </button>
                      <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                        Add notes
                      </button>
                      <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                        Clear Chat
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div 
              className="flex-1 overflow-auto p-4"
              style={{
                backgroundColor: '#efeae2',
                backgroundImage: `url("/watsapp/watsapp.png")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  } mb-4`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 bg-white flex gap-2 items-center"
            >
              <button type="button" className="p-2 hover:bg-gray-50 rounded-md text-gray-700">
                📎
              </button>
              <button type="button" className="p-2 hover:bg-gray-50 rounded-md text-gray-700">
                😊
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-gray-700 placeholder-gray-400"
              />
              <button 
                type="submit" 
                className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
              >
                ➤
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  )
}

export default MainChat
