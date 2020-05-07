const mongoose = require("mongoose");

const areaSchema = mongoose.Schema(
  {
    area: {
      type: String,
      unique: true
    }
  },
  { toObject: { virtuals: true }, timestamps: true }
);

const Area = mongoose.model("Area", areaSchema);

module.exports = Area;
