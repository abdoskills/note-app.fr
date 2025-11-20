import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StickyNote, Home, LogOut, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isAuthenticated, getAuthToken, setAuthToken } from '../utils/api';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isLoggedIn = isAuthenticated();

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home', requiresAuth: false },
    { path: '/notes', icon: StickyNote, label: 'My Notes', requiresAuth: true },
  ];

  const filteredNavItems = navItems.filter(item => !item.requiresAuth || isLoggedIn);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/90 backdrop-blur-xl shadow-2xl border-b border-white/40 sticky top-0 z-40"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <StickyNote className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NoteFlow
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 font-semibold ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-lg'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </motion.button>
                </Link>
              );
            })}

            {/* Auth Section */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
              {isLoggedIn ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-2xl border border-green-200"
                  >
                    <User size={18} />
                    <span className="font-medium">Welcome!</span>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-3 bg-red-50 text-red-700 rounded-2xl hover:bg-red-100 transition-all font-semibold border border-red-200"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </motion.button>
                </>
              ) : (
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/auth?tab=login')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/auth?tab=register')}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:shadow-xl transition-all font-semibold shadow-lg"
                  >
                    Register
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-3 p-4 rounded-2xl transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-semibold">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Mobile Auth Section */}
                <div className="pt-3 border-t border-gray-200">
                  {isLoggedIn ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-200">
                        <User size={20} />
                        <span className="font-semibold">Welcome!</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 p-4 bg-red-50 text-red-700 rounded-2xl hover:bg-red-100 transition-all font-semibold border border-red-200"
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          navigate('/auth?tab=login');
                          setIsMobileMenuOpen(false);
                        }}
                        className="px-4 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-semibold text-sm"
                      >
                        Login
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          navigate('/auth?tab=register');
                          setIsMobileMenuOpen(false);
                        }}
                        className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:shadow-lg transition-all font-semibold text-sm"
                      >
                        Register
                      </motion.button>
                      
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;