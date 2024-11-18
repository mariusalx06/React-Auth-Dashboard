import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import database from '@/lib/db';

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          const res = await database.query('SELECT * FROM users WHERE email = $1', [email]);
          const user = res.rows[0];

          if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
              return { id: user.id, email: user.email, name: user.name };
            }
          }
          return null;
        } catch (error) {
          console.error('Error authenticating user:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60,  // 60 seconds session duration
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
  
        if (account?.provider === 'github') {
          const { email, name } = user;
          const existingUser = await database.query('SELECT * FROM users WHERE email = $1', [email]);
  
          if (existingUser.rowCount === 0) {
            await database.query(
              'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
              [email, 'Github', name]
            );
          }
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
  
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };