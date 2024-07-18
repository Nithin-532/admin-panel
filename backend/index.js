const express = require("express");
const app = express();
const cors = require("cors");
const adminRouter = require("./routes/Admin/adminRouter");
const userRouter = require("./routes/User/userRouter");

app.use(cors());
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.listen(3000);