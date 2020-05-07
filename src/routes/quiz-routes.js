const express = require("express");
const Quiz = require("../modals/quiz");
const routes = express.Router();
const auth = require("../middleware/auth");

//Create new Quiz
routes.post("/create/quiz", auth, async (req, res) => {
  try {
    const quiz = await Quiz(req.body).save();

    res.status(200).send({ success: true, quiz });
  } catch (e) {
    res.status(400).send({ success: false });
  }
});

//Get Quiz list
routes.get("/get/quiz", auth, async (req, res) => {
  try {
    const quiz = await Quiz.find({});

    if (!quiz) {
      return res.status(404).send({ error: "No Record Found", success: false });
    }
    res.status(200).send({ quiz, success: true });
  } catch (e) {
    res.status(400).send({ e, success: false });
  }
});

//Search Quiz list
routes.get("/search/quiz", auth, async (req, res) => {
  try {
    const { numbers, area, region, difficulty } = req.query;
    const quiz = await Quiz.find({ area, region, difficulty }).limit(
      parseInt(numbers)
    );

    if (!quiz) {
      return res.status(404).send({ error: "No Record Found", success: false });
    }
    res.status(200).send({ quiz, success: true });
  } catch (e) {
    res.status(400).send({ e, success: false });
  }
});

//Update Quiz
routes.patch("/update/quiz", auth, async (req, res, next) => {
  const changedQuiz = req.body;
  const fieldsToUpdate = Object.keys(changedQuiz);
  const fieldsInModel = ["question", "answers", "region", "area", "difficulty"];
  const isUpdateAllowed = fieldsToUpdate.every(field =>
    fieldsInModel.includes(field)
  );
  if (!isUpdateAllowed) {
    return res.status(404).send({ error: "Invalid fields!" });
  }
  try {
    const quiz = await Quiz.findOne({ _id: req.query.id });
    Object.assign(quiz, changedQuiz);
    await quiz.save();
    res.status(200).send({ quiz, success: true });
  } catch (e) {
    res.status(400).send({ e, success: false });
  }
});

//Update Quiz
routes.delete("/delete/quiz", auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ _id: req.query.id });

    if (!quiz) {
      res.status(404).send({ error: "Question not found" });
      return;
    }

    res.status(200).send({ quiz, success: true });
  } catch (e) {
    res.status(400).send({ e, success: false });
  }
});

module.exports = routes;
