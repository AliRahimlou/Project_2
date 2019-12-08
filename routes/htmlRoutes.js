var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Litty.findAll({}).then(function(dbLittys) {
      res.render("index", {
        msg: "Welcome!",
        litty: dbLittys
      });
    });
  });
  // Login Page
  app.get("/users/login", function (req, res) {
    res.render("login")
  });
  // Register Page
  app.get("/users/register", function (req, res) {
    res.render("register")
  });
  // Load Litty page and pass in an Litty by id
  app.get("/litty/:id", function(req, res) {
    db.Litty.findOne({ where: { id: req.params.id } }).then(function(dbLitty) {
      res.render("Litty", {
        litty: dbLitty
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
