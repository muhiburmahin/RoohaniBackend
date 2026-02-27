import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const buildTrustedOrigins = (): string[] => {
    const origins: string[] = [];

    origins.push("http://localhost:3000");

    if (process.env.FRONTEND_URL) origins.push(process.env.FRONTEND_URL);
    if (process.env.APP_URL) origins.push(process.env.APP_URL);

    origins.push("https://roohani-frontend.vercel.app");// আপনার বর্তমান Vercel ডোমেইন অনুযায়ী

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

    // cross-domain authentication এর জন্য এই অংশটি খুব জরুরি
    advanced: {
        disableCSRFCheck: true,
        crossSubDomainCookies: {
            enabled: false,
        }
    },

    cookie: {
        secure: true,
        sameSite: "none",
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