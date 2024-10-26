import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  LogIn,
  UserPlus,
  BookOpen,
  MessageSquare,
  Info,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PublicLayout = () => {
  const { currentUser } = useAuth();

  const navItems = [
    { to: '/knowledge', icon: BookOpen, label: 'Knowledge Base' },
    { to: '/about', icon: Info, label: 'About' },
    { to: '/feedback', icon: MessageSquare, label: 'Feedback' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <nav className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Car className="w-8 h-8 text-accent-500" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-accent-400 to-accent-600 text-transparent bg-clip-text">
                AutoVault
              </span>
            </Link>

            <div className="flex items-center space-x-8">
              {navItems.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <motion.div whileHover={{ scale: 1.1 }} className="relative">
                    <Icon className="w-5 h-5 mr-1 group-hover:text-accent-400" />
                    <motion.div
                      className="absolute -inset-1 bg-accent-500/20 rounded-full blur"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                  </motion.div>
                  <span className="hidden md:inline">{label}</span>
                </Link>
              ))}

              {currentUser ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 transition-all duration-300 shadow-lg hover:shadow-accent-500/50"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-2 rounded-full border border-white/20 hover:border-accent-500 text-white transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 transition-all duration-300 shadow-lg hover:shadow-accent-500/50"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <footer className="bg-black/30 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-accent-400 tracking-wider uppercase">
                About
              </h3>
              <p className="mt-4 text-base text-gray-300">
                AutoVault helps you manage your vehicle registration and
                documentation process efficiently.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-accent-400 tracking-wider uppercase">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-4">
                {navItems.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-base text-gray-300 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-accent-400 tracking-wider uppercase">
                Contact
              </h3>
              <ul className="mt-4 space-y-4">
                <li className="text-base text-gray-300">
                  Email: support@autovault.com
                </li>
                <li className="text-base text-gray-300">
                  Phone: +264 61 123 4567
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8">
            <p className="text-base text-gray-400 text-center">
              © {new Date().getFullYear()} AutoVault. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
