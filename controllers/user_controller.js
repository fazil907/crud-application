const User = require("../models/users");

// login get

exports.loginPage = (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.render("login", { title: "login" });
  }
};

// login post

exports.loginPost = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user.email === req.body.email && user.password === req.body.password) {
      req.session.user = user.email;
      // req.session.loggedIn = true;
      res.redirect("/home");
    } else {
      res.render('login', {message : "You have entered incorrect email or password"});
    }
  } catch (error) {
    res.render('login', {message : "User doesnt exist. Please sign up"});
  }
};

// signup get

exports.signupGet = (req, res) => {
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.render("signup", { title: "sign up" });
  }
};

//signup post

exports.signupPost = async (req, res) => {
  try {
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser) {
      return res.render('signup', {message : "This email already exists"})
    }
    const existPhone = await User.findOne({ phone: req.body.phone });
    if (existPhone) {
     return res.render('signup', {message : "This phone number already exists"})
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    });

    const savedUser = await user.save();

    res.render("login", { message: "User succesfully registered" });
  } catch (error) {
    res.status(500).json  ({ message: error.message, type: "danger" });
  }
};

// logout

exports.userLogout = (req, res) => {
  delete req.session.user
  res.redirect("/");
};

exports.getHome = (req, res) => {
  if (req.session.user) {
    res.render("home", { user: req.session.user });
  } else {
    res.redirect("/");
  }
}



























// function validate(req, res, next) {
//   if (req.session.user) {
//       next();
//   } else {
//       res.redirect('/login');
//   }
// }

