import { Game } from "./Game.ts";
import { Player } from "./Player.ts";
import { Connection } from "./Connection.ts";

export type Global = {
  games: Map<string, Game>;
  players: Map<string, Player>;
};

export type GameInformation = {
  lobbyCode: string;
  players: string[];
};

export type ClientPlayer = {
  username: string;
  id: string;
};

// deno-lint-ignore no-explicit-any
export type EventHandlerCallback = (connection: Connection, data: any) => void;

export type EventHandler = {
  once: boolean;
  cb: EventHandlerCallback;
};
