import { Player } from './Player.ts';
import { GameInformation } from './Interfaces.ts';

export class Game {
    gameName: string;
    players: Player[];

    constructor(gameName: string) {
        this.gameName = gameName;
        this.players = [];
        console.log("Created game " + gameName);
    }

    getInformation(): GameInformation {
        return {
            lobbyCode: this.gameName,
            players: this.players.map(player => player.username),
        };
    }

    getPlayer(username: string): Player | undefined {
        return this.players.find(player => player.username === username);
    }

    broadcast(event: string, data: unknown) {
        this.players.forEach(player => player.connection.send(event, data));
    }

    join(player: Player) {
        this.players.push(player);
        this.broadcast('playerJoined', player.username);
    }

    leave(player: Player) {
        const index = this.players.indexOf(player);
        if (index !== -1) {
            this.players.splice(index, 1);
            this.broadcast('playerLeft', player.username);
        }

        if (this.players.length == 0) {
            basegame.games.delete(this.gameName);
        }
    }
}