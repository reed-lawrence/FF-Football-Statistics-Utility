import { IGameData } from "./igame-data";

export class IPlayer {
    Id: number;
    Name: string;
    Position: string;
    Team: string;
    GameData: IGameData[];
}
