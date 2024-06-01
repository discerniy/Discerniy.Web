import { ClientStatus, ClientType } from "../data/Client";
import { ClientPermissions } from "../data/ClientPermission";
import { GeoCoordinates } from "../data/GeoCoordinates";

export class RobotCreatedResponse {
    id: string = '';
    key: string = '';
    token: string = '';
}

export class RobotResponse {
    id: string = '';
    nickname: string = '';
    createdAt: Date = new Date();
    type: ClientType = ClientType.Robot;
    permissions: ClientPermissions = new ClientPermissions();
    updateLocationSecondsInterval: number = 0;
    status: ClientStatus = ClientStatus.Inactive;
    scanRadius: number = 0;
    location?: GeoCoordinates = new GeoCoordinates();
    accessLevel: number = 0;
    groupId: string = '';
}