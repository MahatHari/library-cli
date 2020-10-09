import fs, { copyFile } from 'fs';
import {IBook} from '../typing'

class Library {
    /**
     * books:IBook    */
    public books: IBook[]=[];

    /**
     * Constructor Method
     */
    constructor() {
        this.loadFromJson();
    }

    /**
     * LoadFromJson()
     */
    public loadFromJson(fileName='./database/books.json'):void {
        this.books = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    }

    /**
     * saveToJson():void 
     **/
    public saveToJson(fileName = './database/books.json'):void {
        fs.writeFileSync(fileName,JSON.stringify(this.books) ,'utf8');
    }

    /**
     * getBookByIsbn()
     * @param isbn
     */
    public getBookByIsbn(isbn:string):IBook|null {
        return this.books.find(book => book.isbn === isbn) ?? null;
    }

    /**
     * getBooksByAuthor
     * @param author
     */
    public getBooksByAuthor(author:string):IBook[] {
        return this.books.filter((book: IBook) => book.author === author));
    }

    /**
     * getBookByTitle
     * @param title
     */
    public getBookByTitle(title:string):IBook[] {
        return this.books.filter((book: IBook) => book.title === title);
    }

    /**
     * borrow
     * @param book
     * @param userId
     */
    public borrow(book:IBook, userId:string):string {
        const bookIndex = this.books.findIndex((elem) => elem === book);
        const copyIndex = book.copies.findIndex((copy) => copy.browerId === null && copy.status === 'inLibrary');

        const dueDate = new Date()
        dueDate.setMonth(dueDate.getMonth() + 1);

        const copyId = book.copies[copyIndex].id;

        this.books[bookIndex].copies.splice(copyIndex, 1, {
            id: copyId,
            status="borrowed",
            browerId=userId,
            dueDate=dueDate.toISOString()
        });
        this.saveToJson()
        return copyId;
    }

    /**
     * return
     * @param userId
     * @param book
     */
    public return(userId:string, book:IBook):string {
        const bookIndex = this.books.findIndex((elem) => elem === book)
        const copyIndex = book.copies.findIndex((copy) => copy.browerId === userId)
        
        const copyId = book.copies[copyIndex].id
        
        this.books[bookIndex].copies.splice(copyIndex, 1, {
            id: copyId,
            status: "inLibrary",
            dueDate: null,
            browerId:null
        })
        this.saveToJson()
        
        return copyId;
    }

    /**
     * getBorrowed()
     * @param userId:string
     * 
     */
    public getBorrowed(userId:string):IBook[] {
        return this.books.filter((book) => book.copies.some((copy) => copy.browerId === userId));
    }

}

export default new Library()