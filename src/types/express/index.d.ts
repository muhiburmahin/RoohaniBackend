import { User } from "../../generated/prisma/client.js";
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: string;
                emailVerified: boolean;
            };
        }
    }
}