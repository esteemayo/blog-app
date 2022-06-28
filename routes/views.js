const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/new', viewController.newPage);

router.get('/:slug/edit', viewController.editPage);

router.get('/details/:slug', viewController.getBlogBySlug);

router.route('/').get(viewController.home).post(viewController.createBlog);

router
  .route('/:id')
  .get(viewController.getBlogById)
  .put(viewController.updateBlog)
  .delete(viewController.deleteBlog);

module.exports = router;
