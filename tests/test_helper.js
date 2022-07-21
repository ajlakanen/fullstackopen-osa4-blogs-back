const Blog = require("../models/blog");
const initialTestData = require("./blogs_testdata");

const nonExistingId = async () => {
  const blog = new Blog(initialTestData.listWithOneBlog[0]);
  await blog.save();
  await blog.remove();
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  nonExistingId,
  blogsInDb,
};
