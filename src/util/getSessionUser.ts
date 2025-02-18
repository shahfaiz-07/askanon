import { auth } from "@/auth";
import { User } from "next-auth";

export async function getSessionUser(): Promise<User | null> {
    const session = await auth();

    const user: User = session?.user;

    if (!session || !session.user) {
        return null;
    }

    return user;
}