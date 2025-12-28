import jwt from "jsonwebtoken";

// Middleware to verify admin JWT token
export const verifyAdminToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.admin = decoded;
            next();
        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid or expired token"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export default verifyAdminToken;
