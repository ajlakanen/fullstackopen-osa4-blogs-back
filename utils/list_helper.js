const maxBy = require("lodash").maxBy;

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce(function (acc, blog) {
    return acc + blog.likes;
  }, 0);
};

const authorBlogs = (blogs, author) => {
  return blogs.filter((blog) => blog.author === author).length;
};

const authorLikes = (blogs, author) => {
  return totalLikes(blogs.filter((blog) => blog.author === author));
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {};
  const favorite = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  );
  return favorite;
};

const authorWithMostBlogs = (blogs) => {
  if (blogs.length === 0) return {};
  const authorWithMostBlogs = maxBy(blogs, function (blog) {
    return authorBlogs(blogs, blog.author);
  }).author;
  const most = {
    author: authorWithMostBlogs,
    blogs: authorBlogs(blogs, authorWithMostBlogs),
  };
  return most;
};

const authorWithMostLikes = (blogs) => {
  if (blogs.length === 0) return {};
  const authorWithMostLikes = maxBy(blogs, function (blog) {
    return authorLikes(blogs, blog.author);
  }).author;
  const most = {
    author: authorWithMostLikes,
    likes: authorLikes(blogs, authorWithMostLikes),
  };
  return most;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  authorWithMostBlogs,
  authorWithMostLikes,
};
