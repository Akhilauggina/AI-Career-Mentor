const User = require("../models/User");

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


const updateProfile = async (req, res) => {
    try{
        const {name,skills,education,carrerGoal}=req.body;
        const updatedUser=await User.findByIdAndUpdate(req.user.id,{
            name,
            skills,
            education,
            carrerGoal
        },{new:true}).select("-password");
        if(!updatedUser){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};








module.exports = {
    getProfile,updateProfile
};