const express = require("express");
const router = express.Router();
const User = require("./user");

// authentication middleware
const requireUser = async (req, res, next) => {
  const userId = req.session.userId;
  if (userId) {
    const user = await User.findOne({ _id: userId });
    res.locals.user = user;
    next();
  } else {
    return res.redirect("/login");
  }
};

router.get("/", requireUser, (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
})

router.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const data = {
    username: username,
    password: password
  };

  try {
    const user = await User.create(data);
  } catch (e) {
    console.log(e);
  }
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.authenticate(email, password);
    if (user) {
      req.session.userId = user._id;
      return res.redirect("/");
    } else {
      res.render("/login", { error: "Wrong email or password. Try again!" });
    }
  } catch (e) {
    return next(e);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;
