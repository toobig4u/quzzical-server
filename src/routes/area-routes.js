const express = require("express");
const Area = require("../modals/area");
const routes = express.Router();
const auth = require("../middleware/auth");

//Create new Area
routes.post("/create/area", auth, async (req, res) => {
  try {
    const area = await Area(req.body).save();

    res.status(200).send({ success: true, area });
  } catch (e) {
    res.status(400).send({ success: false });
  }
});

//Get Area list
routes.get("/get/area", auth, async (req, res) => {
  try {
    const area = await Area.find({});

    if (!area) {
      return res.status(404).send({ error: "No Record Found", success: false });
    }
    res.status(200).send({ area, success: true });
  } catch (e) {
    res.status(400).send({ e, success: false });
  }
});

//Update Area
routes.patch("/update/area", auth, async (req, res, next) => {
  const changedArea = req.body;
  const fieldsToUpdate = Object.keys(changedArea);
  const fieldsInModel = ["area"];
  const isUpdateAllowed = fieldsToUpdate.every(field =>
    fieldsInModel.includes(field)
  );
  if (!isUpdateAllowed) {
    return res.status(404).send({ error: "Invalid fields!" });
  }
  try {
    const area = await Area.findOne({ _id: req.query.id });
    Object.assign(area, changedArea);
    await area.save();
    res.status(200).send({ area, success: true });
  } catch (e) {
    res.status(400).send({ e, success: false });
  }
});

//Update Area
routes.delete("/delete/area", auth, async (req, res) => {
  try {
    const area = await Area.findOneAndDelete({ _id: req.query.id });

    if (!area) {
      res.status(404).send({ error: "Question not found" });
      return;
    }

    res.status(200).send({ area, success: true });
  } catch (e) {
    res.status(400).send({ e, success: false });
  }
});

module.exports = routes;
