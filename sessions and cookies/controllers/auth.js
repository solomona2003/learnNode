const User = require('../models/user')
exports.getLogin = (req, res, next) => {   
  // console.log(req.get('Cookie').split('=')[1]);
  console.log(req.session.isLoggedIn);
  
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn
  });
};


exports.postLogin = (req, res, next) => {
  User.findById('5d7fbc96d22a181b2363d49c')
    .then(user => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save(err=> {
        res.redirect('/')

      })
      
    })
    .catch(err => console.log('from postLogin in auth.js, trying to get a user based on the user id', err));
  // res.setHeader('Set-Cookie', 'loggedIn = true; HttpOnly')
};


exports.postLogout = (req, res, next) => {
  req.session.destroy((error)=> {
    console.log(error);
    console.log('loggin');
    
    res.redirect('/')
  })
};