const Blog = require("../models/blog");
const User = require("../models/user");

// Tämä ei toimi koska user vaaditaan Blog-skeemassa
const nonExistingId = async () => {
  const blog = new Blog({
    title: "removable",
    url: "removable",
  });
  await blog.save();
  await blog.remove();
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  nonExistingId,
  blogsInDb,
  usersInDb,
};
