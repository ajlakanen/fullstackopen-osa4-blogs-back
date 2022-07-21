const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const persons = await Blog.find({}); //.then((persons) => {
  response.json(persons);
  // });
});

// blogsRouter.get("/:id", (request, response, next) => {
//   Blog.findById(request.params.id)
//     .then((person) => {
//       if (person) {
//         response.json(person);
//       } else {
//         response.status(404).end();
//       }
//     })
//     .catch((error) => next(error));
// });

// personRouter.get("/info", (req, res) => {
//   Person.countDocuments({}, function (err, count) {
//     res.send(
//       `<p>Phonebook has info for ${count} people.</p><p>${new Date()}</p>`
//     );
//   });
// });

blogsRouter.post("/", (request, response, next) => {
  const blog = new Blog(request.body);
  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
});

// blogsRouter.put("/:id", (request, response, next) => {
//   const { name, number } = request.body;
//   Blog.findByIdAndUpdate(
//     request.params.id,
//     { name, number },
//     { new: true, runValidators: true, context: "query" }
//   )
//     .then((updatedPerson) => {
//       response.json(updatedPerson);
//     })
//     .catch((error) => next(error));
// });

// blogsRouter.delete("/:id", (request, response, next) => {
//   Blog.findByIdAndRemove(request.params.id)
//     .then(() => {
//       response.status(204).end();
//     })
//     .catch((error) => next(error));
// });

module.exports = blogsRouter;
