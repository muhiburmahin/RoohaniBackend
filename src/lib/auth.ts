import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const buildTrustedOrigins = (): string[] => {
    const origins: string[] = [];

    origins.push("http://localhost:3000");

    if (process.env.FRONTEND_URL) origins.push(process.env.FRONTEND_URL);
    if (process.env.APP_URL) origins.push(process.env.APP_URL);

    origins.push("https://roohani-fontend.vercel.app");

    // Wildcard for Vercel preview deployments
    origins.push("https://*.vercel.app");

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

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 24 hours
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 * 1000,
        },
    },

    advanced: {
        disableCSRFCheck: true,
        cookieOptions: {
            sameSite: "none",
            secure: true,
            httpOnly: true,
        },
        crossSubDomainCookies: {
            enabled: false,
        }
    },

    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: false,
    },

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