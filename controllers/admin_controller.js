const session = require("express-session");
const User = require("../models/users");

const credential = {
  email: "admin@gmail.com",
  password: "admin123",
};

// admin get

exports.adminGet = (req, res) => {
  try {
    if (req.session.admin) {
      res.redirect("/dashboard");
    } else {
      res.render("admin", { title: "Admin" });
    }
  } catch (error) {
    res.send({ message: error.message });
  }
};

// dashboard get

exports.dashboardGet = async (req, res) => {
  if (req.session.admin) {
    try {
      const users = await User.find().exec();
      res.render("index", {
        title: "Home Page",
        users: users,
      });
    } catch (error) {
      res.json({ message: err.message });
    }
  } else {
    res.redirect("/admin");
  }
};

// admin login

exports.adminPost = (req, res) => {
  if (
    req.body.email === credential.email &&
    req.body.password === credential.password
  ) {
    req.session.admin = true;
    res.redirect("/dashboard");
  } else {
    res.render("admin", {
      message: "You have entered incorrect email or password",
    });
  }
};

// add users get

exports.addGet = (req, res) => {
  try {
    if (req.session.admin) {
      res.render("add_users", { title: "Add Users" });
    }
  } catch (error) {
    res.send("An error occured");
  }
};

// add users post

exports.addPost = async (req, res) => {
  if (req.session.admin) {
    try {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      });
      await user.save();
      req.session.message = {
        type: "success",
        message: "User Added Successfully!",
      };
      res.redirect("/dashboard");
    } catch (error) {
      res.json({ message: error.message, type: "danger" });
    }
  } else {
    res.redirect("/admin");
  }
};

// edit users get

exports.editGet = async (req, res) => {
  if (req.session.admin) {
    try {
      let id = req.params.id;

      if (!id) {
        return res.redirect("/dashboard");
      }
      const user = await User.findByIdAndUpdate(id).exec();
      if (!user) {
        res.redirect("/dashboard");
      } else {
        res.render("edit_users", {
          title: "Edit User",
          user: user,
        });
      }
    } catch (err) {
      res.json({ message: err.message, type: "danger" });
    }
  } else {
    res.redirect("/admin");
  }
};

// edit user post

exports.updatePost = async (req, res) => {
  if (req.session.admin) {
    try {
      let id = req.params.id;

      if (!id) {
        return res.redirect("/");
      }
      const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      };
      const result = await User.findByIdAndUpdate(id, updatedUser, {
        new: true,
      }).exec();
      if (!result) {
        res.redirect("/dashboard");
      } else {
        req.session.message = {
          type: "success",
          message: "User updated succesfully",
        };
        res.redirect("/dashboard");
      }
    } catch (err) {
      res.json({ message: err.message, type: "danger" });
    }
  } else {
    res.redirect("/admin");
  }
};

// delete users

exports.deleteGet = async (req, res) => {
  try {
    let id = req.params.id;
    const deleteUser = await User.findByIdAndDelete(id).exec();
    if (!deleteUser) {
      res.redirect("/dashboard");
    } else {
      req.session.message = {
        type: "success",
        message: "User deleted succesffully",
      };
      res.redirect("/dashboard");
    }
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
};

// admin logout

exports.adminLogout = (req, res) => {
  delete req.session.admin;
  res.redirect("/admin");
};
