const express = require("express");
const bodyParser = require("body-parser");

const users = require("./routes/users");
const posts = require("./routes/posts");
const comments = require('./routes/comments');
const error = require("./utilities/error");

const app = express();
const port = 3000;

// Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Это должно быть до подключения маршрутов

// Use our Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use('/api/comments', comments); // Комментарии

// Logging Middleware
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----\n${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// Valid API Keys
const apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];
app.use("/api", (req, res, next) => {
  const key = req.query["api-key"];

  if (!key) next(error(400, "API Key Required"));
  if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key"));

  req.key = key;
  next();
});

// Adding some HATEOAS links
app.get("/", (req, res) => {
  res.json({
    links: [
      { href: "/api", rel: "api", type: "GET" },
    ],
  });
});

app.get("/api", (req, res) => {
  res.json({
    links: [
      { href: "api/users", rel: "users", type: "GET" },
      { href: "api/users", rel: "users", type: "POST" },
      { href: "api/posts", rel: "posts", type: "GET" },
      { href: "api/posts", rel: "posts", type: "POST" },
    ],
  });
});

// 404 Middleware
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});
