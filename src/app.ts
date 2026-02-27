import express, { Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { categoryRoute } from "./modules/category/category.route.js";
import { productRoute } from "./modules/product/product.route.js";
import { auth } from "./lib/auth.js";
import { orderRoutes } from "./modules/order/order.route.js";
import { userRoutes } from "./modules/user/user.route.js";

const app = express();

// ==================== CORS CONFIGURATION ====================
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // নতুন এবং সঠিক ডোমেইনগুলো এখানে আপডেট করা হয়েছে
        const allowedOrigins: string[] = [
            "http://localhost:3000",
            "https://roohani-frontend.vercel.app", // সঠিক বানান
            "https://roohani-fontend.vercel.app",   // বর্তমান ডোমেইন অনুযায়ী
        ];

        // Environment variables থেকে আসা URL গুলো যুক্ত করা
        if (process.env.APP_URL) allowedOrigins.push(process.env.APP_URL);
        if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

        // ডুপ্লিকেট রিমুভ করা
        const uniqueOrigins = [...new Set(allowedOrigins)];

        if (!origin || uniqueOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`[CORS] BLOCKED: ${origin}`);
            callback(new Error("CORS: Origin not allowed"));
        }
    },
    credentials: true, // কুকি আদান-প্রদানের জন্য এটি মাস্ট
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With", "Accept"],
    exposedHeaders: ["Set-Cookie"]
};

app.use(cors(corsOptions));

// Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Better Auth Handler
app.all("/api/auth/*splat", toNodeHandler(auth));

// Health Check
app.get("/", (request: Request, response: Response) => {
    response.send("Roohani Backend is Running...");
});

// API Routes
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoutes);
app.use("/api/user", userRoutes);

export default app;