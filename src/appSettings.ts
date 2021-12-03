import * as path from 'path';
export const UserHome = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
export const AppPaths = {
    WORLDS : path.join(UserHome, "ATOLL" ,"WORLDS"),
    PLAYERS : path.join(UserHome, "ATOLL" ,"PLAYERS")
};