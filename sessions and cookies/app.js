const path = require('path');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const MONGODB_URI = 'mongodb+srv://solomon:1Godlovesme21@cluster0-kn0lh.mongodb.net/shop';
const store = new MongoDBStore({uri: MONGODB_URI, collection: 'sessions'})
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secrete', resave: false, saveUninitialized: false, store: store}));
app.use((req, res, next)=> {
  if(!req.session.user) {
    console.log('------from app.js while trying to find a user that has already been placed on the req.session');
    
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log( err));
})



app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    MONGODB_URI
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'sol',
          email: 'sol@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
    console.log('connected!');
    
  })
  .catch(err => {
    console.log(err);
  });
