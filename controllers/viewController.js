const slugify = require('slugify');
const { StatusCodes } = require('http-status-codes');

const Blog = require('../model/Blog');
const APIFeatures = require('../utils/apiFeatures');

exports.home = async (req, res, next) => {
  const features = new APIFeatures(Blog.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const blogs = await features.query;

  res.status(StatusCodes.OK).render('index', {
    title: 'Home Page',
    blogs,
  });
};

exports.getBlogById = async (req, res, next) => {
  const { id: blogId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return res.status(StatusCodes.NOT_FOUND).redirect('/blogs');
  }

  res.status(StatusCodes.OK).render('show', {
    title: blog.title,
    blog,
  });
};

exports.getBlogBySlug = async (req, res, next) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug });

  if (!blog) {
    return res.status(StatusCodes.NOT_FOUND).redirect('/blogs');
  }

  res.status(StatusCodes.OK).render('show', {
    title: blog.title,
    blog,
  });
};

exports.createBlog = async (req, res, next) => {
  const newBlog = {
    title: req.body.title,
    body: req.body.body,
    image: req.body.image,
  };

  await Blog.create({ ...newBlog });

  res.status(StatusCodes.CREATED).redirect('/blogs');
};

exports.updateBlog = async (req, res, next) => {
  const { id: blogId } = req.params;

  const newBlog = {
    title: req.body.title,
    body: req.body.body,
    image: req.body.image,
    slug: slugify(req.body.title, { lower: true }),
  };

  const blog = await Blog.findByIdAndUpdate(
    blogId,
    { ...newBlog },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!blog) {
    return res.status(StatusCodes.NOT_FOUND).redirect('/blogs');
  }

  res.status(StatusCodes.OK).redirect(`/blogs/details/${blog.slug}`);
};

exports.deleteBlog = async (req, res, next) => {
  const { id: blogId } = req.params;

  const blog = await Blog.findOneAndDelete({ _id: blogId });

  if (!blog) {
    return res.status(StatusCodes.NOT_FOUND).redirect('/blogs');
  }

  res.status(StatusCodes.OK).redirect('/blogs');
};

exports.editPage = async (req, res, next) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug });

  if (!blog) {
    return res.status(StatusCodes.NOT_FOUND).redirect('/blogs');
  }

  res.status(StatusCodes.OK).render('edit', {
    title: `Update ${blog.title}`,
    blog,
  });
};

exports.newPage = (req, res) => {
  res.status(StatusCodes.OK).render('new', {
    title: 'Create a New Blog Post',
  });
};
