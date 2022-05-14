import { EventHandlerCallback } from '../Interfaces.ts';
import { Connection } from '../Connection.ts';

export const ping: EventHandlerCallback = (connection: Connection): void => {
    connection.send("ping", crypto.randomUUID());
} 
