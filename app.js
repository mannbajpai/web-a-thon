//jshint esversion:6
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import googleStrategy from "passport-google-oauth20";
import findOrCreate from "mongoose-findorcreate";

import User from "./models/users.js";
import Event from "./models/events.js";



const GoogleStrategy = googleStrategy.Strategy;
const app = express();
app.use(express.static("js"));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "My small Secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());



mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://user1:123@web-a-thon-rgipt.lynszij.mongodb.net/usersDB", {
  useNewUrlParser: true
});


passport.use(User.createStrategy());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/event",
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOrCreate({ googleId: profile.id, name: profile.name.givenName }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);


passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/event",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/event");
  }
);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/eventSubmit", (req, res) => {
  User.find( (err, foundUsers) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("eventSubmit");
        
      }
    }
  });
});

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.get("/event", (req, res) => {
  User.find({ events: { $ne: null } }, (err, foundUsers) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("event", {usersWithEvents: foundUsers, joinTeam : (foundUsers)=>{
            foundUsers.map((user)=>{
              console.log(user);
            })
        }});
      }
    }
  });
});

app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username,
    name: req.body.name },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/event");
        });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/event");
      });
    }
  });
});

app.post("/eventSubmit", (req, res) => {
  User.findById(req.user.id, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        const event = new Event({
          userCreated: req.user.name,
          name: req.body.name,
          description: req.body.name,
          teamName: req.body.teamName,
          applyDate: req.body.lastDate,
          eventDate: req.body.date,
          venue: req.body.venue,
          eventWebsite: req.body.website,
          noOfUserRequired: req.body.partipicantsReq,
          noOfUserIn: req.body.participantsinTeam,
          eventTeamComplete: false,
        });
        event.save();
        foundUser.events.push(event);
        foundUser.save(() => {
          res.redirect("/event");
        });
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server Running on Port 3000");
});
