import { UserResponse, UserResponseDetailed } from "../responses/user-response";
import { Client } from "./Client";

export class User extends Client {
    firstName: string = '';
    lastName: string = '';
    taxPayerId: string = '';
    nickname: string = '';
    email: string = '';
    password: string = '';
    needPasswordChange: boolean = true;

    static fromResponse(response: UserResponseDetailed): User {
        let user = new User();
        user.id = response.id;
        user.firstName = response.firstName;
        user.lastName = response.lastName;
        user.nickname = response.nickname;
        user.email = response.email;
        user.taxPayerId = response.taxPayerId;
        user.createdAt = response.createdAt;
        user.type = response.type;
        user.permissions = response.permissions;
        user.status = response.status;
        user.groups = response.groups;
        user.lastOnline = response.lastOnline;
        user.accessLevel = response.accessLevel;
        user.scanRadius = response.scanRadius;
        user.description = response.description;
        return user;
    }
}