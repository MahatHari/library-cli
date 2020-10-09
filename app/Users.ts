import fs from 'fs';
import { IUser, IBook } from '../typing';

class User{
    public data: IUser[] = [];
    public signedUser: IUser | null = null;

    /**
     * Constructor method
     */
    constructor() {
        this.loadFromJSON();
    }
    /**
     * loadFromJSON
     * @param fileName='./database/users.json' :void
    */
    public loadFromJSON(fileName='./database/users.json'):void {
        this.data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    }

    /**
     * saveToJSON
     */
    public saveToJSON(fileName = './database/users.json'):void {
        fs.writeFileSync(fileName, JSON.stringify(this.data), 'utf-8');
    }

}