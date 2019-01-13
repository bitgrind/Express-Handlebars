const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Load Routes
const threadsRoutes = require('./routes/threads');
const usersRoutes = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//Db conig
const db = require('./config/database');


//mongoose connections
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true
}).then((db) => {
  console.log('Mongodb Connected');
}).catch( error => {
  console.log('Mongodb Error')
  console.log(error)
});

//Handelbars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Static Paths folder
app.use(express.static(path.join(__dirname, 'public')));

//Method OVerride
app.use(methodOverride('_method'));

//Express Sessions Middleware
app.use(session({
  secret: 'secert',
  resave: true,
  saveUninitialized: true
}));

//Passport Sessions Middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash Middleware Init
app.use(flash());

// Global Varibles
app.use( (req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Thread Routes
app.use('/threads', threadsRoutes);
app.use('/users', usersRoutes);

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome to the Index Varible';
  res.render('index', {
    input: title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});