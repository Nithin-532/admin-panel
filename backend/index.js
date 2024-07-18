const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const adminRouter = require("./routes/Admin/adminRouter");
const userRouter = require("./routes/User/userRouter");
const port = process.env.PORT || 3000;

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.listen(port);