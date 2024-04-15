export class Group {
    id: string = '';
    name: string = '';
    description: string = '';
    createAt: Date = new Date();
    accessLevel: number = 0;
}

export class GroupDetail extends Group {
    members: string[] = [];
    admins: string[] = [];
}