exports.moment = require('moment');

exports.dump = (obj) => JSON.stringify(obj, null, 2);

exports.siteName = 'Blog App';

exports.menu = [
  { slug: '/blogs', title: 'Home' },
  { slug: '/blogs/new', title: 'New Post' },
];
