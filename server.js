const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

// Partials allow the ability to put reused markup in a file
// registerPartials is where hbs looks for the partials
hbs.registerPartials(__dirname + '/views/partials');

// Tells express to use the handlebars template engine to render
app.set('view engine', 'hbs');

// Middleware. Use methods execute in order of precedance.
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.originalUrl}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err)
      console.log("Unable to write to log.");
  });
  next();
});

app.use((req, res, next) => {
  res.render('maintenance.hbs');
});

// Tells express to look in the specific directory for all pages
// without having to app.get each possibility
app.use(express.static(__dirname + '/public'));

// Helpers allow for global variable access of commonly used snippets or markup
// PARAM1: variable name the templates access
// PARAM2: function that the templates execute when called
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// app.get is the express method that looks at a specific URL and executes
// the appropriate response (markup/function)
app.get('/', (req, res) => {
  // res.render is the HBS specific method that tell express to render the template file
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: `You've reached the homepage`,
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    name: 'about',
  });
});

app.get('/bad', (req, res) => {
  res.render('bad.hbs', {
    errorMessage: 'Unable to handle this request'
  });
});

// Tells express to listen on port 3000 when started
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
