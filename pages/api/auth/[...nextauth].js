import NextAuth from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

import GoogleProvider from "next-auth/providers/google"

// const adminEmails = ["lumin.geng@gmail.com"]
//const adminEmails = ["genglmgm@gmail.com"]

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_FRONT_ID,
      clientSecret: process.env.GOOGLE_FRONT_SECRET,
    }),
  ],
  //MonogDb adapter
  adapter: MongoDBAdapter(clientPromise),
//   callbacks: {
//     session: ({ session, token, user }) => {
//       console.log(session)
//       if (adminEmails.includes(session?.user?.email)) {
//         return session
//       } else {
//         return false
//       }
//     },
//   },
}

export default NextAuth(authOptions)

// export async function isAdminRequest(req, res) {
//   const session = await getServerSession(req, res, authOptions)
//   console.log(session)
//   if (!adminEmails.includes(session?.user?.email)) {
//     res.status(401)
//     res.end()
//     throw "not an admin"
//   }
// }
