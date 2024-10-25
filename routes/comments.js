const express = require("express");
const router = express.Router();
const comments = require("../data/comments"); // import comments from data/comments.js
const error = require("../utilities/error");

// POST /comments - Create a new comment
router.post('/', (req, res, next) => {

    console.log("Request Body:", req.body); //test log

  const { userId, postId, body } = req.body;
  if (userId && postId && body) {
    const newComment = {
      id: comments.length + 1,
      userId,
      postId,
      body
    };
    comments.push(newComment);
    res.json(newComment);
  } else {
    next(error(400, "Insufficient Data"));
  }
});

// GET /comments - Retrieve all comments
router.get('/', (req, res) => {
  res.json(comments);
});

// GET /comments/:id - Retrieve a comment by id
router.get('/:id', (req, res, next) => {
  const commentId = parseInt(req.params.id);
  const comment = comments.find(c => c.id === commentId);

  if (comment) {
    res.json(comment);
  } else {
    next(error(404, 'Comment not found'));
  }
});

// PATCH /comments/:id - Update a comment by id
router.patch('/:id', (req, res, next) => {
  const commentId = parseInt(req.params.id);
  const { body } = req.body;
  const comment = comments.find(c => c.id === commentId);

  if (comment) {
    comment.body = body || comment.body;
    res.json(comment);
  } else {
    next(error(404, 'Comment not found'));
  }
});

// DELETE /comments/:id - Delete a comment by id
router.delete('/:id', (req, res, next) => {
  const commentId = parseInt(req.params.id);
  const index = comments.findIndex(c => c.id === commentId);

  if (index !== -1) {
    comments.splice(index, 1);
    res.json({ message: 'Comment deleted' });
  } else {
    next(error(404, 'Comment not found'));
  }
});

module.exports = router;
