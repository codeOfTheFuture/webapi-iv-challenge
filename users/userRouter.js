const express = require('express');

const UserDb = require('./userDb');
const PostDb = require('../posts/postDb');

const router = express.Router();

// Add a user
router.post('/', validateUser, async (req, res) => {
  try {
    const user = await UserDb.insert(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'There was an error adding the user',
    });
  }
});

// Add a post to a users posts
router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  const {
    body: { text, user_id },
  } = req;

  try {
    const post = await PostDb.insert({ text, user_id });
    res.status(201).json(post);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'There was an error adding the post',
    });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await UserDb.get(req.query);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'There was an error retrieving the users',
    });
  }
});

// Get a user by id
router.get('/:id', validateUserId, async (req, res) => {
  try {
    const {
      user: { id },
    } = req;

    const user = await UserDb.getById(id);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the user',
    });
  }
});

// Get all post from a single user
router.get('/:id/posts', validateUserId, async (req, res) => {
  const {
    user: { id },
  } = req;
  try {
    const usersPosts = await UserDb.getUserPosts(id);
    if (usersPosts && usersPosts.length) {
      res.status(200).json(usersPosts);
    } else {
      res.status(404).json({ message: 'No posts for this users.' });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: 'There was an error retrieving this users posts.' });
  }
});

// Delete a user
router.delete('/:id', validateUserId, async (req, res) => {
  try {
    const {
      user: { id },
    } = req;

    const deleteUser = await UserDb.remove(id);

    res
      .status(200)
      .json({ message: `User with the id of ${id} was successfully deleted.` });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'The user could not be deleted',
    });
  }
});

// Update a user
router.put('/:id', validateUserId, validateUser, async (req, res) => {
  console.log('middleware: ', req.user);
  try {
    const {
      body: { name },
      user: { id },
    } = req;
    const updatedUser = await UserDb.update(id, { name });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const {
      params: { id },
    } = req;
    const user = await UserDb.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res
        .status(404)
        .json({ message: `User with the id ${id} was not found.` });
    }
  } catch (error) {
    res.status(500).json({ message: 'There was an error validating the user' });
  }
}

function validateUser(req, res, next) {
  const {
    body,
    body: { name },
  } = req;
  if (!body) {
    res.status(400).json({ message: 'missing user data' });
  } else if (!name) {
    res.status(400).json({ message: 'missing required name field' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const {
    body: { text, user_id },
  } = req;
  if (!user_id) {
    res.status(400).json({ message: 'missing post data' });
  } else if (!text) {
    res.status(400).json({ message: 'missing required text field' });
  } else {
    next();
  }
}

module.exports = router;
