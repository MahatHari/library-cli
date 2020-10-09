import fs from 'fs';
import { IUser, IBook } from '../typing';

class Users{
    public data: IUser[] = [];
    public signedUser: IUser | null = null;

    /**
     * Constructor method
     */
    constructor() {
        this.loadFromJSON();
    }
    /**
     * loadFromJSON load data from json file
     * @param fileName='./database/users.json' :void
    */
    public loadFromJSON(fileName='./database/users.json'):void {
        this.data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    }

    /**
     * saveToJSON - Saves data object to JSON file
     */
    public saveToJSON(fileName = './database/users.json'):void {
        fs.writeFileSync(fileName, JSON.stringify(this.data), 'utf-8');
    }

    /**
     * generateID() - generate new user Id 
     */
    public generateID():string {
        const num = String(Date.now());
        const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const c = (str: string): string => {
            return str.charAt(Math.floor(Math.random() * str.length));
        };
        const id = c(str) + c(str) + num.substr(-6) + c(str);
        return id;
    }

    /**
     * getUserById()
     * Searches the data array and retrives User with given ID, otherwise return null
     * @param id
     */
    public getUserById(id:string):IUser|null {
        return this.data.find(user => user.id === id) ??null;
    }

    /**
     * add () -> create a new user and add it to JSON database
     * @param name:string, 
     * @param password:string     */
    public add(name:string, password:string):IUser {
        const newUser: IUser = {
            name: name,
            password: password,
            id: this.generateID(),
            bookHistory: []
        };
        this.data.push(newUser);
        this.saveToJSON();
        this.logIn(newUser.id, newUser.password); //Login the currently created user

        return newUser;
    }

    /**
     * logIn(), Logs the user in 
     * @param id
     * @param password
     */
    public logIn(id:string, password:string):boolean {
        const user = this.data.find((user: IUser) => user.id === id && user.password === password);

        if (user) {
            this.signedUser = user;
            return true;
        }
        return false;
    }

    /**
     * logOut
     * @parms     */
    public logOut():boolean {
        this.signedUser = null;
        return true;
    }

    /**
     * changeName
     * @param userId
     */
    public changeName(newName:string):boolean{
        if (this.signedUser !== null) {
            this.signedUser.name = newName;
            const userId = this.signedUser.id;
            this.data.splice(this.data.findIndex(
                (user) => user.id === userId),
            1, this.signedUser);
        }
    }

    /**
     * removeAccount
     *  Remove User Account
     *    
     */
    public removeAccount():boolean {
        if (this.signedUser !== null) {
            const userId = this.signedUser.id;

            this.data.splice(
                this.data.findIndex(
                    (user) => user.id === userId),
                1
            );
            this.saveToJSON();
            this.logOut();
            return true;
        }
        return false;
    }

    /**
     * addToBookHistory
     * @param book
     */
    public addToBookHistory(book:IBook,copyId:string):boolean {
        if (this.signedUser !== null) {
            const userId = this.signedUser.id;

            //update signed user book history[]
            this.signedUser.bookHistory?.push({
                bookIsbn: book.isbn,
                copyId: copyId,
                from: new Date().toISOString(),
                to: null
            });

            //update the change in user 'in memory database'
            this.data.splice(
                this.data.findIndex((user) => user.id === userId),
                1,
                this.signedUser
            );
            this.saveToJSON();
            return true;
        }
        return false;
    }

    /**
     * updateBookHistoryOnReturn()
     * @param book
     * @param copyId
     */
    public updateBookHistoryOnReturn(book:IBook, copyId:string) {
        if (this.signedUser !== null) {
            const userId = this.signedUser.id;
            
            const historyRecordIndex = this.signedUser.bookHistory?.findIndex(
                (history) => history.bookIsbn === book.isbn &&
                    history.copyId === copyId &&
                    history.to === null
            );

            if (historyRecordIndex === undefined) {
                return false;
            }
            this.signedUser.bookHistory?.splice(historyRecordIndex, 1, {
                ...this.signedUser.bookHistory[historyRecordIndex],
                to: new Date().toISOString()
            });

            //update the change in users 'in memory database'
            this.data.splice(
                this.data.findIndex(user => user.id === userId),
                1,
                this.signedUser
            );

            //saving changes in json database
            this.saveToJSON();
            return true;
        }
        return false;
    }

}

export default new Users();