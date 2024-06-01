import { RobotResponse } from "../responses/robot-response";
import { Client } from "./Client";
import { GeoCoordinates } from "./GeoCoordinates";

export class Robot extends Client{
    groupId: string = '';
    static fromResponse(response: RobotResponse): Robot {
        let robot = new Robot();
        robot.id = response.id;
        robot.nickname = response.nickname;
        robot.createdAt = new Date(response.createdAt);
        robot.location = response.location ?? new GeoCoordinates();
        robot.type = response.type;
        robot.status = response.status;
        robot.scanRadius = response.scanRadius;
        robot.accessLevel = response.accessLevel;
        robot.groupId = response.groupId;
        return robot;
    }
}