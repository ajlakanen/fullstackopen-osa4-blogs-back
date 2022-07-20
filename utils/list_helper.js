const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce(function (acc, blog) {
    return acc + blog.likes;
  }, 0);
};

const numberOfBlogs = (blogs, author) => {
  return blogs.filter((blog) => blog.author === author).length;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {};
  const favorite = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  );
  return favorite;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {};
  const authorWithMostBlogs = _.maxBy(blogs, function (blog) {
    return numberOfBlogs(blogs, blog.author);
  }).author;
  const most = {
    author: authorWithMostBlogs,
    blogs: numberOfBlogs(blogs, authorWithMostBlogs),
  };
  return most;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
