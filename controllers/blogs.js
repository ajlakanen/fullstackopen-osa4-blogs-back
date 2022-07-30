const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate("user", {
      username: 1,
      name: 1,
    });
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post("/", userExtractor, async (request, response, next) => {
  try {
    const user = await User.findById(request.user.id);
    const blog = new Blog({ ...request.body, user: user._id });
    const saved = await blog.save();
    user.blogs = user.blogs.concat(saved._id);
    await user.save();
    // Redundant find? Solve at some point
    const newBlog = await Blog.findById(saved.id).populate("user", {
      username: 1,
      name: 1,
    });
    response.status(201).json(newBlog);
  } catch (exception) {
    next(exception);
  }
});

// TODO: When updating title, author orl url, check identity
blogsRouter.put("/:id", async (request, response, next) => {
  // const { title, author, url, likes } = request.body;
  const { likes } = request.body;

  try {
    const updated = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true, context: "query" }
    ).populate("user", {
      username: 1,
      name: 1,
    });
    if (updated) {
      response.json(updated);
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", userExtractor, async (request, response, next) => {
  try {
    const user = await User.findById(request.user.id);
    const blog = await Blog.findById(request.params.id);
    const blogUser = await User.findById(blog.user);
    if (user === null || blogUser === null)
      return response.status(401).json({ error: "no permission" });

    if (user.toString() !== blogUser.toString())
      return response.status(401).json({ error: "no permission" });
    await Blog.findByIdAndDelete(blog.id);
    user.blogs = user.blogs.filter(
      (b) => b._id.toString() !== request.params.id
    );

    await user.save();
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
