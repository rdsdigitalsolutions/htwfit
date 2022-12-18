import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";

import { findOne } from '../../../repository/user'

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
                return {
                    // Return all the profile information you need.
                    // The only truly required field is `id`
                    // to be able identify the account when added to a database
                }
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log('credentials:', credentials)

                if (!credentials.username || !credentials.password) {
                    return null;
                }

                const user = await findOne( { email: credentials.username, password: credentials.password } );
                return user ? { ...user, id: user._id } : null;
            }
        })
    ],
    callbacks: {
        // Use this to map properties to the current session.
        async session({ session, token }) {
            session.user.id = token.sub
            return session
        },
    }
}
export default NextAuth(authOptions)
