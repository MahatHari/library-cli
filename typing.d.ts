export interface IBook{
    isbn: string;
    title: string;
    author: string;
    published: string;
    publisher: string;
    pages: number;
    descritption: string;
    copies: IBookCopy[];
}
export type ILibrary = IBook[]

export interface IBookCopy{
    id: string;
    status: IBookCopyStatus;
    browerId: string | null;
    dueDate: string | null;
}

export type IBookCopyStatus = "inLibrary" | "borrowed" | "notAvailable";

export interface IUser{
    name: string;
    password: string;
    id: string;
    bookHistory: IBookHistroy[] | null;
}

export interface IBookHistroy{
    bookIsbn: string;
    copyId: string;
    from: string;
    to: string | null;
}

export interface IGuestCommands{
    help: function;
    search: function;
    quit: function;
    signup: function;
    login: function;
}

export interface IMemberCommands{
    help: function;
    search: function;
    quit: function;
    list: function;
    borrow: function;
    return: function;
    changeName: function;
    removeAccount: function;
    logout: function;
}

export type GuestCommandsKeys = keyof IGuestCommands;
export type MemeberCommandsKeys = keyof IMemberCommands;