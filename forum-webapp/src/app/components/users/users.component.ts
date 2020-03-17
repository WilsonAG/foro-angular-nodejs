import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/UserModel';
import { CONFIG } from '../../services/config.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    public titlePage: string;
    public users: Array<User>;
    public uri: string;

    constructor(private _userService: UserService) {
        this.uri = CONFIG.uri;
        this.titlePage = 'Compañeros';
    }

    ngOnInit(): void {
        this.getUsers();
    }

    getUsers() {
        this._userService.getUsers().subscribe(
            res => {
                if (res.users) {
                    this.users = res.users;
                }
            },
            err => {
                console.log(err);
            }
        );
    }
}
