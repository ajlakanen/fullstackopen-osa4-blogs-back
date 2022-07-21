const mongoose = require("mongoose");
const supertest = require("supertest");
const helpers = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const initialTestData = require("./blogs_testdata");
const initialTestDataLength =
  initialTestData.listWithOneBlog.length + initialTestData.manyBlogs.length;
const Blog = require("../models/blog");

const BASEURL = "/api/blogs";

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObj = new Blog(initialTestData.listWithOneBlog[0]);
  await blogObj.save();
  /*
  initialTestData.manyBlogs.map(async (blog) => {
    let a = new Blog(blog);
    await a.save();
  });
  */
  // blogObj = new Blog(initialTestData.manyBlogs[0]);
  // await blogObj.save();
  // blogObj = new Blog(initialTestData.manyBlogs[1]);
  // await blogObj.save();
  // blogObj = new Blog(initialTestData.manyBlogs[2]);
  // await blogObj.save();
  // blogObj = new Blog(initialTestData.manyBlogs[3]);
  // await blogObj.save();
  // blogObj = new Blog(initialTestData.manyBlogs[4]);
  // await blogObj.save();
  Blog.insertMany(initialTestData.manyBlogs);
});

test("blog are returned as json", async () => {
  await api
    .get(`${BASEURL}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get(`${BASEURL}`);
  // tänne tullaan vasta kun edellinen komento eli HTTP-pyyntö on suoritettu
  // muuttujassa response on nyt HTTP-pyynnön tulos
  expect(response.body).toHaveLength(initialTestDataLength);
});

test("some blog is about go to", async () => {
  const response = await api.get(`${BASEURL}`);
  const contents = response.body.map((r) => r.title);
  expect(contents).toContain("Go To Statement Considered Harmful");
});

test("a valid blog can be added ", async () => {
  const newBlog = {
    title: "Programming is fun",
    author: "Antero-Jaakko Liukanen",
    url: "http://www.google.com",
    likes: 5,
  };

  await api
    .post(`${BASEURL}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helpers.blogsInDb();
  expect(blogsAtEnd).toHaveLength(initialTestDataLength + 1);
  const contents = blogsAtEnd.map((blog) => blog.title);
  expect(contents).toContain("Programming is fun");
});

test("blog without title is not added", async () => {
  await api.post(`${BASEURL}`).send(initialTestData.blogWoTitle).expect(400);
  const blogsAtEnd = await helpers.blogsInDb();
  expect(blogsAtEnd).toHaveLength(initialTestDataLength);
});

afterAll(() => {
  mongoose.connection.close();
});
