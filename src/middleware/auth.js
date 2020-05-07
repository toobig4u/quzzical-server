const jwt = require("jsonwebtoken");
const Profile = require("../modals/profiles");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

    const profile = await Profile.findOne({
      _id: decoded_token._id,
      "tokens.token": token
    });
    if (!profile) {
      throw new Error();
    }
    req.token = token;
    req.profile = profile;

    next();
  } catch (e) {
    res.send({ error: "Please login first" });
  }
};
module.exports = auth;
