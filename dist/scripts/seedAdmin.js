// src/scripts/seedAdmin.ts
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "better-auth/crypto";
async function seedAdmin() {
    const adminPhone = "01712000000";
    const shadowEmail = `${adminPhone}@roohani.local`;
    //await prisma.user.deleteMany({ where: { email: shadowEmail } });
    const hashedPassword = await hashPassword("admin12345");
    await prisma.user.create({
        data: {
            name: "Roohani Admin",
            email: shadowEmail,
            phone: adminPhone,
            username: adminPhone,
            role: "ADMIN",
            emailVerified: true,
            accounts: {
                create: [{
                        id: crypto.randomUUID(),
                        providerId: "credential",
                        accountId: shadowEmail,
                        password: hashedPassword,
                    }]
            }
        }
    });
    console.log("✅ Admin seeded as ADMIN with Shadow Email!");
}
seedAdmin();
// import { prisma } from "../lib/prisma.js";
// async function seedAdmin() {
//     try {
//         const phone = "01713000000";
//         const password = "adminroohanibd";
//         const shadowEmail = `${phone}@roohani.local`;
//         const adminData = {
//             name: "Roohani Admin",
//             email: shadowEmail,
//             phone: phone,
//             username: phone,
//             role: "ADMIN",
//             password: password
//         };
//         // ডাটাবেস থেকে পুরনো ভুল ডেটা মুছে ফেলা (যাতে ফ্রেশ এন্ট্রি হয়)
//         await prisma.user.deleteMany({
//             where: { email: shadowEmail }
//         });
//         console.log("🧹 Previous admin data cleared.");
//         console.log("🚀 Sending request to Better Auth Sign-up API...");
//         // হেডার সেকশনে অবশ্যই 'origin' যোগ করতে হবে
//         const response = await fetch("http://localhost:5000/api/auth/sign-up/email", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "origin": "http://localhost:3000" // এই লাইনটি যোগ করুন
//             },
//             body: JSON.stringify(adminData)
//         });
//         const result = await response.json();
//         if (response.ok) {
//             console.log("✅ Admin created successfully:", result);
//         } else {
//             console.error("❌ API Error:", result);
//         }
//     } catch (error) {
//         console.error("❌ Error:", error);
//     } finally {
//         await prisma.$disconnect();
//     }
// }
// seedAdmin();
