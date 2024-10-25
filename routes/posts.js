const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "posts/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ posts, links });
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

module.exports = router;

////////////////////////////////////////////////part 2///////////////////////////////////////////////////


// GET /api/users/:id/posts - Retrieve all posts by a user with the specified id
router.get('/users/:id/posts', (req, res, next) => {
  const userId = parseInt(req.params.id);
  const userPosts = posts.filter(post => post.userId === userId);

  if (userPosts.length > 0) {
    res.json(userPosts);
  } else {
    next(error(404, 'No posts found for this user'));
  }
});


router.get('/', (req, res) => {
  const userId = parseInt(req.query.userId); // Get userId from query parameter
  if (userId) {
    const userPosts = posts.filter(post => post.userId === userId); // Filter posts by userId
    res.json(userPosts); // Return only the posts belonging to this user
  } else {
    res.json(posts); // Return all posts if userId is not provided
  }
});
