import { User } from "@prisma/client";

// again, note: if we ever include any types other than plain data types
// in our Room model, we need to make a SafeRoom & use it accordingly!!

export type SafeUser = Omit<
    User,
    "createdAt" | "updatedAt" | "emailVerified"
> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
}