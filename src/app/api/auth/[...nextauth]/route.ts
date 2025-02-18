import NextAuth from "next-auth";
import authConfig from "@/config/auth.config";

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
