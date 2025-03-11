import {users} from "@/lib/appwrite.config";
import {ID, Query} from "node-appwrite";

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.name,
            undefined);
        console.log({newUser})

    } catch (e) {
        if (e && e?.code === 409) {
            const document = await users.list([Query.equal('email', user.email)])
            return document?.users[0];
        }
    }
}