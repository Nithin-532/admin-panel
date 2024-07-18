const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const adminRouter = require("./routes/Admin/adminRouter");
const userRouter = require("./routes/User/userRouter");
const port = 3000;

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.listen(port, () => {
  console.log(`App is listening on PORT `, port);
});