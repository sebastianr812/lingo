import { auth } from "@clerk/nextjs";

const allowedAdminIds = [
    "user_2fBuBC6cmIxddOynsN7nqkjv303",
];

export function isAdmin() {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    return allowedAdminIds.indexOf(userId) !== -1;
}

