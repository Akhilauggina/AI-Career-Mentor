const express=require('express');
const router=express.Router();
const {registerUser,loginUser}=require('../controllers/authController');
console.log(registerUser);
console.log(loginUser);
router.post('/register',registerUser);
router.post("/login",loginUser);
router.get("/test", (req, res) => {
    res.send("Auth Routes Working");
});
module.exports=router;