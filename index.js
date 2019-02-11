// implement your API here
const express = require("express");
const db = require("./data/db.js");
const server = express();

server.use(express.json());

server.listen(5000, () => {
  console.log("server running!");
});

server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  db.insert({ name, bio })
    .then(user => res.status(201).json(user))
    .catch(err => {
      res.status(500).json({
        message: "There was an error while saving the user to the database"
      });
    });
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.send({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." })
    );
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(204).end();
      }
    })
    .catch(err =>
      res.status(500).json({ error: "The user could not be removed." })
    );
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const { name, bio } = req.body;

  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  db.update(id, { name, bio })
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })

    .catch(err =>
      res.status(500).json({ error: "The user could not be modified." })
    );
});
