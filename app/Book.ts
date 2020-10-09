
import { IBook } from '../typing';

export default class Book{
    public data: IBook;
    public published: Date;

    /** 
     * Constructor Method
     * @param book
      */
    constructor(book: IBook) {
        this.data = book;
        this.published = new Date(book.published);
    }

    /**
     *  Date formatting
     * @param date
     */ 
    private formattedDate(date:string):string {
        return new Date(date).toDateString();
    }

  
    /**
     * availableCount ():void
     */
    public availableCount():number {
        return this.data.copies.reduce((count, item) => { return item.status === 'inLibrary' ? count++ : count; },0);
    }
    /**
    * printDetails():void
    */
    public printDetails():void {
        console.log(`
            ${this.data.title} by ${this.data.author} ${this.data.published} \n
            Books in Library : ${this.data.copies.length} \n
            Available for borrwing: ${this.availableCount()}
        `);
    }
}