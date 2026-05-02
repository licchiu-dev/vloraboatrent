import type { Role } from '@prisma/client'
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    role: Role
    partnerId?: string
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      role: Role
      partnerId?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role
    partnerId?: string
  }
}
