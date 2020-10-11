import input from 'readline-sync';
import Users from './Users';
import Library from './Library';
import Book from './Book';

import { IGuestCommands, IMemberCommands, GuestCommandsKeys, MemeberCommandsKeys, IBook} from '../typing';



const commonCommands = {
    help: (): void => help(),
    search: (): void => search(),
    quit: (): void => quit(),
};

const guestCommands: IGuestCommands = {
    ...commonCommands,
    signup: () => signUp(),
    login: () => logIn(),
};

const memberCommands: IMemberCommands = {
    ...commonCommands,
    list: () => listBooks(),
    borrow: () => borrowBook(),
    return_book: () => returnBook(),
    change_name: () => changeName(),
    remove_account: () => removeAccount(),
    logout:()=>logOut(),     
};

/**
 * Commands Aavailable for all users
 */

/**
 * Help Meu
*/
export const help = (): void => {
    console.log(
        `
            Here’s a list of commands you can use!
            
            AVAILABLE EVERYWHERE
            help                Prints this listing.
            quit                Quits the program.
            search              Opens a dialog for searching for a book in the library system.

            ONLY AVAILABLE WHEN LOGGED OUT
            signup              Opens a dialog for creating a new account.
            login               Opens a dialog for logging into an existing account.
            
            ONLY AVAILABLE WHEN LOGGED IN
            list                Lists the books you are currently borrowing.
            borrow              Opens a dialog for borrowing a book.
            return              Opens a dialog for returning a book.
            changeName         Opens a dialog for changing the name associated with the account.
            removeAccount      Opens a dialog for removing the currently logged in account from the library system.
            logOut              Logs out the currently logged in user.
`,
    );
    return mainMenu();
};

export const quit = (): void => {
    console.log(`Good Bye !!!`);
    return;
};

export const logOut = ():void =>{ 
    if (Users.logOut()) {
        console.log(`Successfully Singout`);
    }
    return mainMenu();
};

export const unknowCommands = (): void => { 
    console.log(`Unknown commands, type 'help' to check available commands`);
    return;
};

const chooseBookFromList = (bookList: IBook[]): void => { 
    console.log(`$ ${bookList.length} books(s) found:`);

    const validOptions: number[] = [];
    bookList.map((book: IBook, index: number) => {
        console.log(`\n Result ${index + 1} :\n`);
        const bookInstance = new Book(book);

        bookInstance.printDetails();
        if (bookInstance.availableCount()) {
            validOptions.push(index + 1);
        }
    });
    if (validOptions.length === 0) {
        console.log(`$ While your serch did return results, we currently have none of the copies aviable`,
            `Please perform a new search !`);
        return search(false);
    }
    console.log(`\nTo select a book to borrow, enter the result number. Press enter to quit dialog.`);
    console.log(`Valid options are: ${validOptions.join(', ')}`);

    let choice = 'foo';
    let firstRun = true;

    while (!validOptions.includes(parseInt(choice)) && choice !== '') {
        if (!firstRun) {
            console.log(`This is not a valid option. Try again or press enter to quit the dialog!`);
        } else {
            firstRun = false;
        }
        choice=input.question(`> `);
    }
    if (choice === '') {
        return mainMenu(`$Cancelled `);
    }
    return borrowBook(bookList[parseInt(choice) - 1]);
};

export const search = (intro = true, option: string | null = null): void => {
    if (intro) {
        console.log(`$ Search for a book to brrow by choosing one of the options belwo. Enter will quit the dialog`);
    }
    let freshInstance = false;
    let book: IBook | null = null;
    let books: IBook[];

    if (!option) {
        freshInstance = true;
        console.log(`\n$ [1] by Book ISBN`, `\n$ [2] by Book Author`, `\n$ [3] by Book Title`, `\n`);
        option = input.question(`> `);
    }
    switch (option){
    case '1':{
        if (freshInstance) console.log(`$ Please type the ISBN of the book to borrow`);
        const isbn = input.question(`> `);
        if (!isbn) {
            return mainMenu(`$ Cancelled`);
        }
        book = Library.getBookByIsbn(isbn);

        if (!book) {
            console.log(`$ No books found for that ISBN. Try again, or press enter to quit dialog.`);
            return search(false, option);
        }

        const bookInstance = new Book(book);

        console.log(`$ Found book`);
        bookInstance.printDetails();
            
        if (bookInstance.availableCount()) {
            console.log(
                `\n$ Would you like to borrow ${bookInstance.data.title} by 
                    ${bookInstance.data.author} (${bookInstance.published.getFullYear()})? press y to confirm.`,
                `\n$ Anything else will quit the dialog.`,
            );
            const borrowing = input.question(`> `).toLowerCase();

            if (borrowing === 'y') {
                return borrowBook(book);
            }

            return mainMenu(`$ Cancelled.`);
        } else {
            console.log(
                `$ While our library does own this book, we currently have no copies available`,
                `Please perform a new search!`,
            );
            return search(false);
        }
    }
    case '2': {
        if (freshInstance) console.log(`$ Please type the Author of the book to borrow.`);
        const author = input.question(`> `);

        if (!author) {
            return mainMenu(`$ Cancelled`);
        }

        books = Library.getBooksByAuthor(author);
        if (!books.length) {
            console.log(`$ No books found for that Author. Try again, or press enter to quit dialog.`);
            return search(false, option);
        }

        return chooseBookFromList(books);
    }
    case '3': {
        if (freshInstance) console.log(`$ Please type the Title of the book to borrow.`);
        const title = input.question(`> `);

        if (!title) {
            return mainMenu(`$ Cancelled`);
        }

        books = Library.getBookByTitle(title);
        if (!books.length) {
            console.log(`$ No books found for that Title. Try again, or press enter to quit dialog.`);
            return search(false, option);
        }
        return chooseBookFromList(books);
    }
    case '':
        return mainMenu(`$ Cancelled`);
    default:
        console.log(`$ Input is not valid. Valid options are 1, 2 or 3 as described below.`);
        return search(false);
    }

};

/**
 * Set Password Menu
 */
export const setPassword = (): string => {
    console.log(`$ Insert new password.`);
    const password: string = input.question(`> `);

    console.log(`$ Re-enter your password`);
    const rePassword: string = input.question(`> `);

    if (password !== rePassword) {
        console.log(`$ Passwords do not match `);
        return setPassword();
    }
    console.log(`$ Password match`);
    return password;
};

/**
 * confirm password menu
 */

export const confirmPassword = (retry = false): boolean => {
    if (retry) {
        console.log(`Password Incorrect`);
    } else {
        console.log(`Please type your password to continue`);
    }
    const password: string = input.question(`> `);
    if (password === '') {
        return false;
    } else {
        return confirmPassword(true);
    }
};

/**
 * Sign Up menu
 */
export const signUp = (): void => {
    console.log(`Creating a new user account`);
    console.log(`Insert your name`);
    const name: string = input.question(`> `);
    const password = setPassword();

    if (name && password) {
        const newUser = Users.addUser(name, password);
        console.log(`Your account is created`);
        console.log(`Your account id is ${newUser.id}`);
        console.log(`Store your account id safe`);
    } else {
        console.log(`Please check your input and try again`);
    }
    return mainMenu();
};

/**
 * Login Menu
 */
export const logIn = (intro = true, id = ''): void => {
    if (!id) {
        if (intro) {
            console.log(`Type your account ID to log in`);
        }
        id = input.question(`> `);
        if (!id) {
            console.log(`Cancelled`);
        }
    }
    if (!Users.getUserById(id)) {
        console.log(`User account not found/does not exist`);
        return logIn(false);
    }
    console.log(`Enter you password`);

    const password: string = input.question(`> `);
    if (Users.logIn(id, password)) {
        return mainMenu(`Welcome ${Users.signedUser?.name}, you are now logged In`);
    } else {
        console.log(`Wrong password, Try again`);
        return logIn(false, id);
    }
};

/**
* List Books menu
*/
export const listBooks = (displayOnly = false): void => {
    if (!Users.signedUser || !Users.signedUser.id) {
        return mainMenu(`You need to signup or logIn first`);
    }
    const signedUserId = Users.signedUser.id;
    const borrwedBook = Library.getBorrowed(signedUserId);

    borrwedBook.map((book: IBook, index) => {

        console.log(`\n$ Book # ${index + 1}`);
        new Book(book).printDetails();
    });

    if (!borrwedBook.length) {
        return mainMenu(`$ You currently have no brrowed books. Please start by using the command 'borrow' `);
    }
    if (!displayOnly) {
        return mainMenu(`\n $ If you want to return books you should use the comman 'return `);
    }

};

/**
 * Return book menu
 * @param intro
 */
export const returnBook = (intro = false): void => {
    if (!Users.signedUser || !Users.signedUser.id) {
        return mainMenu(`You need to signup or login first !`);
    }

    const signedUserId = Users.signedUser.id;
    const borrowedBooks = Library.getBorrowed(signedUserId);
    
    const validOptions = borrowedBooks.map((item, index) => index + 1);

    if (!intro) {
        console.log(`$ Here is the list of books you currently have borrowed`);
        listBooks(true);
        console.log(
            `\n Please select the book you would like to return by entering its number in the list`,
            `\n Valid options are : ${validOptions.join(', ')}`,
            `\n$ Enter will close the dialog`
        );
    }
    else {
        console.log(`$ Valid options are :${validOptions.join(', ')}`, `\n$ Enter will close the dialog`);
    }
    const returnOption = input.question(`> `);

    if (!returnOption) {
        return mainMenu(`$Cancelled`);
    }

    if (validOptions.includes(parseInt(returnOption))) {
        const bookToReturn = borrowedBooks[parseInt(returnOption) - 1];
        const returnedCopyId = Library.returnBook(signedUserId, bookToReturn);
        Users.updateBookHistoryOnReturn(bookToReturn, returnedCopyId);
        return mainMenu(`$ Book Successfully returned`);
    } else {
        return returnBook(true);
    }

};

/**
 * Borrow Book menu
 * @param book
 */
export const borrowBook = (book: IBook | null = null): void => {
    if (!Users.signedUser) {
        return mainMenu(`You need to login to borrow a book`);
    }
    if (book) {
        const borrowedCopy = Library.borrowBook(book, Users.signedUser.id);
        Users.addToBookHistory(book, borrowedCopy);
        return mainMenu(`$ Borrowed`);
    }
    return search();
};

/**
 * Change Name menu
 */

export const changeName = (): void => {
    console.log(`Change user name `);
    console.log(`Type new Name`);
    const name: string = input.question(`> `);

    if (Users.changeName(name)) {
        console.log(`Your name has been changed to ${name}`);
    }
    return mainMenu();
};

export const removeAccount = (intro = true): void => {
    if (!Users.signedUser && !Users.signedUser.id) {
        return mainMenu();
    }
    const userId = Users.signedUser.id;
    if (intro) {
        console.log(`$ Do you want to remove this account from the library system? (y/n)`);
    }
    const confirmation = input.question(`> `).toLowerCase();

    switch (confirmation) {
    case 'y':
        if (Library.getBorrowed(userId).length) {
            return mainMenu(`You must first return ${Library.getBorrowed(userId).length} borrowed book(s)!`);
        }
        if (confirmPassword()) {
            Users.removeAccount();
            return mainMenu(`Account removed successfully`);
        } else {
            return mainMenu(`$Cancelled, could not remove account`);
        }
    case 'n': 
        return mainMenu(`Thank you for staying with us`);
    default:
        console.log(`$ Not valid option, choose y for Yes and n for No! `);
        return removeAccount(false);
    }
};

/**
 * 
 */
export const mainMenu = (intro = ''): void => {
    if (intro) {
        console.log(intro);
    }
    const command = input.question(`> `).toLowerCase();

    if (Users.signedUser && isMemberKey(command)) {
        return (memberCommands[command]);
    }
    if (!Users.signedUser && isGuestKey(command)) {
        return guestCommands[command]();
    }
    return mainMenu(`Uknown Command! Type 'help' to get list of available commands`);

};

/**
 * 
 */
const isGuestKey = (key: string): key is GuestCommandsKeys => {
    return ['help', 'search', 'quit', 'signup', 'login'].includes(key);
};

const isMemberKey = (key: string): key is MemeberCommandsKeys => {
    return ['help', 'search', 'quit', 'list', 'borrow', 'return', 'change_name', 'remove_account', 'logout'].includes(key);
};