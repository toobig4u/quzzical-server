const express = require("express");
const app = express();
const profileRoutes = require("./src/routes/profile-routes");
const quizRoutes = require("./src/routes/quiz-routes");
const areaRoutes = require("./src/routes/area-routes");
const keyRoutes = require("./src/routes/key-routes");
require("./src/db/mongoose");

app.use(express.json());
app.use(profileRoutes);
app.use(quizRoutes);
app.use(areaRoutes);
app.use(keyRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`API listening on port ${port}...`);
});
