require("dotenv").config();
var express = require("express");
var socket = require('socket.io');
var exphbs = require("express-handlebars");
var path = require("path");
var passport = require('passport');
var session = require('express-session');
var app = express();
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Passport Config
require('./config/passport')(passport);

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    partialsDir  : [
      //  path to your partials
      path.join(__dirname, 'views/partials'),
  ]
  })
);
app.set("view engine", "handlebars");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  var server = app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });

  //socket connection established
  var io = socket(server);
  io.on('connection', (socket) =>{
    // db.sequelize.sync(syncOptions).then(function() {
    console.log('made socket connection', socket.id);
    
    socket.on('chat', function(data){
      io.sockets.emit('chat', data);
      console.log('chat data: ' + data.message)
    });

    socket.on('typing', function(data){
      socket.broadcast.emit('typing', data)
      console.log('working')
    })
    socket.on('chat', function(){
    
    })
  })
});

module.exports = app;
