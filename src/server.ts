import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const port = process.env.PORT || 5000;

async function main() {
    try {
        await prisma.$connect();
        console.log("Prisma connected successfully");

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}

main();

