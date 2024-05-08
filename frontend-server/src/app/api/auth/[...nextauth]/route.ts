// import type { NextApiRequest, NextApiResponse } from 'next'

// export async function GET() {
 
//   return Response.json({ data : "test" })
// }


import NextAuth from 'next-auth';
import { authOptions } from '@/libs/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
