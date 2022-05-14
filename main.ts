import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/lib/websocket.ts";
import { joinLobby, ping } from "./events.ts";
import { Global } from "./Interfaces.ts";
import { Connection } from "./Connection.ts";

declare global {
    const basegame: Global;
    interface Window {
        basegame: Global;
    }
}


window.basegame = {
    games: new Map(),
    players: new Map(),
}

const wss = new WebSocketServer(80);


setInterval(() => {
    console.log([...wss.clients].map(ws => !ws.isClosed).length)
}, 1000);



wss.on("connection", function (ws: WebSocketClient) {
    console.log("socket connected!");
    const connection = new Connection(ws);

    connection.register("joinLobby", joinLobby);
    connection.register("ping", ping);

});