require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('express-async-errors')

const { isActiveRoute } = require('./server/helpers/routeHelpers');
const connectDB = require('./server/config/db');
const {checkCookie} = require('./server/helpers/cookuehelper');

const app = express();
const PORT = process.env.PORT || 5000;
  
// Connect to DB
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.locals.isActiveRoute = isActiveRoute; 


app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.use((req, res, next) => {
  app.locals.token = req.cookies.token || null;
  console.log('app.locals.token',app.locals.token)
  next();
});


app.use(require('./server/middleware/errorMiddleware'))
app.use(require('./server/middleware/notFound'))


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

