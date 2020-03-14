import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/UserModel';
import { Router } from '@angular/router';
import { CONFIG } from './services/config.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
    public title = 'forum-webapp';
    public identity: User;
    public token: string;
    public uri: string;

    constructor(private _userService: UserService, private _router: Router) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.uri = CONFIG.uri;
    }

    ngOnInit() {
        // console.log(this.identity);
        // console.log(this.token);
    }

    ngDoCheck() {
        this.identity = this._userService.getIdentity();
    }

    logout() {
        localStorage.clear();
        this.token = null;
        this.identity = null;

        this._router.navigate(['/inicio']);
    }
}
