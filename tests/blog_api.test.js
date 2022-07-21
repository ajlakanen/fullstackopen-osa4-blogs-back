const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const testdata = require("./blogs_testdata");
const Blog = require("../models/blog");

const BASEURL = "/api/blogs";

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObj = new Blog(testdata.listWithOneBlog[0]);
  await blogObj.save();
  //testdata.manyBlogs.map(async (blog) => {
  //  let a = new Blog(blog);
  //  await a.save();
  //});
  blogObj = new Blog(testdata.manyBlogs[0]);
  await blogObj.save();
  blogObj = new Blog(testdata.manyBlogs[1]);
  await blogObj.save();
  blogObj = new Blog(testdata.manyBlogs[2]);
  await blogObj.save();
  blogObj = new Blog(testdata.manyBlogs[3]);
  await blogObj.save();
  blogObj = new Blog(testdata.manyBlogs[4]);
  await blogObj.save();
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
  expect(response.body).toHaveLength(
    testdata.listWithOneBlog.length + testdata.manyBlogs.length
  );
});

test("some blog is about go to", async () => {
  const response = await api.get(`${BASEURL}`);
  const contents = response.body.map((r) => r.title);
  expect(contents).toContain("Go To Statement Considered Harmful");
});

afterAll(() => {
  mongoose.connection.close();
});
