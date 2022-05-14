import { Game } from "./Game.ts";
import { Connection } from "./Connection.ts";
import { ClientPlayer } from "./Interfaces.ts";

export class Player {
    game: Game;
    username: string;
    connection: Connection;
    id: string;

    constructor(connection: Connection, name: string, game: Game) {
        this.game = game;
        this.username = name;
        this.connection = connection;
        this.id = crypto.randomUUID();
    }

    getClientPlayer(): ClientPlayer {
        return {
            username: this.username,
            id: this.id,
        };
    }
}
