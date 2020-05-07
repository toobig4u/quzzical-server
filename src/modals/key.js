const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const keySchema = mongoose.Schema({
  key: {
    type: String,
    require: true
  }
});

keySchema.methods.toJSON = function() {
  const key = this;
  const publicKeyData = key.toObject();
  delete publicKeyData.key;
  return publicKeyData;
};
keySchema.statics.findByCredentials = async key => {
  const pro = await Keys.findOne({});

  if (!key) {
    throw new Error("Unable to Find");
  }

  const isMatch = await bcrypt.compare(key, pro.key);

  if (!isMatch) {
    throw new Error("Unable to Find");
  }
  return pro;
};
keySchema.pre("save", async function(next) {
  try {
    const key = this;
    if (key.isModified("key")) key.key = await bcrypt.hash(key.key, 8);

    next();
  } catch (e) {
    console.log(e);
  }
});

const Keys = mongoose.model("Keys", keySchema);

module.exports = Keys;
