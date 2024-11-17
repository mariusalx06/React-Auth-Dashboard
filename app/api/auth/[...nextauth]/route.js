import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import client from '@/lib/db';  // Import the direct database client

export const authOptions = {
  providers: [
    // GitHub Provider for OAuth (GitHub login)
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),

    // Credentials Provider for manual login (using email and password)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          // Query the database to find the user by email
          const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
          const user = res.rows[0];

          if (user) {
            // Compare password (hashed) with the provided password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
              // Return the user object if credentials are valid
              return { id: user.id, email: user.email, name: user.name };
            }
          }

          // Return null if authentication fails
          return null;
        } catch (error) {
          console.error('Error authenticating user:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',  // Custom sign-in page
  },
  session: {
    strategy: 'jwt',  // Use JWT for session management
    maxAge: 60,  // Set session max age to 1 minute (60 seconds)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
