export interface DecodedToken {
    sub: string;
    nameid: string;
    name: string;
    givenname: string;
    surname: string;
    status: string;
    role: string | string[];
    exp: number;
    iss: string;
    aud: string;
    [key: string]: any;
}