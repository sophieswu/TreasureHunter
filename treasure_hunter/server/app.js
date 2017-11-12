const express = require('express');

const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const items = require('./routes/items');

const auth = require('./services/authService');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('chat message', 'this is working');
});

http.listen(3001, () => {
  console.log('listening on *:3001');
  setInterval(() => {
    io.emit('customEmit', 'this is sending to you')
  }, 3000);
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next){
  if (req.originalUrl == "/users/login"
    || req.originalUrl == "/users/logout"
    || req.originalUrl == "/users/reg"
    || req.originalUrl == "/users/isLoggedIn"
    || req.path == "/users/cartList"
    || req.path == "/items/list"
    || req.path == "/items/addCart"
    || req.path == "/items/bid"
    || req.path == "/items/alterOne"
    || req.path == "/socket.io/"
  ) {
    next();
  } else {
    auth.isAuthenticated(req, res, next)
  }
});

app.use('/', index);
app.use('/users', users);
app.use('/items', items);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
