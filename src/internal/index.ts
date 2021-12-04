import * as express from 'express';
import GameServerManager from './GameServerManager';

module.exports = function (logger) {

    const router = express.Router({
        strict: true
    });
    
    const gameServer: GameServerManager = new GameServerManager(logger, router);
    //console.log(router);
    return { router };
};