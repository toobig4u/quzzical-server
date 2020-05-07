const express = require("express");
const Keys = require("../modals/key");
const routes = express.Router();

routes.post("/create/key", async (req, res) => {
  try {
    const key = await Keys(req.body).save();

    res.send({ success: true, key });
  } catch (e) {
    res.send({ success: false });
  }
});

routes.post("/get/key", async (req, res) => {
  try {
    const key = await Keys.findOne({});
    res.send({ key, success: true });
  } catch (e) {
    res.send({ success: false });
  }
});

routes.patch("/update/key", async (req, res, next) => {
  const changedKey = req.body;
  const fieldsToUpdate = Object.keys(changedKey);
  const fieldsInModel = ["key"];
  const isUpdateAllowed = fieldsToUpdate.every(field =>
    fieldsInModel.includes(field)
  );
  if (!isUpdateAllowed) {
    return res.send({ error: "Invalid fields!" });
  }
  try {
    const key = await Keys.findOne({});

    if (!key) {
      res.send({ success: false });
    }
    Object.assign(key, changedKey);
    await key.save();
    res.send({ key, success: true });
  } catch (e) {
    res.send({ e, success: false });
  }
});
routes.post("/key/oldKey", async (req, res) => {
  try {
    const key = await Keys.findByCredentials(req.body.key);
    res.send({ key, success: true });
  } catch (e) {
    res.send({ e, success: false, error: "Error" });
  }
});
module.exports = routes;
