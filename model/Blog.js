const slugify = require('slugify');
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'A blog must have a title'],
      maxlength: [
        40,
        'A blog title must have less or equal than 40 characters',
      ],
      minlength: [10, 'A blog title must have more or equal than 10 charaters'],
    },
    slug: String,
    body: {
      type: String,
      trim: true,
      required: [true, 'A blog must have a body field'],
    },
    image: {
      type: String,
      required: [true, 'A blog must have an image'],
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ slug: -1 });
blogSchema.index({ title: 1, body: 1 });

blogSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();
  this.slug = slugify(this.title, { lower: true });

  const blogRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const blogWithSlug = await this.constructor.find({ slug: blogRegEx });

  if (blogWithSlug.length) {
    this.slug = `${this.slug}-${blogWithSlug.length + 1}`;
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
