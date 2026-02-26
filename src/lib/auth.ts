import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

// Build trusted origins list - these are the origins that can access this auth server
// CRITICAL: If you don't add your frontend origin here, you'll get INVALID_ORIGIN errors
const buildTrustedOrigins = (): string[] => {
    const origins: string[] = [];

    // Always allow localhost for development
    origins.push("http://localhost:3000");

    // Add production frontend URL from env  
    if (process.env.FRONTEND_URL && process.env.FRONTEND_URL !== "http://localhost:3000") {
        origins.push(process.env.FRONTEND_URL);
    }

    // Add alternative production URL from env
    if (process.env.APP_URL && process.env.APP_URL !== "http://localhost:3000" && process.env.APP_URL !== process.env.FRONTEND_URL) {
        origins.push(process.env.APP_URL);
    }

    // Always add explicit Vercel domains (both old and new)
    origins.push("https://roonani-fontend.vercel.app");
    origins.push("https://roonani-fontend-3p9qjout7-md-mahin-projects.vercel.app");
    
    // Add wildcard for Vercel deployments to handle auto-generated URLs
    origins.push("https://*.vercel.app");

    // Remove duplicates and log for debugging
    const uniqueOrigins = [...new Set(origins)];
    console.log("[Better Auth] Configured Trusted Origins:", uniqueOrigins);

    return uniqueOrigins;
};

const trustedOrigins = buildTrustedOrigins();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    plugins: [],

    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: false,
    },

    beforeSessionCreate: async ({ session, user }: { session: any, user: any }) => {
        return { session, user };
    },

    // CRITICAL: Requests must come from one of these origins
    trustedOrigins: trustedOrigins,

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "CUSTOMER",
                required: false,
                input: false
            },
            phone: {
                type: "string",
                required: true
            },
            username: {
                type: "string",
                required: true
            }
        },
    },
});