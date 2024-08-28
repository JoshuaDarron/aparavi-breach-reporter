class ExtendableError extends Error {
    status: number;
    isPublic: boolean;
    name: string;

    constructor (message: string, status: number, isPublic: boolean) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.isPublic = isPublic;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class APIError extends ExtendableError {
    constructor (message: string = '', status: number = 500, isPublic: boolean = true) {
        super(message, status, isPublic);
    }
}
