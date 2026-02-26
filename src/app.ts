import express, { Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { categoryRoute } from "./modules/category/category.route.js";
import { productRoute } from "./modules/product/product.route.js";
import { auth } from "./lib/auth.js";
import { orderRoutes } from "./modules/order/order.route.js";
import { userRoutes } from "./modules/user/user.route.js";

const app = express();


// app.use(cors({
//     origin: process.env.APP_URL || "http://localhost:3000",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
// }));

// ==================== CORS CONFIGURATION ====================
// CRITICAL: Controls which frontend domains can access this backend
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        const allowedOrigins: string[] = [];

        // Development
        allowedOrigins.push("http://localhost:3000");

        // Production - from environment variables
        if (process.env.APP_URL && process.env.APP_URL !== "http://localhost:3000") {
            allowedOrigins.push(process.env.APP_URL);
        }
        if (process.env.FRONTEND_URL && process.env.FRONTEND_URL !== "http://localhost:3000") {
            allowedOrigins.push(process.env.FRONTEND_URL);
        }

        // Explicit production domains
        allowedOrigins.push("https://roonani-fontend.vercel.app");
        allowedOrigins.push("https://roonani-fontend-3p9qjout7-md-mahin-projects.vercel.app");

        // Remove duplicates
        const uniqueOrigins = [...new Set(allowedOrigins)];
        console.log("[CORS] Allowed:", uniqueOrigins);
        console.log("[CORS] Request from:", origin || "(no-origin)");

        if (!origin || uniqueOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`[CORS] BLOCKED: ${origin}`);
            callback(new Error("CORS: Origin not allowed"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
};

app.use(cors(corsOptions));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.all("/api/auth/*splat", toNodeHandler(auth));


app.get("/", (request: Request, respons: Response) => {
    respons.send("Hello world");
});


app.use("/api/category", categoryRoute);

app.use("/api/product", productRoute);

app.use("/api/order", orderRoutes);

app.use("/api/user", userRoutes);


export default app;




