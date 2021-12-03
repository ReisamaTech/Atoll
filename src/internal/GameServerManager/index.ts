import * as path from 'path';
import {AppPaths} from '../../appSettings';

const zipread = require("zipread");

export default class GameServerManager {
    constructor () {
        this.importGame("A Link to the Past");
    }

    async importGame(gameName:string){
        const importLocation = path.resolve(`${AppPaths.WORLDS}/${gameName}`);
        console.log(importLocation);
        try {
            const gameData = await import(importLocation);
            gameData.init();
            gameData.generateSeed(path.resolve(`${AppPaths.PLAYERS}/Sample.json`));
        }catch (err){
            console.log(`An error occurred trying to load ${importLocation} -- See below:`);
            console.error(err);
        }
    }
}