const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce(function (acc, blog) {
    return acc + blog.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {};
  const favorite = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  );
  return favorite;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
