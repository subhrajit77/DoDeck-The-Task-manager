import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export default async function authMiddleware(req, res, resizeBy, next) {
    //grab the bearer token from the authorization header

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized. Token missing" });
    }

    const token = authHeader.split("")[1];

    //verify and attach the user object

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findbyId(payload.id).select("-password");
        if (!user) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Unauthorized. User not found",
                });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("JWT Verification failed", err);
        return res
            .status(401)
            .json({ success: false, message: "Token is invalid or expired" });
    }
}
