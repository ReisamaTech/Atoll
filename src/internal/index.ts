import * as express from 'express';
import GameServerManager from './GameServerManager';

const gameServer:GameServerManager = new GameServerManager();

export const InternalAPI = express.Router({
    strict: true
});