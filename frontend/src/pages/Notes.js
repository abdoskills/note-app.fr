import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit, Plus, X } from "lucide-react";
import API from "../utils/api";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState({
    _id: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await API.get("/notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      alert("Error fetching notes. Please check if you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await API.delete(`/notes/${noteId}`);
      setNotes(notes.filter((note) => note._id !== noteId));
      alert("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Error deleting note.");
    }
  };

  const openEditModal = (note) => {
    setEditingNote({ _id: note._id, title: note.title, content: note.content });
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setEditingNote({ _id: "", title: "", content: "" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put(`/notes/${editingNote._id}`, {
        title: editingNote.title,
        content: editingNote.content,
      });
      setNotes(
        notes.map((note) =>
          note._id === editingNote._id ? response.data : note
        )
      );
      closeEditModal();
      alert("Note updated successfully!");
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Error updating note.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            My Notes
          </h1>
          <p className="text-gray-600 mt-2">All your thoughts in one place</p>
        </div>
        <span className="text-gray-500">
          {notes.length} note{notes.length !== 1 ? "s" : ""}
        </span>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {notes.map((note, index) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
            >
              <h3 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2">
                {note.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-4">{note.content}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => openEditModal(note)}
                  >
                    <Edit size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteNote(note._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {notes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No notes yet
          </h3>
          <p className="text-gray-500">
            Create your first note to get started!
          </p>
        </motion.div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeEditModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Edit Note</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeEditModal}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </motion.button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingNote.title}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={editingNote.content}
                    onChange={(e) =>
                      setEditingNote({
                        ...editingNote,
                        content: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notes;
