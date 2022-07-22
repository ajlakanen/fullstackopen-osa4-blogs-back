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
  // miksihän tämä ei toimi?
  initialTestData.manyBlogs.map(async (blog) => {
    let a = new Blog(blog);
    await a.save();
  });
  // OK, selitys täällä:
  // https://fullstackopen.com/osa4/backendin_testaaminen#testin-before-each-metodin-optimointi
  */

  for (let i = 0; i < initialTestData.manyBlogs.length; i++) {
    const blog = initialTestData.manyBlogs[i];
    const a = new Blog(blog);
    await a.save();
  }
  // useita dokumentteja voi laittaa myös näin
  // await Blog.insertMany(initialTestData.manyBlogs);
});

test("blog are returned as json", async () => {
  await api
    .get(`${BASEURL}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blog id field is called id", async () => {
  const response = await api.get(`${BASEURL}`);
  const hasId = response.body.filter((blog) => "id" in blog);
  expect(hasId).toHaveLength(response.body.length);
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

test("a blog without likes defaults to 0 likes", async () => {
  const newBlog = {
    title: "Programming is fun",
    author: "Antero-Jaakko Liukanen",
    url: "http://www.google.com",
  };

  const resultBlog = await api
    .post(`${BASEURL}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(resultBlog.body.likes).toEqual(0);
});

test("a specific blog can be viewed", async () => {
  const blogsAtStart = await helpers.blogsInDb();

  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`${BASEURL}/${blogToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

  expect(resultBlog.body).toEqual(processedBlogToView);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helpers.blogsInDb();
  const blogToDelete = blogsAtStart[0];
  await api.delete(`${BASEURL}/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helpers.blogsInDb();
  expect(blogsAtEnd).toHaveLength(initialTestDataLength - 1);

  const titles = blogsAtEnd.map((b) => b.title);

  expect(titles).not.toContain(blogToDelete.content);
});

test("blog without title is not added", async () => {
  await api.post(`${BASEURL}`).send(initialTestData.blogWoTitle).expect(400);
  const blogsAtEnd = await helpers.blogsInDb();
  expect(blogsAtEnd).toHaveLength(initialTestDataLength);
});

test("blog without url is not added", async () => {
  await api.post(`${BASEURL}`).send(initialTestData.blogWoUrl).expect(400);
  const blogsAtEnd = await helpers.blogsInDb();
  expect(blogsAtEnd).toHaveLength(initialTestDataLength);
});

afterAll(() => {
  mongoose.connection.close();
});