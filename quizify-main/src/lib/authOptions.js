import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/user.model";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
        accountType: { label: "Account Type", type: "radio", options: ["student", "admin"] },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.accountType) {
          return null;
        }

        try {
          await connectDB();

          // Find the user in the database
          const user = await UserModel.findOne({ email: credentials.email });

          // If user doesn't exist or password doesn't match
          if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            return null;
          }

          // Check if account type matches (if specified)
          if (credentials.accountType && user.accountType !== credentials.accountType) {
            return null;
          }

          // Return the user object without the password
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            accountType: user.accountType,
          };
        } catch (error) {
          console.error("Error authorizing credentials:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign-in
      if (user) {
        token.id = user.id;
        token.accountType = user.accountType || 'student'; // Default to student if not specified
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.accountType = token.accountType;
      }
      return session;
    },
    async signIn({ user, account, profile }) {      
      try {
        await connectDB();
        
        // For GitHub OAuth sign-in
        if (account?.provider === 'github') {
          const email = profile.email || user.email;
          
          // Check if user exists
          let dbUser = await UserModel.findOne({ email });
          
          // If user doesn't exist, create a new one
          if (!dbUser) {
            dbUser = await UserModel.create({
              username: profile?.login,
              name: profile.name || user.name,
              email: email,
              image: profile.avatar_url || profile.picture || user.image,
              accountType: 'student', // Default for OAuth users
              provider: 'github',
            });
          }
          
          return true;
        }
        
        // For credentials sign-in, the authorize function already validates
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
};