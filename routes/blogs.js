const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

router
  .route('/')
  .get(blogController.getAllBlogs)
  .post(blogController.createBlog);

router
  .route('/:id')
  .get(blogController.getBlogById)
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);

router.get('/details/:slug', blogController.getBlogBySlug);

module.exports = router;
