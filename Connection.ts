import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.4/lib/websocket.ts";
import { EventHandler, EventHandlerCallback } from "./Interfaces.ts";

export class Connection {
    ws: WebSocketClient;
    eventHandlers: Map<string, EventHandler[]>;

    constructor(ws: WebSocketClient) {
        this.ws = ws;
        this.eventHandlers = new Map();

        this.ws.on("message", this.onMessage.bind(this));
        this.ws.on("open", this.onOpen.bind(this));
        this.ws.on("close", this.onClose.bind(this));
        this.ws.on("error", this.onError.bind(this));
    }


    /**
     * Returns if the connection is still open.
     * @returns Boolean indicating if the connection is open.
     */
    isConnected(): boolean {
        return !this.ws.isClosed;
    }

    /**
     * Register an event handler to be called when a message is received.
     * @param eventName The name of the event.
     * @param callback The callback to be called when the event is received.
     */
    // deno-lint-ignore no-inferrable-types
    register(eventName: string, cb: EventHandlerCallback, once: boolean = false): void {

        if (!(eventName in this.eventHandlers)) this.eventHandlers.set(eventName, []);
        const handlers = this.eventHandlers.get(eventName) as EventHandler[];
        handlers.push({ once, cb });
    }

    send(eventName: string, data: unknown) {
        this.ws.send(JSON.stringify({ eventName, data }));
    }

    sendExpectAnswer(eventName: string, data: unknown) {
        this.send(eventName, data);
        return new Promise((resolve) => {
            this.register(eventName, resolve, true);
        });
    }

    onMessage(text: string): void {
        const { eventName, data } = JSON.parse(text);
        if (this.eventHandlers.get(eventName)) {
            const handlers = this.eventHandlers.get(eventName) as EventHandler[];

            handlers.forEach(handler => {
                const { once, cb } = handler;
                cb(this, data);
                if (once) handlers.splice(handlers.indexOf(handler), 1);
            });
        }
    }

    onOpen(): void {
        console.log("open");
    }

    onClose(): void {
        basegame.players.forEach(player => {
            if (player.connection == this) {
                player.game.leave(player);
                basegame.players.delete(player.username);
            }
        });
    }

    onError(err: string): void {
        console.log(err);
    }
}