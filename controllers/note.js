const Note = require("../models/note");

const getNotes = async () => {
  return await Note.find().populate("user", "name role").sort({ _id: -1 });
};

const getNote = async (id) => {
  return await Note.findById(id).populate("user", "name role");
};

const addNote = async (title, content, userId) => {
  const newNote = new Note({
    title,
    content,
    user: userId,
  });
  await newNote.save();
  return await newNote.populate("user", "name role");
};

const updateNote = async (id, title, content) => {
  const updatedNote = await Note.findByIdAndUpdate(
    id,
    { title, content },
    { new: true }
  ).populate("user", "name role");
  return updatedNote;
};

const deleteNote = async (id) => {
  return await Note.findByIdAndDelete(id);
};

module.exports = {
  getNotes,
  getNote,
  addNote,
  updateNote,
  deleteNote,
};
