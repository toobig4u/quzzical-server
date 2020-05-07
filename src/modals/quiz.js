const mongoose = require("mongoose");

const quizSchema = mongoose.Schema(
  {
    question: {
      type: String
    },
    answers: [
      {
        type: String
      }
    ],
    region: {
      type: String
    },
    difficulty: {
      type: String
    },
    area: {
      type: String
    }
  },
  { toObject: { virtuals: true }, timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
