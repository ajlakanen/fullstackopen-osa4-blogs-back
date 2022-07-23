const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}); //.then((persons) => {
  response.json(blogs);
  // });
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog);
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

// personRouter.get("/info", (req, res) => {
//   Person.countDocuments({}, function (err, count) {
//     res.send(
//       `<p>Phonebook has info for ${count} people.</p><p>${new Date()}</p>`
//     );
//   });
// });

blogsRouter.post("/", async (request, response, next) => {
  const blog = new Blog(request.body);
  /*
  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
    */
  try {
    const saved = await blog.save();
    response.status(201).json(saved);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const { title, url, likes } = request.body;

  try {
    const updated = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, url, likes },
      { new: true, runValidators: true, context: "query" }
    );
    if (updated) {
      response.json(updated);
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
