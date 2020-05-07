const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const profileSchema = mongoose.Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String,
      unique: true,
      lowercase: true
    },
    password: {
      type: String
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  { toObject: { virtuals: true }, timestamps: true }
);

profileSchema.statics.findByCredentials = async (email, password) => {
  const profile = await Profiles.findOne({ email });

  if (!profile) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, profile.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return profile;
};
profileSchema.statics.findByCredentialsEmail = async email => {
  const profile = await Profiles.findOne({ email });

  if (!profile) {
    throw new Error("Unable to login");
  }

  return profile;
};
profileSchema.methods.toJSON = function() {
  const profile = this;
  const publicProfileData = profile.toObject();
  delete publicProfileData.password;
  delete publicProfileData.tokens;
  return publicProfileData;
};

profileSchema.methods.generateAuthToken = async function() {
  const profile = this;

  const token = jwt.sign(
    { _id: profile._id.toString() },
    process.env.JWT_SECRET
  );

  profile.tokens = profile.tokens.concat({ token });
  await profile.save();
  return token;
};
profileSchema.pre("save", async function(next) {
  try {
    const profile = this;
    if (profile.isModified("password"))
      profile.password = await bcrypt.hash(profile.password, 8);

    next();
  } catch (e) {
    console.log(e);
  }
});

const Profiles = mongoose.model("Profiles", profileSchema);

module.exports = Profiles;
