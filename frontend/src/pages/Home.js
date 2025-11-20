import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, Sparkles, StickyNote } from 'lucide-react';
import API from '../utils/api';
import { isAuthenticated } from '../utils/api';

const Home = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Add this handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    // Check authentication
    if (!isAuthenticated()) {
      alert('Please login first to create notes!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await API.post('/notes', newNote);
      setNewNote({ title: '', content: '' });
      setIsFormOpen(false);
      alert('Note created successfully!');
    } catch (error) {
      console.error('Error creating note:', error);
      console.error('Error response:', error.response);
      alert(error.response?.data?.message || 'Error creating note. Please check if you are logged in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNoteClick = () => {
    if (!isAuthenticated()) {
      alert('Please login first to create notes!');
      return;
    }
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 pt-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
              <StickyNote className="h-16 w-16 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight"
          >
            Capture Your Thoughts
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Beautiful notes with smooth animations. Organize your ideas effortlessly.
          </motion.p>

          {/* Authentication Status */}
          {!isAuthenticated() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl max-w-md mx-auto shadow-sm"
            >
              <div className="flex items-center justify-center space-x-3 text-amber-800">
                <Sparkles className="h-6 w-6" />
                <span className="font-medium">Please login to create notes</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Add Note Button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mb-16"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNoteClick}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-4 text-xl font-bold"
          >
            <Plus className="h-7 w-7" />
            <span>Create New Note</span>
          </motion.button>
        </motion.div>

        {/* Add Note Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setIsFormOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-xl">
                    <StickyNote className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Create New Note</h2>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Title
                      </label>
                      <input
                        type="text"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-lg"
                        placeholder="What's this note about?"
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-3">
                        Content
                      </label>
                      <textarea
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        rows="6"
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-lg resize-none"
                        placeholder="Write your thoughts here..."
                        required
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all font-semibold text-lg"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                      <span>{isLoading ? 'Creating...' : 'Create Note'}</span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20"
        >
          {[
            { 
              icon: '✨', 
              title: 'Beautiful Design', 
              desc: 'Modern, clean interface with smooth animations',
              color: 'from-pink-500 to-rose-500'
            },
            { 
              icon: '⚡', 
              title: 'Fast & Smooth', 
              desc: 'Instant animations and responsive design',
              color: 'from-green-500 to-emerald-500'
            },
            { 
              icon: '🔒', 
              title: 'Secure', 
              desc: 'Your notes are protected with authentication',
              color: 'from-blue-500 to-cyan-500'
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 text-center group"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white text-4xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;