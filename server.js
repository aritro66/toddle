const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const authRoute = require("./routes/authRoutes");
const journalRoute = require("./routes/journalRoutes");
const tagRoute = require("./routes/tagRoutes");
const fileRoute = require("./routes/fileRoutes");
const userRoute = require("./routes/userRoutes");
const ErrorMiddleware = require("./middlewares/error");
const PORT = process.env.PORT || 4001;
const User = require("./models/users");
const Journal = require("./models/journal");
const Tag = require("./models/taggedstudent");
const File = require("./models/file");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./api-docs/swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(ErrorMiddleware);
app.use("/api/v1/auth/", authRoute);
app.use("/api/v1/journal/", journalRoute);
app.use("/api/v1/tag/", tagRoute);
app.use("/api/v1/files/", fileRoute);
app.use("/api/v1/user/", userRoute);

[
  User.createTable(),
  Journal.createTable(),
  Tag.createTable(),
  File.createTable(),
].forEach(async (task) => {
  await task;
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
