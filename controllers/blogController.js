const { StatusCodes } = require('http-status-codes');

const Blog = require('../model/Blog');
const APIFeatures = require('../utils/apiFeatures');
const NotFoundError = require('../errors/notFound');

exports.getAllBlogs = async (req, res, next) => {
  const features = new APIFeatures(Blog.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const blogs = await features.query;

  res.status(StatusCodes.OK).json({
    status: 'success',
    nbHits: blogs.length,
    requestedAt: req.requestTime,
    blogs,
  });
};

exports.getBlogById = async (req, res, next) => {
  const { id: blogId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return next(
      new NotFoundError(`There is no blog with the given ID → ${blogId}`)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    blog,
  });
};

exports.getBlogBySlug = async (req, res, next) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug });

  if (!blog) {
    return next(
      new NotFoundError(`There is no blog with the given SLUG → ${slug}`)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    blog,
  });
};

exports.createBlog = async (req, res, next) => {
  const blog = await Blog.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    blog,
  });
};

exports.updateBlog = async (req, res, next) => {
  const { id: blogId } = req.params;

  const updatedBlog = await Blog.findByIdAndUpdate(
    blogId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBlog) {
    return next(
      new NotFoundError(`There is no blog with the given ID → ${blogId}`)
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    blog: updatedBlog,
  });
};

exports.deleteBlog = async (req, res, next) => {
  const { id: blogId } = req.params;

  const blog = await Blog.findByIdAndDelete(blogId);

  if (!blog) {
    return next(
      new NotFoundError(`There is no blog with the given ID → ${blogId}`)
    );
  }

  res.status(StatusCodes.NO_CONTENT).json({
    status: 'success',
    blog: null,
  });
};
