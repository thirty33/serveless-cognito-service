
export interface UserToCreate {
    name?: string;
    username?: string;
    temporaryPassword?: string;
    nickname?: string;
    email?: string;
}

export interface logInObject {
    email: string;
    password: string;
}