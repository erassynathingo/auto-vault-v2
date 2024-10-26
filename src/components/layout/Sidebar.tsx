import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Car, 
  DollarSign, 
  Image, 
  BookOpen, 
  Settings,
  Users,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', color: 'from-blue-500 to-blue-600' },
  { path: '/cars', icon: Car, label: 'My Cars', color: 'from-green-500 to-green-600' },
  { path: '/add-car', icon: PlusCircle, label: 'Add Car', color: 'from-purple-500 to-purple-600' },
  { path: '/expenses', icon: DollarSign, label: 'Expenses', color: 'from-yellow-500 to-yellow-600' },
  { path: '/media', icon: Image, label: 'Media', color: 'from-pink-500 to-pink-600' },
  { path: '/knowledge', icon: BookOpen, label: 'Knowledge Base', color: 'from-indigo-500 to-indigo-600' },
];

const adminItems = [
  { path: '/users', icon: Users, label: 'User Management', color: 'from-red-500 to-red-600' },
];

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const MenuItem = ({ path, icon: Icon, label, color }: { path: string; icon: any; label: string; color: string }) => {
    const isActive = location.pathname === path;
    
    return (
      <Link to={path}>
        <motion.div
          whileHover={{ x: 5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
            ${isActive 
              ? `bg-gradient-to-r ${color} text-white shadow-lg` 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }
          `}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon size={20} />
          </motion.div>
          <span className="font-medium">{label}</span>
        </motion.div>
      </Link>
    );
  };

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="w-64 h-screen bg-gradient-to-b from-gray-900 to-black border-r border-white/10 fixed left-0 top-0 overflow-y-auto"
    >
      <div className="p-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2"
        >
          <Car className="w-8 h-8 text-accent-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-400 to-accent-600 text-transparent bg-clip-text">
            AutoVault
          </h1>
        </motion.div>
      </div>
      
      <nav className="px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <MenuItem key={item.path} {...item} />
        ))}
        
        {isAdmin && (
          <>
            <div className="border-t border-white/10 my-4"></div>
            {adminItems.map((item) => (
              <MenuItem key={item.path} {...item} />
            ))}
          </>
        )}
      </nav>
    </motion.div>
  );
};

export default Sidebar;