const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all notes for user
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a note
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = new Note({ title, content, user: req.user.id });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a note
router.put("/:id", auth, async (req, res) => {
  const { title, content } = req.body;
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a note
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await Note.findByIdAndRemove(req.params.id);
    res.json({ message: "Note removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
