/* Not Optimization and controller */
/*
const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const Post = require("../models/post");
*/

/* Using Optimization and Controller */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const extractFile = require('../middleware/file');

const PostController = require('../controllers/post');

/* Not Sepearate Middleware */
/*
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mine type");
    if(isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name+ '-' + Date.now() + '.' + ext);
  }
});
*/


/************************** Create ***********************/

//router.post("/api/posts", (req, res, next) => {

/* Not Optimization and Not controller */
/*
router.post("",checkAuth , multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    });
  });
}); */

/* Using Controller */
/*
router.post("",checkAuth , multer({storage: storage}).single("image"), PostController.createPost);
*/

/* Using Controller And Separating the middleware */

router.post("", checkAuth, extractFile, PostController.createPost);






/************************** Put ***********************/

//router.get("/api/posts", (req, res, next) => {

/* Not Optimization and Not controller */
/*
router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
}); */

/* Using Controller */
router.get("", PostController.getPosts);

//router.get("/api/posts/:id", (req, res, next) => {

/* Not Optimization and Not controller */
/*
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    })
  });
}); */

/* Using Controller and Optimization */
router.get("/:id", PostController.getPost);




/************************** Put ***********************/

//router.put("/api/posts/:id", (req, res, next) => {

/* Not Optimization and Not controller */
/*
router.put("/:id",checkAuth ,multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log(post);
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if(result.nModified > 0){
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Could not update post!"
    });
  });
}); */


/* Using controller */
/*
router.put("/:id", checkAuth, multer({storage: storage}).single("image"), PostController.updatePost);
*/

/* Using controller and Separationg Middleware */
router.put("/:id", checkAuth, extractFile, PostController.updatePost);






/************************** Delete ***********************/

//router.delete("/api/posts/:id", (req, res, next) => {

/* Not Optimization and Not controller */
/*
router.delete("/:id",checkAuth ,(req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);
    if(result.n > 0){
      res.status(200).json({ message: "Delete successful!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  })
}); */

/* Using controller and Optimization */
router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
