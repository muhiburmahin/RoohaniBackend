import { auth as betterAuth } from "../lib/auth.js";
export const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers,
            });
            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized Access",
                });
            }
            if (roles.length > 0) {
                const userRole = session.user.role;
                if (!roles.includes(userRole)) {
                    return res.status(403).json({
                        success: false,
                        message: "Permission Denied: You don't have the required role",
                    });
                }
            }
            req.user = session.user;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
