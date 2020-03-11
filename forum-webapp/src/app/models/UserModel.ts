export class User {
    // tslint:disable-next-line: variable-name
    public _id: string;
    public name: string;
    public lastname: string;
    public email: string;
    public password: string;
    public image: string;
    public role: string;
    constructor() {
        this._id = '';
        this.name = '';
        this.lastname = '';
        this.email = '';
        this.password = '';
        this.image = '';
        this.role = 'ROLE_USER';
    }
}
