const express = require("express");
const Profiles = require("../modals/profiles");
const routes = express.Router();
const auth = require("../middleware/auth");

//Create new Profile
routes.post("/create/profiles", async (req, res) => {
  try {
    const profile = await Profiles(req.body).save();

    const token = await profile.generateAuthToken();

    res.status(200).send({ success: true, profile, token });
  } catch (e) {
    res.status(400).send({ success: false });
  }
});

//Get Profiles list
routes.post("/get/profiles", auth, async (req, res) => {
  try {
    const profiles = await Profiles.find({});

    if (!profiles) {
      return res.status(404).send({ error: "No Record Found", success: false });
    }
    res.status(200).send({ profiles, success: true });
  } catch (e) {
    res.status(400).send({ e, success: false });
  }
});

//Update Profile
routes.patch("/update/profiles", auth, async (req, res, next) => {
  const changedProfile = req.body;
  const fieldsToUpdate = Object.keys(changedProfile);
  const fieldsInModel = ["name", "email", "password"];
  const isUpdateAllowed = fieldsToUpdate.every(field =>
    fieldsInModel.includes(field)
  );
  if (!isUpdateAllowed) {
    return res.status(404).send({ error: "Invalid fields!" });
  }
  try {
    const profile = req.profile;
    Object.assign(profile, changedProfile);
    await profile.save();
    res.status(200).send({ profile, success: true });
  } catch (e) {
    res.status(400).send({ e, success: false });
  }
});

//Checking old password
routes.post("/profiles/myprofile/checkOldPass", auth, async (req, res) => {
  try {
    const profile = await Profiles.findByCredentials(
      req.body.email,
      req.body.password
    );

    res.status(200).send({ profile, success: true });
  } catch (e) {
    res.status(400).send({ e, success: false });
  }
});

//Login to account
routes.post("/profiles/login", async (req, res) => {
  try {
    const profile = await Profiles.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await profile.generateAuthToken();
    res.status(200).send({ profile, token, success: true });
  } catch (e) {
    res.status(400).send({ e, success: false });
  }
});

//Logout from account
routes.post("/profiles/logout", auth, async (req, res) => {
  try {
    const { profile, token } = req;
    profile.tokens = profile.tokens.filter(t => t.token !== token);
    await profile.save();
    res.status(200).send({ profile, success: true });
  } catch (e) {
    res.status(400).send({ e, success: false });
  }
});

//Authenticate user
routes.post("/profiles/authenticate", auth, async (req, res) => {
  try {
    res.status(200).send({ profile: req.profile, success: true });
  } catch (e) {
    res.status(400).send({ success: false, e });
  }
});

module.exports = routes;
