const express = require("express");
const router = express.Router();
const zod = require('zod');
const { User } = require("../../db");
const JWT_SECRET = require("../../config");

const userValidation = (req, res, next) => {
  const userSchema = zod.object({
    username: zod.string(),
    password: zod.string()
  });

  const { success } = userSchema.safeParse(req.body);

  if (!success) {
    res.status(411).json({"message": "user inputs not valid"});
    return;
  }
  next();
}

router.post("/signin", userValidation, async (req, res) => {
  const body = req.body;
  const userFound = await User.findOne(body);

  if (!userFound) {
    res.status(411).json({
      'message': "Invalid credentials or not user!"
    })
    return;
  }

  const token = jwt.sign({userId: userFound._id}, JWT_SECRET);

  res.status(200).json({
    "role": "user",
    'message': "Logged in successfully",
    'token': token,
  })
})

const userAuth = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
    res.status(403).json({ 'message': 'Unauthorised' });
  }

  const token = bearerToken.split(' ')[1];

  try {
    const verify = jwt.verify(token, JWT_SECRET);
    console.log(verify);
    req.userId = verify.userId;
    next();
  } catch(e) {
    console.log("error", e);
    res.status(403).json({ 'message': 'Unauthorised' });
    return;
  }
}

router.get("/userdetails", userAuth, async (req, res) => {
  const userId = req.userId;
  const findUser = await User.findById(userId);

  if (!findUser) {
    res.status(411).json({
      'message': "Invalid token"
    })
    return;
  }

  res.status(200).json({
    "user": findUser,
  })
})

module.exports = router;