// console.log('Hello World');

//define packages
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const validator = require('express-validator');
const session = require('express-session');
const app = express();

//define templates
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

//define how app handles static content
app.use(express.static('public'));

//define how bodyparser middleware will access content
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//session information
app.use(
  session({
    secret: 'jkrowling',
    resave: false,
    saveUninitialized: true
  })
)

//setup morgan for logging requests
app.use(morgan('dev'));

//configure validator
app.use(validator());

//create default session
app.use((req, res, next) => {
  if (!req.session.bookList){

    req.session.bookList = []
  }
    console.log(req.session)
    next();
  })

//configure the webroot
app.get('/', function(req, res){
  res.render('home', {
    myBooks: req.session.bookList
  })
});

app.get('/form', function(req, res){
  res.render('form')
})

//handling the posted data from the form and create a new line item for the list
app.post('/newBook', function(req, res){
  let book = req.body;

  req.checkBody('title', 'Title is required').notEmpty();

  req.checkBody('author', 'Author is required').notEmpty();

  let errors = req.validationErrors();
  if (errors){
    res.render('form', {
      errorList: errors,
      bookFields: book
    })
  } else {
  req.session.bookList.push(book);
  res.redirect('/');
  }
})


//configure how app will listen to console -- local host
app.listen(3000, function(){
  console.log("The application has started successfully!")
});
