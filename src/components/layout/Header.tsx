import React, { useState } from 'react';
import { Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const userDisplayName = currentUser?.firstName && currentUser?.lastName
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : currentUser?.email?.split('@')[0];

  return (
    <header className="h-16 bg-gradient-to-r from-gray-900 to-black border-b border-white/10 fixed top-0 right-0 left-64 z-30">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex-1"></div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-white/10 rounded-full">
            <Bell size={20} className="text-gray-300" />
          </button>
          
          <div className="relative">
            <button 
              onClick={toggleMenu}
              className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {userDisplayName?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-gray-300">
                {userDisplayName}
              </span>
            </button>
            
            {isMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-white/10"
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <div className="py-1">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;