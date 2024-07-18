const express = require('express');
const router = express.Router();
const zod = require('zod');
const { Admin, User } = require('../../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../../config');

function  inputValidation(req, res, next) {
  const body = req.body;

  const adminSchema = zod.object({
    username: zod.string(),
    password: zod.string()
  })

  const { success } = adminSchema.safeParse(body);

  if (success) {
    next();
    return;
  }

  res.status(500).json({ "Message": 'Invalid object literals' });
  return;
}

router.post("/signup", inputValidation, async (req, res) => {
  const body = req.body;

  const adminFound = await Admin.findOne({
    username: body.username,
    password: body.password
  });

  if (adminFound) {
    res.status(411).json({
      'message': "User already found please login"
    })
    return;
  }

  const newAdmin = await Admin.create(body);

  const token = jwt.sign({ adminId: newAdmin._id }, JWT_SECRET);

  res.status(200).json({
    'role': "admin",
    'message': "Signed Up successfully",
    'token': token,
  })
})

router.post("/signin", inputValidation, async (req, res) => {
  const body = req.body;

  const adminFound = await Admin.findOne({
    username: body.username,
    password: body.password
  });

  if (!adminFound) {
    res.status(411).json({
      'message': "Invalid credentials or not admin!"
    })
    return;
  }

  const token = jwt.sign({ adminId: adminFound._id }, JWT_SECRET);

  res.status(200).json({
    'role': "admin",
    'message': "Logged in successfully",
    'token': token,
  })
})

function adminAuthCheck(req, res, next) {
  const bearerToken = req.headers.authorization;
  if (!bearerToken || !bearerToken.startsWith('Bearer')) {
    res.status(403).json({ 'message': 'Unauthorised' });
  }

  const token = bearerToken.split(' ')[1];

  try {
    const verify = jwt.verify(token, JWT_SECRET);
    console.log(verify);
    req.adminId = verify.adminId;
    next();
  } catch(e) {
    console.log("error", e);
    res.status(403).json({ 'message': 'Unauthorised' });
    return;
  }
}

router.get("/dashboard", adminAuthCheck, async (req, res) => {
  const id = req.adminId;

  const users = await Admin.findById(id).populate('users');
  console.log(users);
  res.status(200).json({ "data": users });
})

function userInputValidation(req, res, next) {
  const body = req.body;

  const userSchema = zod.object({
    firstname: zod.string(),
    lastname: zod.string(),
    username: zod.string(),
    password: zod.string(),
    email: zod.string().email(),
    location: zod.string(),
    designation: zod.string(),
    serialNumber: zod.string()
  })

  const { success } = userSchema.safeParse(body);

  if (!success) {
    res.status(500).json({ "Message": 'Invalid object literals' });
    return;
  }

  next();
}

router.post("/createuser", userInputValidation, adminAuthCheck, async (req, res) => {
  const id = req.adminId;
  const body = req.body;

  const foundUser = await User.findOne({ serialNumber: body.serialNumber });

  if (foundUser) {
    res.status(403).json({ "message": "User already present" });
    return;
  }

  console.log(id);

  try {
    const newUser = await User.create(body);
    const admin = await Admin.findByIdAndUpdate(id, { $push: { users: newUser._id }});
    res.status(200).json({ "message": "Created user successfully" });
  } catch(e) {
    console.log(e);
    res.status(500).json({ "message": e.message });
  }
})

function userInputOptionalValidation(req, res, next) {
  const body = req.body;

  const userSchema = zod.object({
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
    username: zod.string().optional(),
    password: zod.string().optional(),
    email: zod.string().email().optional(),
    location: zod.string().optional(),
    designation: zod.string().optional(),
    serialNumber: zod.string().optional()
  })

  const { success } = userSchema.safeParse(body);

  if (!success) {
    res.status(500).json({ "Message": 'Invalid object literals' });
    return;
  }

  next();
}

router.post("/edituser", userInputOptionalValidation, adminAuthCheck, async (req, res) => {
  const adminId = req.adminId;
  const body = req.body;

  try {
    const foundUser = await User.findOne({ serialNumber: body.serialNumber });
    
    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const admin = await Admin.findById(adminId).populate('users');
    
    if (!admin.users.some(user => user._id.equals(foundUser._id))) {
      return res.status(403).json({ error: "Unauthorized: User does not belong to this admin" });
    }

    await User.updateOne({ _id: foundUser._id }, body);

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/deleteuser", userInputOptionalValidation, adminAuthCheck, async (req, res) => {
  const adminId = req.adminId;
  const body = req.body;

  try {
    const foundUser = await User.findOne({ email: body.email, password: body.password });

    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const admin = await Admin.findById(adminId).populate('users');
    
    if (!admin.users.some(user => user._id.equals(foundUser._id))) {
      return res.status(403).json({ error: "Unauthorized: User does not belong to this admin" });
    }

    await Admin.updateOne({ _id: adminId }, {
      $pull: {
        users: [{ _id: foundUser._id }]
      }
    })

    const deleteUser = await User.deleteOne({ _id: foundUser._id });

    res.status(200).json({ message: "User deleted Successfully", data: deleteUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;