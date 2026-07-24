import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const inputEmail = (credentials.email as string)?.trim().toLowerCase();
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        if (!inputEmail || inputEmail !== adminEmail) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          process.env.ADMIN_PASSWORD_HASH as string
        );
        if (!valid) return null;

        return {
          id: "admin",
          email: process.env.ADMIN_EMAIL,
          name: "John Edeh",
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
});
