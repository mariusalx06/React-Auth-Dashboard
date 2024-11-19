import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import database from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          const res = await database.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
          );
          const user = res.rows[0];

          if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
              return { id: user.id, email: user.email, name: user.name };
            }
          }
          return null;
        } catch (error) {
          console.error("Error authenticating user:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 * 60 * 60 = 1day
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;

        const userFromDb = await database.query(
          "SELECT * FROM users WHERE email = $1",
          [user.email]
        );

        const existingUser = userFromDb.rows[0];
        if (existingUser) {
          token.agentid = existingUser.agentid;
        }
        token.provider = account?.provider;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.provider = token.provider;
      session.user.agentid = token.agentid;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
