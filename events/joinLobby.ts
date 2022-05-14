import { Game } from '../Game.ts';
import { Player } from '../Player.ts';
import { EventHandlerCallback } from '../Interfaces.ts';
import { Connection } from '../Connection.ts';

type Data = { username: string, lobbyCode: string };

export const joinLobby: EventHandlerCallback = (connection: Connection, data: Data): void => {
    const { games, players } = basegame;
    const { username, lobbyCode } = data;

    if (!games.get(lobbyCode)) games.set(lobbyCode, new Game(lobbyCode));
    const game = games.get(lobbyCode) as Game;

    const player = new Player(connection, username, game);

    if (game.getPlayer(username)) {
        connection.send('joinLobby', {
            error: 'Username already taken',
        });
        return;
    }

    players.set(username, player);
    game.join(player);

    connection.send("joinLobby", game.getInformation());
}
