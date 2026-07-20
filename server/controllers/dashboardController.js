const Application = require("../models/Application");
const Resume = require("../models/Resume");
const Job = require("../models/Job");
const getDashboard = async (req,res)=>{

try{

const userId=req.user.id;

const totalResumes=await Resume.countDocuments({
user:userId
});

const totalJobs=await Job.countDocuments({
user:userId
});

const totalApplications=await Application.countDocuments({
user:userId
});

const interviews=await Application.countDocuments({
user:userId,
status:"Interview Scheduled"
});

const offers=await Application.countDocuments({
user:userId,
status:"Offer"
});

const rejected=await Application.countDocuments({
user:userId,
status:"Rejected"
});

res.status(200).json({
success:true,
dashboard:{
totalResumes,
totalJobs,
totalApplications,
interviews,
offers,
rejected
}
});

}
catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Internal Server Error"
})

}

}
const getRecentApplications=async(req,res)=>{

try{

const applications=await Application.find({
user:req.user.id
})
.populate("job")
.sort({
createdAt:-1
})
.limit(5);

res.status(200).json({
success:true,
applications,
data:applications
})

}
catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Internal Server Error"
})

}

}
module.exports={
getDashboard,
getRecentApplications
}