const express=require("express");

const router=express.Router();

const authMiddleware=require("../middleware/authMiddleware");

const{
getDashboard,
getRecentApplications
}=require("../controllers/dashboardController");

router.get("/",authMiddleware,getDashboard);

router.get("/recent",authMiddleware,getRecentApplications);

module.exports=router;