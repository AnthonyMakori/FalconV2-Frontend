import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Make sure we're using the correct handler
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
