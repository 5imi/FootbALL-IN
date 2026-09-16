import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email sau Nume Manager', type: 'text' },
        password: { label: 'Parolă', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Te rugăm să introduci email-ul/utilizatorul și parola.');
        }

        // Căutare după email sau username
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier.toLowerCase() },
              { username: credentials.identifier },
            ],
          },
          include: {
            teams: {
              include: {
                division: true,
              },
            },
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Contul nu există sau datele sunt incorecte.');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isPasswordValid) {
          throw new Error('Parola introdusă este incorectă.');
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id.toString(),
          name: user.name || user.username || 'Manager',
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }
      if (trigger === 'update' && session) {
        return { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        const userId = parseInt(token.id as string, 10);
        (session.user as any).id = userId;

        // Fetch current active team for the user
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            teams: {
              include: {
                division: true,
              },
            },
          },
        });

        if (dbUser) {
          (session.user as any).username = dbUser.username;
          (session.user as any).isBot = dbUser.isBot;
          (session.user as any).team = dbUser.teams[0] || null;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'soccermanager-super-secret-session-key-development',
};
