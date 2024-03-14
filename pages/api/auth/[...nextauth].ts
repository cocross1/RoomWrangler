import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {label: 'email', type: 'text'},
                password: {label: 'password', type: 'password'},
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials 1');
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });
                //Probably going to have to come back here 
                //with google and duo authentication
                //integration
                if (!user || !user?.hashedPassword) {
                    throw new Error('Invalid credentials 2');
                }
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password, user.hashedPassword
                );
                if(!isCorrectPassword) {
                    throw new Error('Invalid credentials 3');
                }
                return user;
            }
        })
    ],
    callbacks: {
        async signIn({ user, email }) {
            let userEmail = "";
      
            // Ensure userEmail is a string before calling endsWith
            if (typeof email === 'string') {
              userEmail = email;
            } else if (typeof user.email === 'string') {
              userEmail = user.email;
            }

            const allowedDomain = "@davidson.edu";
            
            if (userEmail && !userEmail.endsWith(allowedDomain)) {
              // Handle rejection here
              return false; // Prevents the sign-in
            }
      
            return true; // Proceed with the sign-in
      }},
    pages: {
        signIn: '/',
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
