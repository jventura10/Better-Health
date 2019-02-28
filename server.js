require("dotenv").config();

var express = require("express");
var app = express();
var bodyParse = require("body-parser");
var exphbs = require("express-handlebars");

var passport = require("passport");
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var http = require('http').Server(app);
var io = require('socket.io')(http);

var PORT = process.env.PORT || 8080;

var db = require("./models");

require("./config/passport")(passport);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.use(session({
  key: 'key',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
require("./routes/apiRoutes")(app, passport,io);
require("./routes/htmlRoutes")(app, passport);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

io.on('connection', () => {
  console.log('a user is connected')
});

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  // Starting the server, syncing our models ------------------------------------/
  var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
  });
});

module.exports = app;
