import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const isProd = process.env.NODE_ENV === "production";

export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
export const SESSION_COOKIE_NAME = isProd
  ? "__Secure-authjs.session-token"
  : "authjs.session-token";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE },
  cookies: {
    sessionToken: {
      name: SESSION_COOKIE_NAME,
      options: {
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
        path: "/",
      },
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!passwordMatch) return null;

        if (!user.emailVerified) {
          throw new Error("EmailNotVerified");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
});