import * as path from 'path';
import {AppPaths} from '../../appSettings';
import * as express from 'express';

const zipread = require("zipread");

export default class GameServerManager {
    private logger;
    private router;
    constructor (parentLogger, router) {
        this.router = router;
        this.logger = parentLogger.child({area:"GameServerManager"});
        this.importGame("A Link to the Past");
    }

    async importGame(gameName:string){
        const importLocation = path.resolve(`${AppPaths.WORLDS}/${gameName}`);
        this.logger.info(importLocation);
        try {
            const gameData = await import(importLocation);
            const GAME = gameData.init(this.logger, express);
            console.log(GAME);
            this.router.use(GAME.router);
            //const sample = await import(path.resolve(`${AppPaths.PLAYERS}/Sample.json`));
            //gameData.generateSeed(sample);
        }catch (err){
            this.logger.info(`An error occurred trying to load ${importLocation} -- See below:`);
            this.logger.error(err);
        }
    }
}