const dummy = (blogs) => {
  return 1;
};

var blogs = [
  { name: "a", likes: 1 },
  { name: "b", likes: 2 },
  { name: "c", likes: 3 },
];

const totalLikes = (blogs) => {
  return blogs.reduce(function (acc, blog) {
    return acc + blog.likes;
  }, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
