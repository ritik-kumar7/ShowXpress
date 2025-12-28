import User from "../models/UserModels.js";

// import userModels from "../models/userModels";

// Create or update user
const createUser = async (req, res) => {
    try {
        const { clerkId, name, email, image } = req.body;

        let user = await User.findOne({ clerkId });

        if (user) {
            // Update existing user
            user.name = name;
            user.email = email;
            user.image = image;
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                clerkId,
                name,
                email,
                image
            });
        }

        return res.status(200).json({
            success: true,
            message: "User created/updated successfully",
            data: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get user by clerk ID
const getUserByClerkId = async (req, res) => {
    try {
        const { clerkId } = req.params;
        const user = await User.findOne({ clerkId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export { createUser, getUserByClerkId };