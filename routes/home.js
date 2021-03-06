const express = require('express');
const router = express.Router();
const ctrl = require('../controllers');

// Render home page
router.get('/', ctrl.postsCtrl.showHomePage);
// Create new post
router.post('/', ctrl.postsCtrl.createNewPost);
// Create new comment
router.post('/:postId/', ctrl.commentsCtrl.createNewComment);
// Join/unjoin post
router.put('/:postId/', ctrl.postsCtrl.joinPost)
// Delete post
router.delete('/:postId/', ctrl.postsCtrl.deletePost)

module.exports = router;