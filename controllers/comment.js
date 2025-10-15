const Comment = require("../models/comment");


const getComments = async (noteId) => {
  return await Comment.find({ noteId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
};


const createComment = async (noteId, userId, content) => {
  const comment = new Comment({ noteId, userId, content });
  await comment.save();
  return await comment.populate("userId", "name email"); 
};



const updateComment = async (id, content) => {
  return await Comment.findByIdAndUpdate(
    id,
    { content },
    { new: true }
  ).populate("userId", "name email");
};


const deleteComment = async (id) => {
  return await Comment.findByIdAndDelete(id);
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
