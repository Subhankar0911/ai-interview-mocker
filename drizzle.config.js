/**@type {import("drizzle-kit").Config} */
export default {
    schema: "./utils/schema.js",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgresql://neondb_owner:npg_8uGO9HpgATdt@ep-cold-bush-a4jly718-pooler.us-east-1.aws.neon.tech/Ai-interviewer?sslmode=require"
    }
};